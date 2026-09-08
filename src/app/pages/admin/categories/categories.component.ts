import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, MenuCategory } from '../../../core/services/admin-data.service';

type CategoryDraft = Omit<MenuCategory, 'id'>;

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 class="text-2xl font-serif font-bold text-white">Catégories du menu</h1><p class="mt-1 text-sm text-gray-400">Organisez les catégories proposées aux plats.</p></div>
        <button type="button" (click)="load()" [disabled]="loading()" class="self-start rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-50">{{ loading() ? 'Actualisation…' : 'Actualiser' }}</button>
      </header>

      @if (errorMessage()) { <div role="alert" class="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">{{ errorMessage() }}</div> }

      <section class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6">
        <h2 class="font-serif text-lg font-bold text-white">{{ editingId() ? 'Modifier une catégorie' : 'Ajouter une catégorie' }}</h2>
        <form class="mt-4 grid gap-4 md:grid-cols-[1fr_10rem_auto]" (ngSubmit)="save()">
          <label class="grid gap-1 text-sm text-gray-300">Nom
            <input required maxlength="80" [ngModel]="draft().name" (ngModelChange)="patchDraft({ name: $event })" name="categoryName" class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white outline-none focus:border-jacquier-gold" />
          </label>
          <label class="grid gap-1 text-sm text-gray-300">Ordre
            <input required min="0" max="10000" type="number" [ngModel]="draft().order" (ngModelChange)="patchDraft({ order: numberValue($event) })" name="categoryOrder" class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white outline-none focus:border-jacquier-gold" />
          </label>
          <div class="flex items-end gap-2"><button type="submit" [disabled]="saving()" class="rounded-lg bg-jacquier-gold px-4 py-2 text-sm font-bold text-jacquier-dark disabled:opacity-50">{{ saving() ? 'Enregistrement…' : (editingId() ? 'Enregistrer' : 'Ajouter') }}</button>@if (editingId()) { <button type="button" (click)="resetDraft()" class="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300">Annuler</button> }</div>
        </form>
      </section>

      @if (loading()) { <div role="status" class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-gray-400">Chargement des catégories…</div> }
      @else if (!categories().length) { <div class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-gray-400">Aucune catégorie n’est encore enregistrée.</div> }
      @else { <section class="overflow-x-auto rounded-2xl border border-gray-800 bg-[#1a1a1a]"><table class="w-full min-w-[560px] text-left text-sm"><thead class="border-b border-gray-800 bg-[#121212] text-xs uppercase text-gray-500"><tr><th class="px-6 py-4">Nom</th><th class="px-6 py-4">Ordre</th><th class="px-6 py-4 text-right"><span class="sr-only">Actions</span></th></tr></thead><tbody>@for (category of sortedCategories(); track category.id) { <tr class="border-b border-gray-800/50"><td class="px-6 py-4 font-medium text-white">{{ category.name }}</td><td class="px-6 py-4 text-gray-300">{{ category.order ?? 0 }}</td><td class="px-6 py-4 text-right">@if (pendingDeleteId() === category.id) { <span class="mr-3 text-xs text-red-200">Supprimer ?</span><button type="button" (click)="deleteCategory(category)" [disabled]="saving()" class="mr-2 rounded-lg bg-red-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Confirmer</button><button type="button" (click)="pendingDeleteId.set(null)" class="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300">Annuler</button> } @else { <button type="button" (click)="edit(category)" class="mr-2 rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold">Modifier</button><button type="button" (click)="pendingDeleteId.set(category.id)" [attr.aria-label]="'Supprimer la catégorie ' + category.name" class="rounded-lg border border-red-900/70 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-950/40">Supprimer</button> }</td></tr> }</tbody></table></section> }
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn .6s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`]
})
export class AdminCategoriesComponent {
  private readonly adminData = inject(AdminDataService);
  readonly categories = signal<MenuCategory[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly editingId = signal<string | null>(null);
  readonly pendingDeleteId = signal<string | null>(null);
  readonly draft = signal<CategoryDraft>({ name: '', order: 0 });
  readonly sortedCategories = computed(() => [...this.categories()].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));

  constructor() { void this.load(); }

  numberValue(value: string | number): number { return Number(value); }
  patchDraft(patch: Partial<CategoryDraft>): void { this.draft.update(draft => ({ ...draft, ...patch })); }
  resetDraft(): void { this.editingId.set(null); this.pendingDeleteId.set(null); this.draft.set({ name: '', order: this.categories().length }); }

  async load(): Promise<void> {
    this.loading.set(true); this.errorMessage.set('');
    try { this.categories.set(await this.adminData.getCategories()); }
    catch { this.errorMessage.set('Impossible de charger les catégories. Vérifiez votre session puis réessayez.'); }
    finally { this.loading.set(false); }
  }

  edit(category: MenuCategory): void { this.pendingDeleteId.set(null); this.editingId.set(category.id); this.draft.set({ name: category.name, order: category.order ?? 0 }); }

  async save(): Promise<void> {
    const payload = { ...this.draft(), name: this.draft().name.trim(), order: Number(this.draft().order) };
    if (!payload.name || !Number.isInteger(payload.order) || payload.order < 0) { this.errorMessage.set('Saisissez un nom et un ordre entier positif.'); return; }
    this.saving.set(true); this.errorMessage.set('');
    try {
      const currentId = this.editingId();
      const saved = currentId ? await this.adminData.updateCategory(currentId, payload) : await this.adminData.createCategory(payload);
      this.categories.update(categories => currentId ? categories.map(category => category.id === saved.id ? saved : category) : [...categories, saved]);
      this.resetDraft();
    } catch { this.errorMessage.set('La catégorie n’a pas pu être enregistrée.'); }
    finally { this.saving.set(false); }
  }

  async deleteCategory(category: MenuCategory): Promise<void> {
    this.saving.set(true); this.errorMessage.set('');
    try { await this.adminData.deleteCategory(category.id); this.categories.update(categories => categories.filter(item => item.id !== category.id)); this.resetDraft(); }
    catch { this.errorMessage.set(`La catégorie « ${category.name} » n’a pas pu être supprimée.`); }
    finally { this.saving.set(false); }
  }
}
