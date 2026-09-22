import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminDataService, GalleryMedia, MediaAsset } from '../../../core/services/admin-data.service';

const GALLERY_CATEGORIES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cuisine', label: 'Cuisine' },
  { value: 'evenements', label: 'Événements' },
  { value: 'equipe', label: 'Équipe' },
  { value: 'ambiance', label: 'Ambiance' },
  { value: 'ecole', label: 'École gastronomique' },
] as const;

type GalleryDraft = {
  title: string;
  category: string;
  displayOrder: number;
};

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <header class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-jacquier-gold">Contenu visuel</p>
          <h1 class="mt-1 text-3xl font-serif font-bold text-white">Galerie publique</h1>
          <p class="mt-2 max-w-3xl text-sm text-gray-400">
            Organisez exactement ce que les visiteurs voient : publication, titre public, catégorie et ordre d’affichage.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" (click)="previewOpen.set(!previewOpen())"
            class="rounded-xl border border-gray-700 px-4 py-3 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold">
            {{ previewOpen() ? 'Masquer l’aperçu' : 'Aperçu public' }}
          </button>
          <a routerLink="/gallery" target="_blank" rel="noopener"
            class="rounded-xl border border-jacquier-gold px-4 py-3 text-sm font-bold text-jacquier-gold hover:bg-jacquier-gold hover:text-jacquier-dark">
            Voir sur le site ↗
          </a>
          <button type="button" (click)="openPicker()"
            class="rounded-xl bg-jacquier-gold px-4 py-3 text-sm font-bold text-jacquier-dark hover:bg-white">
            + Ajouter depuis la Médiathèque
          </button>
        </div>
      </header>

      @if (errorMessage()) {
        <p class="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">{{ errorMessage() }}</p>
      }
      @if (successMessage()) {
        <p class="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200" role="status">{{ successMessage() }}</p>
      }

      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Résumé Galerie">
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Publiées</p>
          <p class="mt-2 text-3xl font-bold text-white">{{ gallery().length }}</p>
          <p class="mt-1 text-xs text-gray-500">photos visibles sur le site</p>
        </article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Catégories actives</p>
          <p class="mt-2 text-3xl font-bold text-white">{{ activeCategoryCount() }}</p>
          <p class="mt-1 text-xs text-gray-500">catégories actuellement utilisées</p>
        </article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Médiathèque</p>
          <p class="mt-2 text-3xl font-bold text-white">{{ media().length }}</p>
          <p class="mt-1 text-xs text-gray-500">images disponibles au total</p>
        </article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Non publiées</p>
          <p class="mt-2 text-3xl font-bold text-white">{{ availableMedia().length }}</p>
          <p class="mt-1 text-xs text-gray-500">images encore disponibles</p>
        </article>
      </section>

      @if (previewOpen()) {
        <section class="rounded-2xl border border-jacquier-gold/30 bg-[#171717] p-5">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 class="font-serif text-xl font-bold text-white">Aperçu du rendu public</h2>
              <p class="text-xs text-gray-500">L’ordre présenté ici suit exactement l’ordre enregistré.</p>
            </div>
            <span class="rounded-full bg-jacquier-gold/10 px-3 py-1 text-xs font-bold text-jacquier-gold">Prévisualisation</span>
          </div>
          @if (sortedGallery().length) {
            <div class="grid auto-rows-[160px] grid-cols-2 gap-3 md:grid-cols-4 lg:auto-rows-[190px]">
              @for (item of sortedGallery(); track item.id; let i = $index) {
                <article [class]="previewClass(i)">
                  <img [src]="item.imageUrl" [alt]="item.title || 'Photo de la galerie'" class="h-full w-full object-cover" />
                  <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3">
                    <p class="text-[10px] font-bold uppercase tracking-wider text-jacquier-gold">{{ categoryLabel(item.category) }}</p>
                    @if (item.title) { <p class="truncate text-sm font-bold text-white">{{ item.title }}</p> }
                  </div>
                </article>
              }
            </div>
          } @else {
            <p class="rounded-xl border border-dashed border-gray-700 p-8 text-center text-sm text-gray-500">Aucune image publiée.</p>
          }
        </section>
      }

      <section class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
        <div class="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <label class="text-sm text-gray-300">Recherche
            <input type="search" [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="Titre ou catégorie…"
              class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none focus:ring-1 focus:ring-jacquier-gold" />
          </label>
          <label class="text-sm text-gray-300">Catégorie
            <select [ngModel]="categoryFilter()" (ngModelChange)="categoryFilter.set($event)"
              class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white">
              <option value="all">Toutes les catégories</option>
              @for (category of categories; track category.value) {
                <option [value]="category.value">{{ category.label }}</option>
              }
            </select>
          </label>
        </div>
      </section>

      @if (loading()) {
        <p class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-sm text-gray-400" role="status">Chargement de la galerie…</p>
      } @else if (!filteredGallery().length) {
        <div class="rounded-2xl border border-dashed border-gray-700 bg-[#1a1a1a] p-12 text-center">
          <p class="text-lg font-bold text-white">Aucune publication ici</p>
          <p class="mt-2 text-sm text-gray-500">Changez le filtre ou ajoutez des images depuis la Médiathèque.</p>
        </div>
      } @else {
        <section class="grid gap-5 md:grid-cols-2 2xl:grid-cols-3" aria-label="Images publiées">
          @for (item of filteredGallery(); track item.id) {
            <article draggable="true"
              (dragstart)="dragStart(item.id)"
              (dragover)="$event.preventDefault()"
              (drop)="dropOn(item.id)"
              [class.ring-2]="draggingId() === item.id"
              [class.ring-jacquier-gold]="draggingId() === item.id"
              class="group overflow-hidden rounded-2xl border border-gray-800 bg-[#1a1a1a] transition">
              <div class="relative">
                <img [src]="item.imageUrl" [alt]="item.title || 'Photo de la galerie'" class="h-64 w-full object-cover" />
                <div class="absolute left-3 top-3 flex gap-2">
                  <span class="rounded-full bg-black/75 px-3 py-1 text-[11px] font-bold text-white">#{{ item.displayOrder }}</span>
                  <span class="rounded-full bg-emerald-600/90 px-3 py-1 text-[11px] font-bold text-white">Publié</span>
                </div>
                <span class="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2 py-1 text-xs text-gray-300 opacity-0 transition group-hover:opacity-100">Glisser pour réordonner</span>
              </div>

              <div class="space-y-4 p-4">
                @if (editingId() === item.id) {
                  <div class="space-y-3 rounded-xl border border-jacquier-gold/30 bg-black/20 p-3">
                    <label class="block text-xs text-gray-300">Titre public
                      <input [(ngModel)]="editDraft.title" maxlength="200" class="mt-1 w-full rounded-lg bg-gray-900 px-3 py-2 text-white" />
                    </label>
                    <label class="block text-xs text-gray-300">Catégorie
                      <select [(ngModel)]="editDraft.category" class="mt-1 w-full rounded-lg bg-gray-900 px-3 py-2 text-white">
                        @for (category of categories; track category.value) {
                          <option [value]="category.value">{{ category.label }}</option>
                        }
                      </select>
                    </label>
                    <label class="block text-xs text-gray-300">Ordre
                      <input [(ngModel)]="editDraft.displayOrder" type="number" min="0" max="10000" step="1"
                        class="mt-1 w-full rounded-lg bg-gray-900 px-3 py-2 text-white" />
                    </label>
                    <div class="flex justify-end gap-2">
                      <button type="button" (click)="cancelEdit()" class="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300">Annuler</button>
                      <button type="button" (click)="saveEdit(item)" [disabled]="savingId() === item.id || editDraft.displayOrder < 0"
                        class="rounded-lg bg-jacquier-gold px-3 py-2 text-xs font-bold text-jacquier-dark disabled:opacity-50">
                        {{ savingId() === item.id ? 'Enregistrement…' : 'Enregistrer' }}
                      </button>
                    </div>
                  </div>
                } @else {
                  <div>
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="truncate font-bold text-white">{{ item.title || 'Sans titre' }}</p>
                        <p class="mt-1 text-xs font-bold text-jacquier-gold">{{ categoryLabel(item.category) }}</p>
                      </div>
                      <span class="shrink-0 text-xs text-gray-500">ordre {{ item.displayOrder }}</span>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-2 border-t border-gray-800 pt-3">
                    <button type="button" (click)="move(item, -1)" [disabled]="isFirst(item) || reordering()"
                      class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-gray-300 disabled:opacity-30">↑ Monter</button>
                    <button type="button" (click)="move(item, 1)" [disabled]="isLast(item) || reordering()"
                      class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-gray-300 disabled:opacity-30">↓ Descendre</button>
                    <button type="button" (click)="startEdit(item)" class="rounded-lg border border-jacquier-gold/50 px-3 py-2 text-xs font-bold text-jacquier-gold">Modifier</button>
                    <button type="button" (click)="confirmUnpublishId.set(item.id)" class="rounded-lg px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-950/40">Dépublier</button>
                  </div>
                }

                @if (confirmUnpublishId() === item.id) {
                  <div class="rounded-xl border border-red-900/60 bg-red-950/20 p-3">
                    <p class="text-xs text-red-200">Retirer cette image de la galerie publique ? Le fichier restera dans la Médiathèque.</p>
                    <div class="mt-3 flex justify-end gap-2">
                      <button type="button" (click)="confirmUnpublishId.set(null)" class="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300">Annuler</button>
                      <button type="button" (click)="unpublish(item)" [disabled]="savingId() === item.id"
                        class="rounded-lg bg-red-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Confirmer</button>
                    </div>
                  </div>
                }
              </div>
            </article>
          }
        </section>
      }

      @if (pickerOpen()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label="Ajouter des images depuis la Médiathèque" (click)="closePicker()">
          <div class="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-gray-700 bg-[#151515] shadow-2xl" (click)="$event.stopPropagation()">
            <header class="flex flex-col gap-3 border-b border-gray-800 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 class="font-serif text-xl font-bold text-white">Ajouter depuis la Médiathèque</h2>
                <p class="text-xs text-gray-500">{{ selectedMediaIds().length }} image(s) sélectionnée(s)</p>
              </div>
              <button type="button" (click)="closePicker()" class="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300">Fermer</button>
            </header>

            <div class="grid gap-3 border-b border-gray-800 p-5 md:grid-cols-[2fr_1fr]">
              <input type="search" [ngModel]="pickerQuery()" (ngModelChange)="pickerQuery.set($event)" placeholder="Rechercher dans la Médiathèque…"
                class="rounded-xl bg-gray-900 px-3 py-3 text-white" />
              <select [(ngModel)]="pickerCategory" class="rounded-xl bg-gray-900 px-3 py-3 text-white">
                @for (category of categories; track category.value) {
                  <option [value]="category.value">Publier dans : {{ category.label }}</option>
                }
              </select>
            </div>

            <div class="custom-scrollbar flex-1 overflow-y-auto p-5">
              @if (!filteredAvailableMedia().length) {
                <p class="rounded-xl border border-dashed border-gray-700 p-10 text-center text-sm text-gray-500">Aucune image disponible à publier.</p>
              } @else {
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  @for (item of filteredAvailableMedia(); track item.id) {
                    <button type="button" (click)="toggleMediaSelection(item.id)"
                      [class.border-jacquier-gold]="selectedMediaIds().includes(item.id)"
                      [class.ring-2]="selectedMediaIds().includes(item.id)"
                      [class.ring-jacquier-gold]="selectedMediaIds().includes(item.id)"
                      class="overflow-hidden rounded-xl border border-gray-800 bg-[#1a1a1a] text-left">
                      <img [src]="item.publicUrl" [alt]="item.altText" class="h-40 w-full object-cover" />
                      <div class="p-3">
                        <p class="truncate text-sm font-bold text-white">{{ item.title || item.originalName }}</p>
                        <p class="mt-1 text-xs text-gray-500">{{ item.originalName }}</p>
                      </div>
                    </button>
                  }
                </div>
              }
            </div>

            <footer class="flex flex-col gap-3 border-t border-gray-800 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-xs text-gray-500">Les images restent dans la Médiathèque et sont simplement publiées dans la Galerie.</p>
              <button type="button" (click)="publishSelected()" [disabled]="!selectedMediaIds().length || publishing()"
                class="rounded-xl bg-jacquier-gold px-5 py-3 text-sm font-bold text-jacquier-dark disabled:opacity-50">
                {{ publishing() ? 'Publication…' : 'Publier ' + selectedMediaIds().length + ' image(s)' }}
              </button>
            </footer>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn .35s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminGalleryComponent {
  private readonly adminData = inject(AdminDataService);

  readonly gallery = signal<GalleryMedia[]>([]);
  readonly media = signal<MediaAsset[]>([]);
  readonly loading = signal(true);
  readonly savingId = signal<string | null>(null);
  readonly reordering = signal(false);
  readonly publishing = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly confirmUnpublishId = signal<string | null>(null);
  readonly draggingId = signal<string | null>(null);
  readonly previewOpen = signal(false);
  readonly pickerOpen = signal(false);
  readonly selectedMediaIds = signal<string[]>([]);
  readonly query = signal('');
  readonly pickerQuery = signal('');
  readonly categoryFilter = signal('all');
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly categories = GALLERY_CATEGORIES;
  pickerCategory = 'restaurant';
  editDraft: GalleryDraft = { title: '', category: 'restaurant', displayOrder: 0 };

  readonly sortedGallery = computed(() =>
    [...this.gallery()].sort((a, b) => a.displayOrder - b.displayOrder || b.uploadedAt.localeCompare(a.uploadedAt))
  );

  readonly filteredGallery = computed(() => {
    const query = this.normalize(this.query());
    const category = this.categoryFilter();
    return this.sortedGallery().filter(item => {
      const normalizedCategory = this.normalizedCategory(item.category);
      const searchable = this.normalize(`${item.title} ${this.categoryLabel(normalizedCategory)}`);
      return (!query || searchable.includes(query)) && (category === 'all' || normalizedCategory === category);
    });
  });

  readonly availableMedia = computed(() => {
    const publishedUrls = new Set(this.gallery().map(item => item.imageUrl));
    return this.media().filter(item => !publishedUrls.has(item.publicUrl));
  });

  readonly filteredAvailableMedia = computed(() => {
    const query = this.normalize(this.pickerQuery());
    return this.availableMedia().filter(item =>
      !query || this.normalize(`${item.title} ${item.originalName} ${item.altText}`).includes(query)
    );
  });

  readonly activeCategoryCount = computed(() =>
    new Set(this.gallery().map(item => this.normalizedCategory(item.category))).size
  );

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      const [gallery, media] = await Promise.all([
        this.adminData.getGalleryMedia(),
        this.adminData.getMediaAssets(),
      ]);
      this.gallery.set(gallery);
      this.media.set(media);
    } catch {
      this.errorMessage.set('Impossible de charger la Galerie publique.');
    } finally {
      this.loading.set(false);
    }
  }

  categoryLabel(value: string): string {
    if (value === 'gallery') return 'Restaurant';
    return GALLERY_CATEGORIES.find(category => category.value === value)?.label ?? 'Restaurant';
  }

  normalizedCategory(value: string): string {
    return GALLERY_CATEGORIES.some(category => category.value === value) ? value : 'restaurant';
  }

  startEdit(item: GalleryMedia): void {
    this.editingId.set(item.id);
    this.editDraft = {
      title: item.title,
      category: this.normalizedCategory(item.category),
      displayOrder: Number(item.displayOrder ?? 0),
    };
    this.clearMessages();
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  async saveEdit(item: GalleryMedia): Promise<void> {
    if (this.savingId()) return;
    this.savingId.set(item.id);
    this.clearMessages();
    try {
      const updated = await this.adminData.updateGalleryMedia(item.id, {
        title: this.editDraft.title.trim(),
        category: this.editDraft.category,
        displayOrder: Number(this.editDraft.displayOrder),
      });
      this.gallery.update(items => items.map(candidate => candidate.id === item.id ? updated : candidate));
      this.editingId.set(null);
      this.successMessage.set('Publication mise à jour.');
    } catch {
      this.errorMessage.set('Impossible de modifier cette publication.');
    } finally {
      this.savingId.set(null);
    }
  }

  async unpublish(item: GalleryMedia): Promise<void> {
    if (this.savingId()) return;
    this.savingId.set(item.id);
    this.clearMessages();
    try {
      await this.adminData.deleteGalleryMedia(item.id);
      this.gallery.update(items => items.filter(candidate => candidate.id !== item.id));
      this.confirmUnpublishId.set(null);
      this.successMessage.set('Image retirée de la galerie publique. Le fichier reste disponible dans la Médiathèque.');
    } catch {
      this.errorMessage.set('Impossible de dépublier cette image.');
    } finally {
      this.savingId.set(null);
    }
  }

  isFirst(item: GalleryMedia): boolean {
    return this.sortedGallery()[0]?.id === item.id;
  }

  isLast(item: GalleryMedia): boolean {
    const items = this.sortedGallery();
    return items[items.length - 1]?.id === item.id;
  }

  async move(item: GalleryMedia, direction: -1 | 1): Promise<void> {
    const items = this.sortedGallery();
    const index = items.findIndex(candidate => candidate.id === item.id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    await this.persistOrder(reordered);
  }

  dragStart(id: string): void {
    this.draggingId.set(id);
  }

  async dropOn(targetId: string): Promise<void> {
    const sourceId = this.draggingId();
    this.draggingId.set(null);
    if (!sourceId || sourceId === targetId) return;
    const items = this.sortedGallery();
    const sourceIndex = items.findIndex(item => item.id === sourceId);
    const targetIndex = items.findIndex(item => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const reordered = [...items];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    await this.persistOrder(reordered);
  }

  private async persistOrder(items: GalleryMedia[]): Promise<void> {
    if (this.reordering()) return;
    this.reordering.set(true);
    this.clearMessages();
    try {
      const normalized = items.map((item, index) => ({ ...item, displayOrder: index * 10 }));
      for (const item of normalized) {
        await this.adminData.updateGalleryMedia(item.id, { displayOrder: item.displayOrder });
      }
      this.gallery.set(normalized);
      this.successMessage.set('Ordre de la galerie enregistré.');
    } catch {
      this.errorMessage.set('L’ordre n’a pas pu être enregistré complètement. Rechargez la page avant de recommencer.');
      await this.load();
    } finally {
      this.reordering.set(false);
    }
  }

  openPicker(): void {
    this.selectedMediaIds.set([]);
    this.pickerQuery.set('');
    this.pickerCategory = 'restaurant';
    this.pickerOpen.set(true);
    this.clearMessages();
  }

  closePicker(): void {
    if (this.publishing()) return;
    this.pickerOpen.set(false);
    this.selectedMediaIds.set([]);
  }

  toggleMediaSelection(id: string): void {
    this.selectedMediaIds.update(ids => ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id]);
  }

  async publishSelected(): Promise<void> {
    const selectedIds = this.selectedMediaIds();
    if (!selectedIds.length || this.publishing()) return;
    this.publishing.set(true);
    this.clearMessages();
    const assets = this.media().filter(item => selectedIds.includes(item.id));
    const created: GalleryMedia[] = [];
    let nextOrder = this.nextOrder();

    try {
      for (const asset of assets) {
        const publication = await this.adminData.createGalleryMedia({
          imageUrl: asset.publicUrl,
          title: asset.title,
          category: this.pickerCategory,
          displayOrder: nextOrder,
        });
        created.push(publication);
        nextOrder += 10;
      }
      this.gallery.update(items => [...items, ...created]);
      this.pickerOpen.set(false);
      this.selectedMediaIds.set([]);
      this.successMessage.set(`${created.length} image(s) publiée(s) dans la Galerie.`);
    } catch {
      if (created.length) this.gallery.update(items => [...items, ...created]);
      this.errorMessage.set(`Publication interrompue après ${created.length} image(s). Les images déjà publiées ont été conservées.`);
    } finally {
      this.publishing.set(false);
    }
  }

  previewClass(index: number): string {
    const pattern = [
      'relative col-span-2 row-span-2 overflow-hidden rounded-xl',
      'relative overflow-hidden rounded-xl',
      'relative row-span-2 overflow-hidden rounded-xl',
      'relative overflow-hidden rounded-xl',
      'relative col-span-2 overflow-hidden rounded-xl',
      'relative overflow-hidden rounded-xl',
    ];
    return pattern[index % pattern.length];
  }

  private nextOrder(): number {
    return this.gallery().reduce((max, item) => Math.max(max, Number(item.displayOrder ?? 0)), -10) + 10;
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  private normalize(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').trim();
  }
}
