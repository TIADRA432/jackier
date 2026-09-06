
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero -->
    <div class="relative h-[50vh] flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
      <img ngSrc="https://picsum.photos/seed/gallery_hero/1920/1080" fill priority class="object-cover opacity-40" alt="Galerie" referrerPolicy="no-referrer">
      <div class="relative z-10 max-w-4xl mx-auto text-white animate-fade-in-up">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Immersion visuelle</span>
        <h1 class="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">Galerie</h1>
      </div>
    </div>

    <section class="py-24 bg-jacquier-cream px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
          <!-- Masonry-like grid using span classes -->
          <div class="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl group cursor-pointer shadow-lg">
            <img ngSrc="https://picsum.photos/seed/rest_ambiance/1200/800" fill class="object-cover transition-transform duration-1000 group-hover:scale-105" alt="Ambiance" referrerPolicy="no-referrer">
            <div class="absolute inset-0 bg-gradient-to-t from-jacquier-dark/80 via-jacquier-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
              <div>
                <span class="text-jacquier-gold text-sm font-bold tracking-widest uppercase mb-2 block">Atmosphère</span>
                <h3 class="text-white font-serif text-3xl font-bold">Ambiance Soirée</h3>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-3xl group cursor-pointer shadow-lg">
            <img ngSrc="https://picsum.photos/seed/dish1/600/600" fill class="object-cover transition-transform duration-1000 group-hover:scale-105" alt="Plat 1" referrerPolicy="no-referrer">
            <div class="absolute inset-0 bg-gradient-to-t from-jacquier-dark/80 via-jacquier-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <div>
                <span class="text-jacquier-gold text-xs font-bold tracking-widest uppercase mb-1 block">Création</span>
                <h3 class="text-white font-serif text-xl font-bold">Signature du Chef</h3>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-3xl group cursor-pointer md:row-span-2 shadow-lg">
            <img ngSrc="https://picsum.photos/seed/cocktail/600/1200" fill class="object-cover transition-transform duration-1000 group-hover:scale-105" alt="Cocktails" referrerPolicy="no-referrer">
            <div class="absolute inset-0 bg-gradient-to-t from-jacquier-dark/80 via-jacquier-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <div>
                <span class="text-jacquier-gold text-xs font-bold tracking-widest uppercase mb-1 block">Mixologie</span>
                <h3 class="text-white font-serif text-xl font-bold">Cocktails Maison</h3>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-3xl group cursor-pointer shadow-lg">
            <img ngSrc="https://picsum.photos/seed/dessert1/600/600" fill class="object-cover transition-transform duration-1000 group-hover:scale-105" alt="Dessert" referrerPolicy="no-referrer">
            <div class="absolute inset-0 bg-gradient-to-t from-jacquier-dark/80 via-jacquier-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <div>
                <span class="text-jacquier-gold text-xs font-bold tracking-widest uppercase mb-1 block">Douceur</span>
                <h3 class="text-white font-serif text-xl font-bold">Dessert Gourmand</h3>
              </div>
            </div>
          </div>
           
           <div class="relative overflow-hidden rounded-3xl group cursor-pointer md:col-span-2 shadow-lg">
            <img ngSrc="https://picsum.photos/seed/kitchen/1200/600" fill class="object-cover transition-transform duration-1000 group-hover:scale-105" alt="Cuisine" referrerPolicy="no-referrer">
            <div class="absolute inset-0 bg-gradient-to-t from-jacquier-dark/80 via-jacquier-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
              <div>
                <span class="text-jacquier-gold text-sm font-bold tracking-widest uppercase mb-2 block">Coulisses</span>
                <h3 class="text-white font-serif text-3xl font-bold">La Brigade en Action</h3>
              </div>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-3xl group cursor-pointer shadow-lg">
            <img ngSrc="https://picsum.photos/seed/terrace/600/600" fill class="object-cover transition-transform duration-1000 group-hover:scale-105" alt="Terrasse" referrerPolicy="no-referrer">
            <div class="absolute inset-0 bg-gradient-to-t from-jacquier-dark/80 via-jacquier-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <div>
                <span class="text-jacquier-gold text-xs font-bold tracking-widest uppercase mb-1 block">Extérieur</span>
                <h3 class="text-white font-serif text-xl font-bold">Terrasse Panoramique</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class GalleryComponent {}
