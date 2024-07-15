import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div class="hero min-h-screen">
      <div class="hero-content text-center">
        <img src="./box-viaggi-mondo-home.jpg" alt="">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">PRONTO A PARTIRE?</h1>
          <p class="py-6">Ecco qui una semplice e rapide TO DO List pa ricordarti di prendere tutto il necessario!</p>
          <button class="btn btn-primary">ANDIAMO!</button>
          
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class HomeComponent {

}
