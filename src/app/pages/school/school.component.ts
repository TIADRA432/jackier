
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { RestaurantService } from '../../core/services/restaurant.service';

@Component({
  selector: 'app-school',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero -->
    <div class="relative h-[60vh] flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
      <img ngSrc="https://picsum.photos/seed/cooking_class_hero/1920/1080" fill priority class="object-cover opacity-40" alt="École de Gastronomie" referrerPolicy="no-referrer">
      <div class="relative z-10 max-w-4xl mx-auto text-white animate-fade-in-up">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Transmission & Excellence</span>
        <h1 class="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">École Guinéenne de Gastronomie</h1>
        <p class="text-lg md:text-2xl text-jacquier-light max-w-2xl mx-auto font-light leading-relaxed">
          Formez-vous aux côtés de nos chefs étoilés et devenez les ambassadeurs de la haute gastronomie de demain.
        </p>
      </div>
    </div>

    <!-- Intro / Mission -->
    <section class="py-24 bg-white px-4">
      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div class="lg:w-1/2">
          <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm mb-2 block">Notre Mission Institutionnelle</span>
          <h2 class="text-4xl md:text-5xl font-serif font-bold text-jacquier-primary mb-8">Former les Chefs de demain</h2>
          <p class="text-jacquier-text leading-relaxed mb-6 text-lg font-light">
            L'École Guinéenne de Gastronomie, intégrée au restaurant Le Jacquier, a pour mission de valoriser le patrimoine culinaire guinéen tout en enseignant les techniques internationales les plus rigoureuses.
          </p>
          <p class="text-jacquier-text leading-relaxed mb-10 text-lg font-light">
            Que vous soyez amateur passionné ou futur professionnel, nos programmes d'excellence allient théorie, pratique intensive et immersion réelle au cœur de nos cuisines.
          </p>
          <div class="flex gap-8">
             <div class="text-center p-6 bg-jacquier-cream rounded-2xl border border-gray-100 shadow-sm flex-1">
               <span class="block text-4xl font-serif font-bold text-jacquier-primary mb-2">50+</span>
               <span class="text-xs font-bold uppercase text-gray-500 tracking-wider">Étudiants / an</span>
             </div>
             <div class="text-center p-6 bg-jacquier-cream rounded-2xl border border-gray-100 shadow-sm flex-1">
               <span class="block text-4xl font-serif font-bold text-jacquier-primary mb-2">95%</span>
               <span class="text-xs font-bold uppercase text-gray-500 tracking-wider">Insertion Pro</span>
             </div>
          </div>
        </div>
        <div class="lg:w-1/2 relative">
          <div class="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group">
             <img ngSrc="https://picsum.photos/seed/cooking_class/800/600" fill class="object-cover transform group-hover:scale-105 transition-transform duration-700" alt="Cours de cuisine" referrerPolicy="no-referrer">
             <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          <!-- Decorative element -->
          <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-jacquier-gold/20 rounded-full blur-2xl -z-10"></div>
        </div>
      </div>
    </section>

    <!-- Programs -->
    <section class="py-24 bg-jacquier-cream px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm block mb-2">Cursus d'Excellence</span>
          <h2 class="text-4xl md:text-5xl font-serif font-bold text-jacquier-primary">Nos Programmes de Formation</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (program of programs(); track program.id) {
            <div class="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-2 bg-jacquier-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <div class="mb-6 flex justify-between items-start">
                <h3 class="text-2xl font-serif font-bold text-jacquier-dark pr-4">{{ program.title }}</h3>
                <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-jacquier-cream text-jacquier-primary font-bold shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </span>
              </div>
              
              <span class="inline-block bg-jacquier-cream text-jacquier-primary text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6">{{ program.level }}</span>
              
              <p class="text-gray-600 font-light leading-relaxed mb-8 min-h-[4.5rem]">{{ program.description }}</p>
              
              <div class="flex justify-between items-center border-t border-gray-100 pt-6 mt-auto">
                <span class="font-bold text-jacquier-dark flex items-center text-sm">
                  <svg class="w-4 h-4 mr-2 text-jacquier-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {{ program.duration }}
                </span>
                <button class="text-jacquier-primary font-bold text-sm hover:text-jacquier-gold transition-colors flex items-center group-hover:underline">
                  Détails 
                  <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-24 bg-jacquier-primary text-white text-center px-4 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <img ngSrc="https://picsum.photos/seed/kitchen_pattern/1920/1080" fill class="object-cover" alt="Kitchen pattern" referrerPolicy="no-referrer">
      </div>
      <div class="max-w-3xl mx-auto relative z-10">
        <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm mb-4 block">Admissions</span>
        <h2 class="text-4xl md:text-5xl font-serif font-bold mb-6">Rejoignez la prochaine promotion</h2>
        <p class="mb-10 text-lg font-light text-jacquier-light leading-relaxed">
          Les inscriptions sont ouvertes pour la rentrée prochaine. Les places sont strictement limitées pour garantir un suivi personnalisé et l'excellence de notre enseignement.
        </p>
        <a routerLink="/contact" class="inline-flex items-center justify-center px-8 py-4 bg-jacquier-gold text-jacquier-dark rounded-xl font-bold uppercase tracking-wide hover:bg-white transition-colors shadow-lg min-h-[44px]">
          Candidater maintenant
        </a>
      </div>
    </section>
  `
})
export class SchoolComponent {
  restaurantService = inject(RestaurantService);
  programs = this.restaurantService.getSchoolPrograms();
}
