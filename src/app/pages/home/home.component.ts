import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-[#fcfbf9] text-gray-900 font-sans">
      <!-- Hero Section -->
      <section class="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 z-10"></div>
        <img 
          src="https://picsum.photos/seed/restaurant/1920/1080" 
          alt="Le Jacquier Restaurant" 
          class="absolute inset-0 w-full h-full object-cover"
          referrerpolicy="no-referrer"
        />
        <div class="relative z-20 text-center text-white px-4 max-w-4xl">
          <p class="text-sm md:text-base uppercase tracking-[0.3em] mb-4 font-medium animate-fade-in">Bienvenue au</p>
          <h1 class="text-6xl md:text-8xl lg:text-9xl serif mb-6 animate-fade-in" style="animation-delay: 0.2s">Le Jacquier</h1>
          <p class="text-lg md:text-2xl font-light max-w-2xl mx-auto opacity-90 mb-10 animate-fade-in" style="animation-delay: 0.4s">
            L'excellence de la gastronomie franco-guinéenne au cœur de Conakry.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style="animation-delay: 0.6s">
            <a routerLink="/menu" mat-flat-button class="!bg-white !text-gray-900 !px-8 !py-6 !rounded-none !text-sm !tracking-widest !uppercase hover:!bg-gray-100 transition-colors">
              Découvrir la carte
            </a>
            <a routerLink="/reservation" mat-stroked-button class="!border-white !text-white !px-8 !py-6 !rounded-none !text-sm !tracking-widest !uppercase hover:!bg-white/10 transition-colors">
              Réserver une table
            </a>
          </div>
        </div>
      </section>

      <!-- Concept Section -->
      <section class="py-24 px-4 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p class="text-sm uppercase tracking-widest text-gray-500 mb-4">Notre Concept</p>
            <h2 class="text-4xl md:text-5xl serif mb-8 leading-tight">L'alliance parfaite entre deux cultures culinaires</h2>
            <p class="text-gray-600 leading-relaxed mb-6">
              Le Jacquier est né d'une passion pour la gastronomie française et de l'amour des produits du terroir guinéen. Notre chef sublime les ingrédients locaux avec des techniques culinaires raffinées pour créer une expérience gustative inédite.
            </p>
            <p class="text-gray-600 leading-relaxed mb-8">
              Chaque plat raconte une histoire, un voyage entre Paris et Conakry, dans un cadre élégant et chaleureux.
            </p>
            <a routerLink="/about" class="inline-flex items-center text-sm uppercase tracking-widest font-medium border-b border-gray-900 pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
              Découvrir notre histoire <mat-icon class="ml-2 text-sm">arrow_forward</mat-icon>
            </a>
          </div>
          <div class="relative h-[600px] rounded-xl overflow-hidden shadow-2xl">
            <img 
              src="https://picsum.photos/seed/chef/800/1200" 
              alt="Notre Chef" 
              class="absolute inset-0 w-full h-full object-cover"
              referrerpolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      <!-- Featured Dishes -->
      <section class="bg-gray-900 text-white py-24 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <p class="text-sm uppercase tracking-widest text-gray-400 mb-4">Signatures</p>
            <h2 class="text-4xl md:text-5xl serif">Nos Plats Emblématiques</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Dish 1 -->
            <div class="group cursor-pointer">
              <div class="relative h-80 overflow-hidden rounded-lg mb-6">
                <img src="https://picsum.photos/seed/dish1/600/800" alt="Plat 1" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerpolicy="no-referrer">
              </div>
              <h3 class="text-xl serif mb-2">Filet de Bœuf au Fonio</h3>
              <p class="text-gray-400 text-sm mb-4">Sauce au poivre de Penja, mousseline de patate douce.</p>
              <span class="text-lg font-medium">35 €</span>
            </div>
            
            <!-- Dish 2 -->
            <div class="group cursor-pointer">
              <div class="relative h-80 overflow-hidden rounded-lg mb-6">
                <img src="https://picsum.photos/seed/dish2/600/800" alt="Plat 2" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerpolicy="no-referrer">
              </div>
              <h3 class="text-xl serif mb-2">Bar Grillé & Sauce Mafé</h3>
              <p class="text-gray-400 text-sm mb-4">Légumes croquants, émulsion d'arachide torréfiée.</p>
              <span class="text-lg font-medium">28 €</span>
            </div>
            
            <!-- Dish 3 -->
            <div class="group cursor-pointer">
              <div class="relative h-80 overflow-hidden rounded-lg mb-6">
                <img src="https://picsum.photos/seed/dish3/600/800" alt="Plat 3" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerpolicy="no-referrer">
              </div>
              <h3 class="text-xl serif mb-2">Mille-feuille Mangue Passion</h3>
              <p class="text-gray-400 text-sm mb-4">Crème légère à la vanille de Madagascar, coulis exotique.</p>
              <span class="text-lg font-medium">14 €</span>
            </div>
          </div>
          
          <div class="text-center mt-16">
            <a routerLink="/menu" mat-stroked-button class="!border-white !text-white !px-8 !py-6 !rounded-none !text-sm !tracking-widest !uppercase hover:!bg-white hover:!text-gray-900 transition-colors">
              Voir toute la carte
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.8s ease-out forwards;
      opacity: 0;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}
