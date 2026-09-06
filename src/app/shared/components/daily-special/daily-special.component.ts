
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage, DecimalPipe } from '@angular/common';
import { Dish } from '../../../core/models';

@Component({
  selector: 'app-daily-special',
  standalone: true,
  imports: [NgOptimizedImage, DecimalPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative bg-jacquier-dark rounded-3xl overflow-hidden shadow-2xl group">
      <div class="grid md:grid-cols-2">
        <div class="p-10 md:p-16 flex flex-col justify-center text-white relative z-10">
          <div class="inline-block bg-jacquier-primary text-white text-xs font-bold px-4 py-2 rounded-full w-max mb-6 uppercase tracking-widest shadow-md">
            Suggestion du Chef
          </div>
          <h2 class="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">{{ dish().name }}</h2>
          <p class="text-jacquier-light font-light mb-8 leading-relaxed text-lg">{{ dish().description }}</p>
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <span class="text-3xl font-bold text-jacquier-gold">{{ dish().price | number:'1.0-0' }} FG</span>
            <a routerLink="/reservation" class="px-8 py-3 border border-jacquier-gold text-jacquier-gold rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-jacquier-gold hover:text-jacquier-dark transition-colors duration-300">
              Réserver ce plat
            </a>
          </div>
        </div>
        <div class="relative h-80 md:h-auto bg-gray-800 overflow-hidden">
          <img [ngSrc]="dish().image" fill class="object-cover transform group-hover:scale-105 transition-transform duration-1000" [alt]="dish().name" referrerPolicy="no-referrer">
          <div class="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-jacquier-dark via-jacquier-dark/50 to-transparent"></div>
        </div>
      </div>
    </div>
  `
})
export class DailySpecialComponent {
  dish = input.required<Dish>();
}
