import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-catering-process',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-24 lg:py-32 bg-white px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20 lg:mb-24">
          <span class="text-jacquier-gold font-bold tracking-[0.2em] uppercase text-sm block mb-4">Notre Processus</span>
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-jacquier-primary">L'Organisation Parfaite</h2>
        </div>
        
        <div class="relative">
          <!-- Desktop Line -->
          <div class="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-jacquier-cream via-jacquier-gold/50 to-jacquier-cream -translate-y-1/2"></div>
          
          <!-- Mobile Line -->
          <div class="lg:hidden absolute top-0 bottom-0 left-8 w-1 bg-gradient-to-b from-jacquier-cream via-jacquier-gold/50 to-jacquier-cream"></div>
          
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 relative z-10">
            @for (step of steps; track step.title; let i = $index) {
              <div class="flex flex-row lg:flex-col items-start lg:items-center group">
                <div class="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-jacquier-gold text-white flex items-center justify-center text-2xl lg:text-3xl font-bold border-4 border-white shadow-xl lg:mb-8 group-hover:scale-110 transition-transform duration-500 z-10 relative">
                  {{ i + 1 }}
                </div>
                <div class="ml-8 lg:ml-0 lg:text-center mt-2 lg:mt-0">
                  <h3 class="text-xl lg:text-2xl font-serif font-bold text-jacquier-dark mb-3 group-hover:text-jacquier-primary transition-colors">{{ step.title }}</h3>
                  <p class="text-jacquier-text font-light text-base lg:text-lg">{{ step.description }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `
})
export class CateringProcessComponent {
  steps = [
    { title: 'Prise de Contact', description: 'Échange initial pour comprendre vos envies et la nature de l’événement.' },
    { title: 'Étude du Besoin', description: 'Définition du menu, du lieu, du nombre d’invités et des contraintes.' },
    { title: 'Proposition Personnalisée', description: 'Devis détaillé et dégustation avec notre Chef pour valider les choix.' },
    { title: 'Validation & Logistique', description: 'Planification du matériel, de l’équipe et repérage des lieux.' },
    { title: 'Exécution le Jour J', description: 'Service impeccable, discrétion et excellence gastronomique.' }
  ];
}
