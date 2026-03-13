import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="min-h-screen bg-[#fcfbf9] text-gray-900 font-sans pt-24 pb-16">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-5xl md:text-6xl serif mb-12 text-center">Notre Histoire</h1>
        <div class="prose prose-lg mx-auto text-gray-700">
          <p class="mb-6">
            Fondé en 2020, Le Jacquier est le fruit d'une rencontre entre deux cultures gastronomiques riches et complémentaires : la France et la Guinée.
          </p>
          <p class="mb-6">
            Notre chef exécutif, formé dans les plus grandes tables parisiennes, a posé ses valises à Conakry avec une ambition claire : créer une cuisine fusion élégante, respectueuse des produits locaux et des techniques classiques.
          </p>
          <p class="mb-6">
            Le nom "Le Jacquier" rend hommage à cet arbre majestueux, symbole d'abondance et de générosité, dont le fruit exotique inspire nombre de nos créations sucrées.
          </p>
          <h2 class="text-3xl serif mt-12 mb-6">Notre Philosophie</h2>
          <p class="mb-6">
            Nous croyons en une cuisine sincère, de saison, qui met en valeur le travail des producteurs locaux. Chaque ingrédient est sélectionné avec soin pour vous offrir une expérience gustative inoubliable.
          </p>
          <div class="my-12 relative h-96 rounded-xl overflow-hidden shadow-lg">
            <img src="https://picsum.photos/seed/restaurant-interior/1200/800" alt="Intérieur du restaurant" class="w-full h-full object-cover" referrerpolicy="no-referrer">
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {}
