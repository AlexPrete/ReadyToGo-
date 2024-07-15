import { HttpClient } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Product } from '../model/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-to-buy',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <!-- Sezione per aggiungere un Nuovo prodotto -->
    <div class="w-full md:w-2/5 mx-auto my-4">
      <label class="input input-bordered flex items-center gap-2">
        <input type="text" (keydown.enter)="onAddProduct($event)" class="grow" placeholder="Aggiungi prodotto" />
        <kbd class="kbd kbd-sm">Enter</kbd>
      </label>
    </div>

    <!-- Sezione contatore prodotti -->
    <div class="w-full md:w-2/5 mx-auto my-5">
      <div class="flex justify-between">
        <button class="btn lg:btn-wide">
          Completati
          <div class="badge badge-accent">{{ completedProducts() }}</div>
        </button>
        <button class="btn lg:btn-wide">
          Da completare
          <div class="badge">{{ todoProducts() }}</div>
        </button>
      </div>
    </div>

    @defer(when products().length > 0) {
      <!-- Lista dei prodotti -->
      <div class="w-full md:w-2/5 mx-auto border border-neutral rounded-lg">
        @for (product of products(); track product.id) {
          <div class="flex justify-between">
          <!-- Pulsante e Nome -->
          <div class="flex items-center">
            <button class="btn btn-square btn-ghost" (click)="onDelete(product)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-error">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
            <!-- nome del prodotto -->
            <span class="label-text" [ngClass]="{'line-through text-accent': product.completed}">{{ product.name }}</span>
          </div>
          <!-- Checkbox -->
          <label class="label cursor-pointer mr-4">
            <input type="checkbox" [checked]="product.completed" class="checkbox" (click)="onCompleted(product)" />
          </label>
        </div>
        }
      </div>
    } @placeholder {
      <div class="w-full md:w-2/5 mx-auto">
        <div class="flex flex-col gap-4 w-full">
          <div class="flex gap-4 items-center">
            <div class="skeleton w-16 h-16 rounded-full shrink-0"></div>
            <div class="flex flex-col gap-4">
              <div class="skeleton h-4 w-20"></div>
              <div class="skeleton h-4 w-28"></div>
            </div>
          </div>
          <div class="skeleton h-32 w-full"></div>
        </div>
      </div>
    }
    
  `,
  styles: ``
})
export class ProductsToBuyComponent implements OnInit {
  http = inject(HttpClient);

  url: string = "http://localhost:3000/products";

  products = signal<Product[]>([]);

  completedProducts = computed(() => this.products().filter(product => product.completed).length);
  todoProducts = computed(() => this.products().filter(product => !product.completed).length);

  onAddProduct(event: any) {
    // console.log(event.target.value);
    let nameProduct: string = event.target.value;

    let newProduct: Product = {
      name: nameProduct,
      completed: false
    }

    this.http.post<Product>(this.url, newProduct).subscribe(res => {
      // console.log(res);
      // Aggiornare il Signal
      this.products.update( prev => [...prev, res] )

      // Reset campo input
      event.target.value = '';
      
    })
    
  }

  onCompleted(item: Product) {
    let updatedProduct = {...item, completed: !item.completed};

    this.http.patch<Product>(`${this.url}/${item.id}`, updatedProduct).subscribe(res => {
      this.products.update(prev => {
        return prev.map(p => p.id === item.id ? res : p)
      })
    })
  }

  onDelete(item: Product) {
    this.http.delete<Product>(`${this.url}/${item.id}`).subscribe(res => {
      this.products.update(prev => prev.filter(product => product.id !== res.id))
    })
  }

  ngOnInit(): void {
      this.http.get<Product[]>(this.url).subscribe( res => {
        // console.log(res);
        this.products.set(res)
      })
  }
}
