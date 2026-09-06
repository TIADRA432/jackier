import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CateringHeroComponent } from '../../shared/components/catering-hero/catering-hero.component';
import { CateringServicesComponent } from '../../shared/components/catering-services/catering-services.component';
import { CateringProcessComponent } from '../../shared/components/catering-process/catering-process.component';
import { CateringGalleryComponent } from '../../shared/components/catering-gallery/catering-gallery.component';
import { CateringTestimonialsComponent } from '../../shared/components/catering-testimonials/catering-testimonials.component';
import { CateringCtaComponent } from '../../shared/components/catering-cta/catering-cta.component';
import { CateringFormComponent } from '../../shared/components/catering-form/catering-form.component';

@Component({
  selector: 'app-traiteur',
  standalone: true,
  imports: [
    CateringHeroComponent,
    CateringServicesComponent,
    CateringProcessComponent,
    CateringGalleryComponent,
    CateringTestimonialsComponent,
    CateringCtaComponent,
    CateringFormComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-jacquier-cream min-h-screen">
      <app-catering-hero />
      <app-catering-services />
      <app-catering-process />
      <app-catering-gallery />
      <app-catering-testimonials />
      <app-catering-form />
      <app-catering-cta />
    </div>
  `
})
export class TraiteurComponent implements OnInit {
  constructor(private meta: Meta, private title: Title) {}

  ngOnInit() {
    this.title.setTitle('Service Traiteur à Conakry – Organisation Mariages & Événements');
    this.meta.updateTag({ name: 'description', content: 'Service traiteur professionnel pour mariages, anniversaires, événements d\'entreprise et dîners VIP. Menus personnalisés, décoration et logistique complète.' });
  }
}
