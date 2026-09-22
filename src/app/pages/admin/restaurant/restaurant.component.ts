import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, MediaAsset, MenuCategory, MenuItem } from '../../../core/services/admin-data.service';

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
          <p class="mt-1 text-sm text-gray-400">Plats publiés et disponibilité de la carte.</p>
        </div>
        <div class="flex gap-3">
          <button type="button" (click)="showCreateForm.set(!showCreateForm())" class="rounded-xl bg-jacquier-gold px-4 py-2 text-sm font-bold text-jacquier-dark hover:bg-white">{{ showCreateForm() ? 'Fermer' : 'Nouveau plat' }}</button>
          <button type="button" (click)="load()" [disabled]="loading() || !!savingId()" class="rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-50">{{ loading() ? 'Actualisation…' : 'Actualiser' }}</button>
        </div>
      </header>

      @if (showCreateForm()) {
        <form (ngSubmit)="createDish()" class="grid gap-4 rounded-2xl border border-jacquier-gold/30 bg-[#1a1a1a] p-6 md:grid-cols-2">
          <h2 class="text-xl font-serif font-bold text-white md:col-span-2">Créer un plat</h2>
          <label class="text-sm text-gray-300">Nom du plat *
            <input [(ngModel)]="draft.name" name="name" required maxlength="120" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none focus:ring-1 focus:ring-jacquier-gold" />
          </label>
          <label class="text-sm text-gray-300">Catégorie *
            <select [(ngModel)]="draft.categoryId" name="categoryId" required class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none focus:ring-1 focus:ring-jacquier-gold">
              <option value="" disabled>Choisir une catégorie</option>
              @for (category of categories(); track category.id) { <option [value]="category.id">{{ category.name }}</option> }
            </select>
          </label>
          <label class="text-sm text-gray-300">Prix en GNF *
            <input [(ngModel)]="draft.price" name="price" type="number" required min="0" max="100000000" step="1000" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none focus:ring-1 focus:ring-jacquier-gold" />
          </label>
          <label class="text-sm text-gray-300">Photo
            <select [(ngModel)]="draft.imageUrl" name="imageUrl" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none focus:ring-1 focus:ring-jacquier-gold">
              <option value="">Sans photo</option>
              @for (asset of menuImages(); track asset.id) { <option [value]="asset.publicUrl">{{ asset.title || asset.originalName }}</option> }
            </select>
            <span class="mt-1 block text-xs text-gray-500">Ajoutez d’abord les nouvelles photos dans CMS & Contenu.</span>
          </label>
          <label class="text-sm text-gray-300 md:col-span-2">Description
            <textarea [(ngModel)]="draft.shortDescription" name="shortDescription" maxlength="1000" rows="3" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none focus:ring-1 focus:ring-jacquier-gold"></textarea>
          </label>
          <div class="flex flex-wrap gap-6 text-sm text-gray-300 md:col-span-2">
            <label class="flex items-center gap-2"><input [(ngModel)]="draft.active" name="active" type="checkbox" /> Publier immédiatement</label>
            <label class="flex items-center gap-2"><input [(ngModel)]="draft.isFeatured" name="isFeatured" type="checkbox" /> Suggestion de la Cheffe</label>
            <label class="flex items-center gap-2"><input [(ngModel)]="draft.isVegetarian" name="isVegetarian" type="checkbox" /> Végétarien</label>
            <label class="flex items-center gap-2"><input [(ngModel)]="draft.isSpicy" name="isSpicy" type="checkbox" /> Épicé</label>
          </div>
          <div class="flex items-center justify-end gap-4 md:col-span-2">
            @if (createSuccess()) { <span role="status" class="text-sm text-emerald-300">{{ createSuccess() }}</span> }
            <button type="submit" [disabled]="creating() || !draft.name.trim() || !draft.categoryId || draft.price < 0" class="rounded-xl bg-jacquier-gold px-5 py-3 font-bold text-jacquier-dark disabled:opacity-50">{{ creating() ? 'Création…' : 'Créer le plat' }}</button>
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
          <table class="w-full min-w-[980px] text-left text-sm">
            <thead class="border-b border-gray-800 bg-[#121212] text-xs uppercase text-gray-500">
              <tr><th class="px-6 py-4">Plat</th><th class="px-6 py-4">Catégorie</th><th class="px-6 py-4">Prix</th><th class="px-6 py-4">Repères</th><th class="px-6 py-4">Carte</th><th class="px-6 py-4"><span class="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              @for (dish of filteredItems(); track dish.id) {
                <tr class="border-b border-gray-800/50">
                  <td class="px-6 py-4 font-medium text-white">
                    <div class="flex items-center gap-3">
                      @if (dish.imageUrl || dish.image) { <img [src]="dish.imageUrl || dish.image" [alt]="dish.name || 'Photo du plat'" class="h-10 w-10 rounded-lg object-cover" /> }
                      {{ dish.name || 'Plat sans nom' }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-300">{{ categoryName(dish) }}</td>
                  <td class="px-6 py-4 text-white">{{ dish.price || 'Prix non renseigné' }}{{ dish.price ? ' FG' : '' }}</td>
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
                    <div class="flex flex-wrap justify-end gap-2">
                      <button type="button" (click)="toggleFeatured(dish)" [disabled]="!!savingId()" [attr.aria-pressed]="dish.isFeatured === true" class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-jacquier-gold disabled:opacity-50">{{ dish.isFeatured ? 'Retirer Cheffe' : 'Ajouter Cheffe' }}</button>
                      <button type="button" (click)="toggleVegetarian(dish)" [disabled]="!!savingId()" [attr.aria-pressed]="dish.isVegetarian === true" class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-emerald-300 disabled:opacity-50">{{ dish.isVegetarian ? 'Non végétarien' : 'Végétarien' }}</button>
                      <button type="button" (click)="toggleSpicy(dish)" [disabled]="!!savingId()" [attr.aria-pressed]="dish.isSpicy === true" class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-red-300 disabled:opacity-50">{{ dish.isSpicy ? 'Non épicé' : 'Épicé' }}</button>
                      <button type="button" (click)="toggleAvailability(dish)" [disabled]="!!savingId()" [attr.aria-label]="isActive(dish) ? 'Marquer ' + (dish.name || 'ce plat') + ' indisponible' : 'Marquer ' + (dish.name || 'ce plat') + ' disponible'" class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:cursor-wait disabled:opacity-50">
                        {{ savingId() === dish.id ? 'Enregistrement…' : (isActive(dish) ? 'Indisponible' : 'Disponible') }}
                      </button>
                    </div>
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
  readonly creating = signal(false);
  readonly showCreateForm = signal(false);
  readonly createSuccess = signal('');
  readonly errorMessage = signal('');
  readonly query = signal('');
  readonly savingId = signal<string | null>(null);
  readonly menuImages = computed(() => this.media().filter(asset => asset.category === 'menu'));
  draft = this.emptyDraft();
  readonly filteredItems = computed(() => {
    const query = this.query().trim().toLocaleLowerCase('fr');
    return this.items().filter(item => !query || `${item.name || ''} ${item.category || ''}`.toLocaleLowerCase('fr').includes(query));
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

  async createDish(): Promise<void> {
    const category = this.categories().find(item => item.id === this.draft.categoryId);
    if (!category || !this.draft.name.trim() || this.creating()) return;
    this.creating.set(true);
    this.errorMessage.set('');
    this.createSuccess.set('');
    try {
      const created = await this.adminData.createMenuItem({
        name: this.draft.name.trim(), category: category.name, categoryId: category.id,
        price: Number(this.draft.price), shortDescription: this.draft.shortDescription.trim() || undefined,
        imageUrl: this.draft.imageUrl || undefined, active: this.draft.active, isFeatured: this.draft.isFeatured,
        isVegetarian: this.draft.isVegetarian, isSpicy: this.draft.isSpicy
      });
      this.items.update(items => [...items, created]);
      this.draft = this.emptyDraft();
      this.createSuccess.set(`« ${created.name} » a été créé.`);
    } catch {
      this.errorMessage.set('Le plat n’a pas pu être créé. Vérifiez les champs puis réessayez.');
    } finally {
      this.creating.set(false);
    }
  }

  private emptyDraft() {
    return {
      name: '', categoryId: '', price: 0, shortDescription: '', imageUrl: '',
      active: true, isFeatured: false, isVegetarian: false, isSpicy: false
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
    payload: { active?: boolean; isFeatured?: boolean; isVegetarian?: boolean; isSpicy?: boolean }
  ): Promise<void> {
    if (this.savingId()) return;
    this.savingId.set(dish.id);
    this.errorMessage.set('');
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
