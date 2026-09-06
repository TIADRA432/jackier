import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-catering-services',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="prestations" class="py-24 lg:py-32 bg-jacquier-cream px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20 lg:mb-24">
          <span class="text-jacquier-gold font-bold tracking-[0.2em] uppercase text-sm block mb-4">Nos Prestations</span>
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-jacquier-primary">Services Sur-Mesure</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
          @for (service of services; track service.title) {
            <div class="bg-white p-10 rounded-3xl text-center hover:shadow-2xl transition-all duration-500 border border-gray-100 group flex flex-col h-full transform hover:-translate-y-2">
              <div class="w-24 h-24 mx-auto bg-jacquier-cream rounded-full flex items-center justify-center text-5xl mb-8 group-hover:scale-110 group-hover:bg-jacquier-gold group-hover:text-white transition-all duration-500 shadow-inner">
                {{ service.icon }}
              </div>
              <h3 class="text-2xl font-serif font-bold text-jacquier-dark mb-4 group-hover:text-jacquier-primary transition-colors">{{ service.title }}</h3>
              <p class="text-jacquier-text font-light leading-relaxed flex-grow text-lg">{{ service.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class CateringServicesComponent {
  services = [
    { title: 'Traiteur Mariage', description: 'Un menu d’exception pour le plus beau jour de votre vie, avec service à table ou buffet.', icon: '💍' },
    { title: 'Baptême & Anniversaire', description: 'Des moments conviviaux autour de plats savoureux, adaptés à toutes les générations.', icon: '🎂' },
    { title: 'Événements d’Entreprise', description: 'Cocktails dînatoires, séminaires et repas d’affaires pour impressionner vos collaborateurs.', icon: '🏢' },
    { title: 'Soirées Privées & VIP', description: 'L’expérience gastronomique du Jacquier directement chez vous, avec chef à domicile.', icon: '🥂' },
    { title: 'Menus Personnalisés', description: 'Cuisine locale, internationale ou fusion, adaptée à votre budget et vos exigences.', icon: '🍽️' },
    { title: 'Décoration & Service', description: 'Mise en place élégante et service professionnel par notre équipe expérimentée.', icon: '✨' },
    { title: 'Location de Matériel', description: 'Tables, chaises, tentes, vaisselle premium et décoration florale sur demande.', icon: '🎪' },
    { title: 'Livraison & Installation', description: 'Logistique complète et installation sur le lieu de votre événement à Conakry et environs.', icon: '🚚' }
  ];
}
