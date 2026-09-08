import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, GalleryMedia } from '../../../core/services/admin-data.service';

@Component({
  selector: 'app-admin-cms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">Médias du site</h1>
          <p class="mt-1 text-sm text-gray-400">Gérez les images utilisées dans la galerie publique</p>
        </div>
        <button type="button" (click)="showForm.set(!showForm())" class="rounded-xl bg-jacquier-gold px-4 py-2 text-sm font-bold text-jacquier-dark transition-colors hover:bg-white">
          {{ showForm() ? 'Fermer' : 'Ajouter une image' }}
        </button>
      </div>

      @if (errorMessage()) {
        <p class="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">{{ errorMessage() }}</p>
      }

      @if (showForm()) {
        <form (ngSubmit)="create()" class="grid gap-4 rounded-2xl border border-jacquier-gold/30 bg-[#1a1a1a] p-6 md:grid-cols-2">
          <label class="text-sm text-gray-300 md:col-span-2">URL de l’image
            <input type="url" [(ngModel)]="imageUrl" name="imageUrl" maxlength="2000" required placeholder="https://…" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1" />
          </label>
          <label class="text-sm text-gray-300">Titre
            <input [(ngModel)]="title" name="title" maxlength="200" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1" />
          </label>
          <label class="text-sm text-gray-300">Catégorie
            <input [(ngModel)]="category" name="category" maxlength="100" required class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1" />
          </label>
          <div class="md:col-span-2 flex justify-end"><button type="submit" [disabled]="saving()" class="rounded-xl border border-jacquier-gold/50 px-4 py-2 text-sm font-bold text-jacquier-gold hover:bg-jacquier-gold/10 disabled:opacity-60">{{ saving() ? 'Ajout…' : 'Enregistrer l’image' }}</button></div>
        </form>
      }

      @if (loading()) {
        <p class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-10 text-center text-sm text-gray-400" role="status">Chargement de la galerie…</p>
      } @else if (!media().length) {
        <p class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-10 text-center text-sm text-gray-400">Aucune image n’est encore enregistrée.</p>
      } @else {
        <section class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          @for (item of media(); track item.id) {
            <article class="overflow-hidden rounded-2xl border border-gray-800 bg-[#1a1a1a]">
              <img [src]="item.imageUrl" [alt]="item.title || 'Image de la galerie'" class="h-48 w-full object-cover" />
              <div class="space-y-2 p-4">
                <p class="truncate text-sm font-bold text-white">{{ item.title || 'Sans titre' }}</p>
                <p class="text-xs text-gray-500">{{ item.category }} · {{ formatDate(item.uploadedAt) }}</p>
                @if (pendingDeleteId() === item.id) {
                  <div class="flex gap-2 pt-2"><button type="button" (click)="delete(item)" [disabled]="saving()" class="rounded-lg bg-red-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-60">Confirmer</button><button type="button" (click)="pendingDeleteId.set(null)" class="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300">Annuler</button></div>
                } @else {
                  <button type="button" (click)="pendingDeleteId.set(item.id)" [attr.aria-label]="'Supprimer ' + (item.title || 'cette image')" class="pt-2 text-xs font-bold text-red-300 hover:text-red-200">Supprimer</button>
                }
              </div>
            </article>
          }
        </section>
      }

      <p class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5 text-sm text-gray-400">Les articles, promotions et statistiques éditoriales ne sont pas affichés car aucune API ne les modélise encore. Cet écran ne présente que les médias réellement enregistrables.</p>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class CMSComponent {
  private readonly adminData = inject(AdminDataService);

  readonly media = signal<GalleryMedia[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly showForm = signal(false);
  readonly pendingDeleteId = signal<string | null>(null);
  readonly errorMessage = signal('');
  imageUrl = '';
  title = '';
  category = 'gallery';

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      this.media.set(await this.adminData.getGalleryMedia());
    } catch {
      this.errorMessage.set('Impossible de charger la galerie. Réessayez dans un instant.');
    } finally {
      this.loading.set(false);
    }
  }

  async create(): Promise<void> {
    if (!this.imageUrl.trim() || !this.category.trim()) return;
    this.saving.set(true);
    this.errorMessage.set('');
    try {
      const media = await this.adminData.createGalleryMedia({ imageUrl: this.imageUrl.trim(), title: this.title.trim(), category: this.category.trim() });
      this.media.update(items => [media, ...items]);
      this.imageUrl = '';
      this.title = '';
      this.category = 'gallery';
      this.showForm.set(false);
    } catch {
      this.errorMessage.set('Impossible d’enregistrer l’image. Utilisez une URL HTTP(S) valide.');
    } finally {
      this.saving.set(false);
    }
  }

  async delete(item: GalleryMedia): Promise<void> {
    this.saving.set(true);
    this.errorMessage.set('');
    try {
      await this.adminData.deleteGalleryMedia(item.id);
      this.media.update(items => items.filter(candidate => candidate.id !== item.id));
      this.pendingDeleteId.set(null);
    } catch {
      this.errorMessage.set('Impossible de supprimer cette image. Réessayez dans un instant.');
    } finally {
      this.saving.set(false);
    }
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value));
  }
}
