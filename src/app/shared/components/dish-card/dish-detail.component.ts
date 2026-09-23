import { ChangeDetectionStrategy, Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import type { Dish } from '../../../core/models';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

@Component({
  selector: 'app-dish-detail', standalone: true,
  imports: [DecimalPipe, RouterLink], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dialog [attr.aria-label]="dish().name" (click)="closeOnBackdrop($event)" class="dish-dialog">
      <div class="p-6 md:p-8">
        <form method="dialog" class="mb-4 text-right"><button autofocus class="rounded-lg border px-4 py-3" aria-label="Fermer la fiche du plat">Fermer ×</button></form>
        @if (dish().image) { <img [src]="dish().image" [alt]="dish().name" class="mb-6 h-56 w-full rounded-2xl object-cover" /> }
        <h2 class="text-3xl font-serif text-jacquier-primary">{{ dish().name }}</h2>
        <p class="my-4 text-lg font-bold">{{ dish().price | number:'1.0-0' }} {{ siteSettings.publicInfo().currency }}</p>
        <p class="whitespace-pre-line leading-relaxed">{{ dish().description }}</p>
        <ul class="my-5 flex flex-wrap gap-3 text-sm">
          @if (dish().isFeatured) { <li>Suggestion de la Cheffe</li> }
          @if (dish().isVegetarian) { <li>Végétarien</li> }
          @if (dish().isSpicy) { <li>Épicé</li> }
          @if (dish().isLocalSpecialty) { <li>Spécialité locale</li> }
        </ul>
        <p class="mb-6 rounded-xl bg-jacquier-cream p-4 text-sm">Pour les ingrédients, allergènes et accompagnements, renseignez-vous auprès de notre équipe.</p>
        <a routerLink="/reservation" (click)="close()" class="inline-block rounded-xl bg-jacquier-primary px-6 py-3 font-bold text-white">Réserver une table</a>
      </div>
    </dialog>
  `,
  styles: [`
    .dish-dialog { border: 0; padding: 0; width: min(640px, calc(100% - 2rem)); max-height: 85dvh; margin: auto; border-radius: 1.5rem; color: #1f1f1f; }
    .dish-dialog::backdrop { background: rgb(0 0 0 / .6); }
    @media (max-width: 640px) { .dish-dialog { width: 100%; max-width: 100%; margin: auto 0 0; border-radius: 1.5rem 1.5rem 0 0; } }
  `]
})
export class DishDetailComponent {
  readonly dish = input.required<Dish>();
  readonly siteSettings = inject(SiteSettingsService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  open() { this.dialog().nativeElement.showModal(); }
  close() { this.dialog().nativeElement.close(); }
  closeOnBackdrop(event: MouseEvent) {
    if (event.target === this.dialog().nativeElement) {
      const rect = this.dialog().nativeElement.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) this.close();
    }
  }
}
