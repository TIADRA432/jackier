
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { MenuItemDto } from '../../../core/dto/menu.dto';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-dish-card',
  standalone: true,
  imports: [DecimalPipe, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group h-full flex flex-col border border-gray-100 transform hover:-translate-y-1">
      <div class="relative h-64 overflow-hidden bg-gray-100">
        <img [ngSrc]="dish().imageUrl" width="400" height="300" 
             class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" 
             [alt]="dish().name" referrerPolicy="no-referrer">
        <div class="absolute inset-0 bg-gradient-to-t from-jacquier-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div class="absolute top-4 right-4 flex flex-col gap-2 items-end">
          @if (dish().isLocalSpecialty) {
            <span class="bg-jacquier-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-widest backdrop-blur-sm bg-opacity-90">
              Spécialité
            </span>
          }
          @if (dish().isVegetarian) {
            <span class="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-widest backdrop-blur-sm bg-opacity-90">
              Végétarien
            </span>
          }
        </div>
      </div>
      
      <div class="p-8 flex-grow flex flex-col justify-between relative bg-white">
        <div>
          <div class="flex justify-between items-start mb-4 gap-4">
            <h3 class="text-2xl font-serif font-bold text-jacquier-dark group-hover:text-jacquier-primary transition-colors leading-tight">
              {{ dish().name }}
            </h3>
            <span class="text-xl font-bold text-jacquier-gold whitespace-nowrap bg-jacquier-cream px-3 py-1 rounded-lg">
              {{ dish().price | number:'1.0-0' }} FG
            </span>
          </div>
          <p class="text-jacquier-text font-light text-sm leading-relaxed mb-6 line-clamp-3">
            {{ dish().description }}
          </p>
        </div>
        <button class="w-full mt-auto py-3 border-2 border-jacquier-primary text-jacquier-primary rounded-xl hover:bg-jacquier-primary hover:text-white transition-all duration-300 text-xs font-bold uppercase tracking-widest">
          Ajouter
        </button>
      </div>
    </div>
  `
})
export class DishCardComponent {
  dish = input.required<MenuItemDto>();
}
