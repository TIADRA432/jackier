
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TeamGridComponent } from '../../shared/components/team-grid/team-grid.component';
import { RestaurantService } from '../../core/services/restaurant.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NgOptimizedImage, TeamGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero -->
    <div class="relative h-[50vh] flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
      <img ngSrc="https://picsum.photos/seed/about_hero/1920/1080" fill priority class="object-cover opacity-40" alt="Notre Histoire" referrerPolicy="no-referrer">
      <div class="relative z-10 max-w-4xl mx-auto text-white animate-fade-in-up">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Notre histoire & nos valeurs</span>
        <h1 class="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">À Propos</h1>
      </div>
    </div>

    <!-- Content -->
    <section class="py-24 bg-white px-4">
      <div class="max-w-4xl mx-auto">
        <div class="prose prose-lg md:prose-xl mx-auto text-jacquier-text font-light leading-relaxed">
          <p class="text-2xl md:text-3xl text-jacquier-primary font-serif italic mb-16 text-center leading-relaxed">
            "Le Jacquier est né d'une passion commune : celle de réunir les gens autour d'une table généreuse, 
            où l'Afrique de l'Ouest rencontre l'Occident dans une harmonie parfaite."
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 not-prose">
            <div>
              <h3 class="text-3xl font-serif font-bold text-jacquier-primary mb-6">L'Esprit du Lieu</h3>
              <p class="text-jacquier-text font-light leading-relaxed mb-6">
                Niché dans le quartier dynamique de Kipé, notre établissement offre une parenthèse de calme et de volupté. 
                Le décor, mêlant bois naturels, touches dorées et artisanat local, crée une atmosphère à la fois chic et chaleureuse. 
              </p>
              <p class="text-jacquier-text font-light leading-relaxed">
                Que ce soit pour un déjeuner d'affaires, un dîner romantique ou une célébration en famille, Le Jacquier est l'écrin idéal pour vos moments précieux.
              </p>
            </div>
            <div class="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img ngSrc="https://picsum.photos/seed/interior1/800/600" fill class="object-cover" alt="Salle de restaurant" referrerPolicy="no-referrer">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 not-prose">
            <div class="order-2 md:order-1 relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img ngSrc="https://picsum.photos/seed/details/800/600" fill class="object-cover" alt="Détails déco" referrerPolicy="no-referrer">
            </div>
            <div class="order-1 md:order-2">
              <h3 class="text-3xl font-serif font-bold text-jacquier-primary mb-6">Notre Cuisine</h3>
              <p class="text-jacquier-text font-light leading-relaxed mb-6">
                Notre chef s'efforce de sublimer les produits du terroir guinéen avec des techniques culinaires d'avant-garde. 
              </p>
              <p class="text-jacquier-text font-light leading-relaxed">
                Le poisson capitaine arrive chaque matin du port de Boulbinet, les mangues et ananas proviennent des vergers luxuriants de Kindia, et nos épices sont sélectionnées avec un soin méticuleux au marché de Madina.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- History Timeline -->
    <section class="py-24 bg-jacquier-cream px-4">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-20">
          <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm block mb-2">Héritage</span>
          <h2 class="text-4xl md:text-5xl font-serif font-bold text-jacquier-primary">Notre Parcours</h2>
        </div>
        
        <div class="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-jacquier-gold/30 before:to-transparent">
          
          <!-- 2018 -->
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div class="flex items-center justify-center w-12 h-12 rounded-full border-4 border-jacquier-cream bg-jacquier-gold text-white font-bold shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
            </div>
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
              <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm mb-2 block">2018</span>
              <h3 class="font-serif font-bold text-2xl text-jacquier-primary mb-3">La Genèse</h3>
              <p class="text-jacquier-text font-light leading-relaxed">Ouverture du premier espace à Kipé avec une équipe passionnée de 5 personnes, posant les fondations de notre vision gastronomique.</p>
            </div>
          </div>
          
          <!-- 2020 -->
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div class="flex items-center justify-center w-12 h-12 rounded-full border-4 border-jacquier-cream bg-jacquier-gold text-white font-bold shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
              <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm mb-2 block">2020</span>
              <h3 class="font-serif font-bold text-2xl text-jacquier-primary mb-3">L'Expansion</h3>
              <p class="text-jacquier-text font-light leading-relaxed">Agrandissement de la terrasse panoramique et lancement de notre service traiteur événementiel haut de gamme.</p>
            </div>
          </div>

          <!-- 2022 -->
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div class="flex items-center justify-center w-12 h-12 rounded-full border-4 border-jacquier-cream bg-jacquier-gold text-white font-bold shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
            </div>
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
              <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm mb-2 block">2022</span>
              <h3 class="font-serif font-bold text-2xl text-jacquier-primary mb-3">La Consécration</h3>
              <p class="text-jacquier-text font-light leading-relaxed">Élu "Meilleure Table Fusion de Conakry" par le guide gastronomique local, récompensant notre quête d'excellence.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-24 bg-white px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm block mb-2">Nos Talents</span>
          <h2 class="text-4xl md:text-5xl font-serif font-bold text-jacquier-primary mb-6">L'Équipe du Jacquier</h2>
          <p class="text-jacquier-text font-light text-lg max-w-2xl mx-auto">Des passionnés dévoués à faire de votre visite une expérience inoubliable.</p>
        </div>
        <app-team-grid [members]="team()" />
      </div>
    </section>
  `
})
export class AboutComponent {
  restaurantService = inject(RestaurantService);
  team = this.restaurantService.getTeam();
}
