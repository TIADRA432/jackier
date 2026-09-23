import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-catering-services',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="prestations" class="py-24 lg:py-32 bg-jacquier-cream px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20 lg:mb-24">
          <span class="text-jacquier-gold font-bold tracking-[0.2em] uppercase text-sm block mb-4">Types de demandes</span>
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-jacquier-primary">Votre événement, votre besoin</h2>
          <p class="mx-auto mt-5 max-w-2xl text-jacquier-text/70">Ces catégories correspondent aux demandes que vous pouvez soumettre dans le formulaire de devis. Le contenu précis de la prestation est défini après étude de votre demande.</p>
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
    { title: 'Mariage', description: 'Présentez la date, le nombre d’invités, votre budget indicatif et les attentes particulières de votre réception.', icon: '💍' },
    { title: 'Anniversaire & Baptême', description: 'Décrivez le format souhaité, le nombre de convives et les besoins spécifiques de votre célébration.', icon: '🎂' },
    { title: 'Événement d’Entreprise', description: 'Indiquez le contexte professionnel, les effectifs, la date et les contraintes importantes de l’événement.', icon: '🏢' },
    { title: 'Dîner Privé', description: 'Précisez le nombre d’invités, la date et l’expérience recherchée afin que l’équipe puisse étudier la demande.', icon: '🥂' }
  ];
}
