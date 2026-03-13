import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-catering-cta',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-24 lg:py-32 bg-jacquier-primary px-4 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-jacquier-dark/50 to-transparent"></div>
      <div class="max-w-5xl mx-auto text-center relative z-10">
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-8 leading-tight">
          Prêt à Organiser Votre Événement ?
        </h2>
        <p class="text-xl lg:text-2xl font-light text-jacquier-light mb-12 max-w-3xl mx-auto leading-relaxed">
          Contactez notre responsable traiteur pour une proposition personnalisée sous 24h.
        </p>
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a href="tel:+224625675363" class="w-full sm:w-auto flex items-center justify-center px-10 py-5 bg-jacquier-gold text-jacquier-dark rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-xl min-h-[44px] text-sm group">
            <svg class="w-5 h-5 mr-3 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            +224 625 67 53 63
          </a>
          <button (click)="scrollToForm()" class="w-full sm:w-auto flex items-center justify-center px-10 py-5 border-2 border-white text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-jacquier-dark transition-all duration-300 min-h-[44px] text-sm group">
            <svg class="w-5 h-5 mr-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Demander un Devis
          </button>
        </div>
      </div>
    </section>
  `
})
export class CateringCtaComponent {
  scrollToForm() {
    document.getElementById('devis-form')?.scrollIntoView({ behavior: 'smooth' });
  }
}
