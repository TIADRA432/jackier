import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-gallery',
  standalone: true,
  template: `
    <div class="min-h-screen bg-[#fcfbf9] text-gray-900 font-sans pt-24 pb-16">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="text-5xl md:text-6xl serif mb-12 text-center">Galerie</h1>
        <p class="text-center text-gray-500 mb-16 max-w-2xl mx-auto">
          Découvrez en images l'atmosphère unique du Jacquier, nos plats signatures et notre équipe passionnée.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (img of images; track img) {
            <div class="relative h-80 rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
              <img [src]="img" alt="Galerie Le Jacquier" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerpolicy="no-referrer">
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent {
  images = [
    'https://picsum.photos/seed/resto1/800/800',
    'https://picsum.photos/seed/resto2/800/800',
    'https://picsum.photos/seed/resto3/800/800',
    'https://picsum.photos/seed/resto4/800/800',
    'https://picsum.photos/seed/resto5/800/800',
    'https://picsum.photos/seed/resto6/800/800',
    'https://picsum.photos/seed/resto7/800/800',
    'https://picsum.photos/seed/resto8/800/800',
    'https://picsum.photos/seed/resto9/800/800',
  ];
}
