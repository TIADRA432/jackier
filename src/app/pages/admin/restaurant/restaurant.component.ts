import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, MediaAsset, MenuCategory, MenuItem, MenuItemPayload } from '../../../core/services/admin-data.service';

@Component({
  selector: 'app-admin-restaurant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">Gestion Restaurant</h1>
          <p class="mt-1 text-sm text-gray-400">Créez, modifiez, classez et publiez les plats de la carte.</p>
        </div>
        <div class="flex gap-3">
          <button type="button" (click)="showForm() ? closeForm() : startCreate()" class="rounded-xl bg-jacquier-gold px-4 py-2 text-sm font-bold text-jacquier-dark hover:bg-white">
            {{ showForm() ? 'Fermer' : 'Nouveau plat' }}
          </button>
          <button type="button" (click)="load()" [disabled]="loading() || !!savingId() || formSaving()" class="rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-50">
            {{ loading() ? 'Actualisation…' : 'Actualiser' }}
          </button>
        </div>
      </header>

      @if (successMessage()) {
        <div role="status" class="rounded-xl border border-emerald-900/60 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-200">
          {{ successMessage() }}
        </div>
      }

      @if (showForm()) {
        <form (ngSubmit)="saveForm()" class="grid gap-4 rounded-2xl border border-jacquier-gold/30 bg-[#1a1a1a] p-6 md:grid-cols-2">
          <h2 class="text-xl font-serif font-bold text-white md:col-span-2">{{ editingId() ? 'Modifier le plat' : 'Créer un plat' }}</h2>

          <label class="text-sm text-gray-300">Nom du plat *
            <input [(ngModel)]="draft.name" name="name" required maxlength="120" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none focus:ring-1 focus:ring-jacquier-gold" />
          </label>

          <label class="text-sm text-gray-300">Catégorie *
            <select [(ngModel)]="draft.categoryId" name="categoryId" required class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none focus:ring-1 focus:ring-jacquier-gold">
              <option value="" disabled>Choisir une catégorie</option>
              @for (category of categories(); track category.id) {
                <option [value]="category.id">{{ category.name }}</option>
              }
            </select>
          </label>

          <label class="text-sm text-gray-300">Prix en GNF *
            <input [(ngModel)]="draft.price" name="price" type="number" required min="0" max="100000000" step="1000" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none focus:ring-1 focus:ring-jacquier-gold" />
          </label>

          <label class="text-sm text-gray-300">Ordre d’affichage
            <input [(ngModel)]="draft.displayOrder" name="displayOrder" type="number" required min="0" max="10000" step="1" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none focus:ring-1 focus:ring-jacquier-gold" />
            <span class="mt-1 block text-xs text-gray-500">Les plus petits numéros apparaissent en premier.</span>
          </label>

          <label class="text-sm text-gray-300">Photo
            <select [(ngModel)]="draft.imageUrl" name="imageUrl" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none focus:ring-1 focus:ring-jacquier-gold">
              <option value="">Sans photo</option>
              @for (asset of menuImages(); track asset.id) {
                <option [value]="asset.publicUrl">{{ asset.title || asset.originalName }}</option>
              }
            </select>
            <span class="mt-1 block text-xs text-gray-500">Ajoutez les nouvelles photos dans CMS & Contenu.</span>
          </label>

          <div class="flex min-h-36 items-center justify-center overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
            @if (draft.imageUrl) {
              <img [src]="draft.imageUrl" [alt]="'Aperçu de ' + (draft.name || 'la photo du plat')" class="h-36 w-full object-cover" />
            } @else {
              <span class="text-sm text-gray-500">Aucune photo sélectionnée</span>
            }
          </div>

          <label class="text-sm text-gray-300 md:col-span-2">Description
            <textarea [(ngModel)]="draft.shortDescription" name="shortDescription" maxlength="1000" rows="3" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none focus:ring-1 focus:ring-jacquier-gold"></textarea>
          </label>

          <div class="flex flex-wrap gap-6 text-sm text-gray-300 md:col-span-2">
            <label class="flex items-center gap-2"><input [(ngModel)]="draft.active" name="active" type="checkbox" /> Disponible sur la carte</label>
            <label class="flex items-center gap-2"><input [(ngModel)]="draft.isFeatured" name="isFeatured" type="checkbox" /> Suggestion de la Cheffe</label>
            <label class="flex items-center gap-2"><input [(ngModel)]="draft.isVegetarian" name="isVegetarian" type="checkbox" /> Végétarien</label>
            <label class="flex items-center gap-2"><input [(ngModel)]="draft.isSpicy" name="isSpicy" type="checkbox" /> Épicé</label>
          </div>

          <div class="flex items-center justify-end gap-3 md:col-span-2">
            @if (editingId()) {
              <button type="button" (click)="closeForm()" [disabled]="formSaving()" class="rounded-xl border border-gray-700 px-4 py-3 font-bold text-gray-300 disabled:opacity-50">Annuler</button>
            }
            <button type="submit" [disabled]="formSaving() || !draft.name.trim() || !draft.categoryId || draft.price < 0 || draft.displayOrder < 0" class="rounded-xl bg-jacquier-gold px-5 py-3 font-bold text-jacquier-dark disabled:opacity-50">
              {{ formSaving() ? 'Enregistrement…' : (editingId() ? 'Enregistrer les modifications' : 'Créer le plat') }}
            </button>
          </div>
        </form>
      }

      <input type="search" [value]="query()" (input)="query.set($any($event.target).value)" placeholder="Rechercher un plat…" aria-label="Rechercher un plat" class="w-full rounded-xl border border-gray-800 bg-[#1a1a1a] px-4 py-3 text-white outline-none focus:border-jacquier-gold" />

      @if (errorMessage()) {
        <div role="alert" class="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          {{ errorMessage() }} <button type="button" (click)="load()" class="ml-2 font-bold underline">Réessayer</button>
        </div>
      }

      @if (loading()) {
        <div role="status" class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-gray-400">Chargement du menu…</div>
      } @else if (!filteredItems().length) {
        <div class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-gray-400">Aucun plat ne correspond à cette recherche.</div>
      } @else {
        <section class="overflow-x-auto rounded-2xl border border-gray-800 bg-[#1a1a1a]">
          <table class="w-full min-w-[1120px] text-left text-sm">
            <thead class="border-b border-gray-800 bg-[#121212] text-xs uppercase text-gray-500">
              <tr>
                <th class="px-6 py-4">Plat</th>
                <th class="px-6 py-4">Catégorie</th>
                <th class="px-6 py-4">Prix</th>
                <th class="px-6 py-4">Ordre</th>
                <th class="px-6 py-4">Repères</th>
                <th class="px-6 py-4">Carte</th>
                <th class="px-6 py-4"><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              @for (dish of filteredItems(); track dish.id) {
                <tr class="border-b border-gray-800/50">
                  <td class="px-6 py-4 font-medium text-white">
                    <div class="flex items-center gap-3">
                      @if (dish.imageUrl || dish.image) {
                        <img [src]="dish.imageUrl || dish.image" [alt]="dish.name || 'Photo du plat'" class="h-10 w-10 rounded-lg object-cover" />
                      }
                      {{ dish.name || 'Plat sans nom' }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-300">{{ categoryName(dish) }}</td>
                  <td class="px-6 py-4 text-white">
                    @if (dish.price !== undefined && dish.price !== null && dish.price !== '') {
                      {{ dish.price | number:'1.0-0' }} GNF
                    } @else {
                      <span class="text-gray-500">Prix non renseigné</span>
                    }
                  </td>
                  <td class="px-6 py-4 text-gray-300">{{ dish.displayOrder ?? 0 }}</td>
                  <td class="px-6 py-4">
                    <div class="flex flex-wrap gap-2">
                      @if (dish.isFeatured) { <span class="rounded-full bg-jacquier-gold/15 px-2.5 py-1 text-xs font-bold text-jacquier-gold">Cheffe</span> }
                      @if (dish.isVegetarian) { <span class="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-300">Végétarien</span> }
                      @if (dish.isSpicy) { <span class="rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-bold text-red-300">Épicé</span> }
                      @if (!dish.isFeatured && !dish.isVegetarian && !dish.isSpicy) { <span class="text-xs text-gray-500">—</span> }
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span [class]="isActive(dish) ? 'rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300' : 'rounded-full bg-gray-700 px-3 py-1 text-xs font-bold text-gray-300'">
                      {{ isActive(dish) ? 'Disponible' : 'Indisponible' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    @if (pendingDeleteId() === dish.id) {
                      <div class="flex flex-wrap items-center justify-end gap-2">
                        <span class="text-xs text-red-200">Supprimer définitivement ?</span>
                        <button type="button" (click)="deleteDish(dish)" [disabled]="!!savingId()" class="rounded-lg bg-red-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Confirmer</button>
                        <button type="button" (click)="pendingDeleteId.set(null)" class="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300">Annuler</button>
                      </div>
                    } @else {
                      <div class="flex flex-wrap justify-end gap-2">
                        <button type="button" (click)="editDish(dish)" [disabled]="!!savingId() || formSaving()" class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-white hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-50">Modifier</button>
                        <button type="button" (click)="toggleFeatured(dish)" [disabled]="!!savingId()" [attr.aria-pressed]="dish.isFeatured === true" class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-jacquier-gold disabled:opacity-50">{{ dish.isFeatured ? 'Retirer Cheffe' : 'Ajouter Cheffe' }}</button>
                        <button type="button" (click)="toggleVegetarian(dish)" [disabled]="!!savingId()" [attr.aria-pressed]="dish.isVegetarian === true" class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-emerald-300 disabled:opacity-50">{{ dish.isVegetarian ? 'Non végétarien' : 'Végétarien' }}</button>
                        <button type="button" (click)="toggleSpicy(dish)" [disabled]="!!savingId()" [attr.aria-pressed]="dish.isSpicy === true" class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-red-300 disabled:opacity-50">{{ dish.isSpicy ? 'Non épicé' : 'Épicé' }}</button>
                        <button type="button" (click)="toggleAvailability(dish)" [disabled]="!!savingId()" class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-50">
                          {{ savingId() === dish.id ? 'Enregistrement…' : (isActive(dish) ? 'Indisponible' : 'Disponible') }}
                        </button>
                        <button type="button" (click)="pendingDeleteId.set(dish.id)" [disabled]="!!savingId()" class="rounded-lg border border-red-900/70 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-950/40 disabled:opacity-50">Supprimer</button>
                      </div>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </section>
      }

      <p class="text-xs text-gray-500">Un plat indisponible reste visible pour l’administration mais disparaît de la carte publique à son prochain chargement.</p>
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn .6s ease-out forwards; } @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`]
})
export class AdminRestaurantComponent {
  private readonly adminData = inject(AdminDataService);

  readonly items = signal<MenuItem[]>([]);
  readonly categories = signal<MenuCategory[]>([]);
  readonly media = signal<MediaAsset[]>([]);
  readonly loading = signal(true);
  readonly formSaving = signal(false);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly pendingDeleteId = signal<string | null>(null);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');
  readonly query = signal('');
  readonly savingId = signal<string | null>(null);
  readonly menuImages = computed(() => this.media().filter(asset => asset.category === 'menu'));
  draft = this.emptyDraft();

  readonly filteredItems = computed(() => {
    const query = this.query().trim().toLocaleLowerCase('fr');
    return [...this.items()]
      .filter(item => !query || `${item.name || ''} ${item.category || ''} ${this.categoryName(item)}`.toLocaleLowerCase('fr').includes(query))
      .sort((a, b) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0));
  });

  constructor() { void this.load(); }

  isActive(dish: MenuItem): boolean { return dish.active !== false; }

  async load(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      const [items, categories] = await Promise.all([
        this.adminData.getMenuItems(), this.adminData.getCategories()
      ]);
      this.items.set(items);
      this.categories.set(categories);
      try {
        this.media.set(await this.adminData.getMediaAssets());
      } catch {
        this.media.set([]);
      }
    } catch {
      this.errorMessage.set('Impossible de charger le menu. Vérifiez votre session administrateur puis réessayez.');
    } finally {
      this.loading.set(false);
    }
  }

  categoryName(dish: MenuItem): string {
    return this.categories().find(category => category.id === dish.categoryId)?.name ?? dish.category ?? 'Non classé';
  }

  startCreate(): void {
    this.editingId.set(null);
    this.pendingDeleteId.set(null);
    this.successMessage.set('');
    this.errorMessage.set('');
    this.draft = this.emptyDraft(this.items().length);
    this.showForm.set(true);
  }

  editDish(dish: MenuItem): void {
    this.editingId.set(dish.id);
    this.pendingDeleteId.set(null);
    this.successMessage.set('');
    this.errorMessage.set('');
    this.draft = {
      name: dish.name ?? '',
      categoryId: dish.categoryId ?? '',
      price: Number(dish.price ?? 0),
      shortDescription: dish.shortDescription ?? dish.description ?? '',
      imageUrl: dish.imageUrl ?? dish.image ?? '',
      active: this.isActive(dish),
      isFeatured: dish.isFeatured === true,
      isVegetarian: dish.isVegetarian === true,
      isSpicy: dish.isSpicy === true,
      displayOrder: Number(dish.displayOrder ?? 0)
    };
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.draft = this.emptyDraft();
  }

  async saveForm(): Promise<void> {
    const category = this.categories().find(item => item.id === this.draft.categoryId);
    if (!category || !this.draft.name.trim() || this.formSaving()) return;

    const payload: MenuItemPayload = {
      name: this.draft.name.trim(),
      category: category.name,
      categoryId: category.id,
      price: Number(this.draft.price),
      shortDescription: this.draft.shortDescription.trim() || undefined,
      imageUrl: this.draft.imageUrl || undefined,
      active: this.draft.active,
      displayOrder: Number(this.draft.displayOrder),
      isFeatured: this.draft.isFeatured,
      isVegetarian: this.draft.isVegetarian,
      isSpicy: this.draft.isSpicy
    };

    this.formSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    try {
      const currentId = this.editingId();
      if (currentId) {
        const updated = await this.adminData.updateMenuItem(currentId, payload);
        this.items.update(items => items.map(item => item.id === updated.id ? { ...item, ...updated } : item));
        this.successMessage.set(`« ${updated.name || this.draft.name} » a été modifié.`);
      } else {
        const created = await this.adminData.createMenuItem(payload);
        this.items.update(items => [...items, created]);
        this.successMessage.set(`« ${created.name || this.draft.name} » a été créé.`);
      }
      this.closeForm();
    } catch {
      this.errorMessage.set('Le plat n’a pas pu être enregistré. Vérifiez les champs puis réessayez.');
    } finally {
      this.formSaving.set(false);
    }
  }

  async deleteDish(dish: MenuItem): Promise<void> {
    if (this.savingId()) return;
    this.savingId.set(dish.id);
    this.errorMessage.set('');
    this.successMessage.set('');
    try {
      await this.adminData.deleteMenuItem(dish.id);
      this.items.update(items => items.filter(item => item.id !== dish.id));
      this.pendingDeleteId.set(null);
      if (this.editingId() === dish.id) this.closeForm();
      this.successMessage.set(`« ${dish.name || 'Le plat'} » a été supprimé.`);
    } catch {
      this.errorMessage.set(`« ${dish.name || 'Le plat'} » n’a pas pu être supprimé.`);
    } finally {
      this.savingId.set(null);
    }
  }

  private emptyDraft(displayOrder = 0) {
    return {
      name: '',
      categoryId: '',
      price: 0,
      shortDescription: '',
      imageUrl: '',
      active: true,
      isFeatured: false,
      isVegetarian: false,
      isSpicy: false,
      displayOrder
    };
  }

  async toggleFeatured(dish: MenuItem): Promise<void> {
    await this.saveDish(dish, { isFeatured: !dish.isFeatured });
  }

  async toggleVegetarian(dish: MenuItem): Promise<void> {
    await this.saveDish(dish, { isVegetarian: !dish.isVegetarian });
  }

  async toggleSpicy(dish: MenuItem): Promise<void> {
    await this.saveDish(dish, { isSpicy: !dish.isSpicy });
  }

  async toggleAvailability(dish: MenuItem): Promise<void> {
    await this.saveDish(dish, { active: !this.isActive(dish) });
  }

  private async saveDish(
    dish: MenuItem,
    payload: Pick<MenuItemPayload, 'active' | 'isFeatured' | 'isVegetarian' | 'isSpicy'>
  ): Promise<void> {
    if (this.savingId()) return;
    this.savingId.set(dish.id);
    this.errorMessage.set('');
    this.successMessage.set('');
    try {
      const updated = await this.adminData.updateMenuItem(dish.id, payload);
      this.items.update(items => items.map(item => item.id === updated.id ? { ...item, ...updated } : item));
    } catch {
      this.errorMessage.set(`La modification de « ${dish.name || 'ce plat'} » n’a pas pu être mise à jour.`);
    } finally {
      this.savingId.set(null);
    }
  }
}
