import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, InventoryItem } from '../../../core/services/admin-data.service';

type InventoryDraft = {
  name: string;
  category: string;
  unit: string;
  quantity: number;
  reorderLevel: number;
  unitCost: number | null;
  active: boolean;
};

const emptyDraft = (): InventoryDraft => ({ name: '', category: 'Non classé', unit: 'unité', quantity: 0, reorderLevel: 0, unitCost: null, active: true });

@Component({
  selector: 'app-admin-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 class="text-2xl font-serif font-bold text-white">Stock & Inventaire</h1><p class="mt-1 text-sm text-gray-400">Articles et seuils réellement enregistrés</p></div>
        <div class="flex gap-3"><button type="button" (click)="load()" [disabled]="loading()" class="rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-60">Actualiser</button><button type="button" (click)="startCreate()" class="rounded-xl bg-jacquier-gold px-4 py-2 text-sm font-bold text-jacquier-dark hover:bg-white">Ajouter un article</button></div>
      </div>

      @if (errorMessage()) { <p class="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">{{ errorMessage() }}</p> }

      <section class="grid grid-cols-1 gap-5 md:grid-cols-3">
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6"><p class="text-xs font-bold uppercase tracking-widest text-gray-500">Valeur estimée</p><p class="mt-3 text-2xl font-serif font-bold text-white">{{ formatAmount(totalValue()) }} FG</p><p class="mt-2 text-xs text-gray-400">Quantité × coût unitaire renseigné</p></article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6"><p class="text-xs font-bold uppercase tracking-widest text-gray-500">Alertes de seuil</p><p class="mt-3 text-2xl font-serif font-bold text-red-400">{{ lowStockCount() }}</p><p class="mt-2 text-xs text-gray-400">Articles actifs au seuil ou en dessous</p></article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6"><p class="text-xs font-bold uppercase tracking-widest text-gray-500">Articles actifs</p><p class="mt-3 text-2xl font-serif font-bold text-jacquier-gold">{{ activeCount() }}</p><p class="mt-2 text-xs text-gray-400">Suivis dans l’inventaire</p></article>
      </section>

      @if (showForm()) {
        <form (ngSubmit)="save()" class="grid gap-4 rounded-2xl border border-jacquier-gold/30 bg-[#1a1a1a] p-6 md:grid-cols-2">
          <h2 class="md:col-span-2 text-lg font-serif font-bold text-white">{{ editingId() ? 'Modifier l’article' : 'Nouvel article' }}</h2>
          <label class="text-sm text-gray-300">Nom<input [(ngModel)]="draft.name" name="name" maxlength="160" required class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
          <label class="text-sm text-gray-300">Catégorie<input [(ngModel)]="draft.category" name="category" maxlength="80" required class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
          <label class="text-sm text-gray-300">Unité<input [(ngModel)]="draft.unit" name="unit" maxlength="16" required class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
          <label class="text-sm text-gray-300">Quantité actuelle<input type="number" min="0" max="1000000" step="0.001" [(ngModel)]="draft.quantity" name="quantity" required class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
          <label class="text-sm text-gray-300">Seuil d’alerte<input type="number" min="0" max="1000000" step="0.001" [(ngModel)]="draft.reorderLevel" name="reorderLevel" required class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
          <label class="text-sm text-gray-300">Coût unitaire (FG)<input type="number" min="0" max="100000000" step="0.01" [(ngModel)]="draft.unitCost" name="unitCost" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
          <label class="flex items-center gap-3 text-sm text-gray-300"><input type="checkbox" [(ngModel)]="draft.active" name="active" class="h-4 w-4 accent-yellow-500" /> Article actif</label>
          <div class="flex justify-end gap-3 md:col-span-2"><button type="button" (click)="cancelEdit()" class="rounded-xl border border-gray-700 px-4 py-2 text-sm text-gray-300">Annuler</button><button type="submit" [disabled]="saving()" class="rounded-xl bg-jacquier-gold px-4 py-2 text-sm font-bold text-jacquier-dark disabled:opacity-60">{{ saving() ? 'Enregistrement…' : 'Enregistrer' }}</button></div>
        </form>
      }

      <section class="overflow-x-auto rounded-2xl border border-gray-800 bg-[#1a1a1a]">
        @if (loading()) { <p class="p-12 text-center text-sm text-gray-400" role="status">Chargement de l’inventaire…</p> }
        @else if (!items().length) { <p class="p-12 text-center text-sm text-gray-400">Aucun article n’est encore enregistré.</p> }
        @else {
          <table class="w-full min-w-[850px] text-left text-sm"><thead class="border-b border-gray-800 bg-[#121212] text-xs uppercase text-gray-500"><tr><th class="px-6 py-4">Article</th><th class="px-6 py-4">Quantité</th><th class="px-6 py-4">Seuil</th><th class="px-6 py-4">Coût</th><th class="px-6 py-4">Statut</th><th class="px-6 py-4 text-right"><span class="sr-only">Actions</span></th></tr></thead><tbody>
            @for (item of items(); track item.id) { <tr class="border-b border-gray-800/60"><td class="px-6 py-4"><p class="font-bold text-white">{{ item.name }}</p><p class="text-xs text-gray-500">{{ item.category }}</p></td><td class="px-6 py-4 text-gray-200" [class.text-red-400]="isLowStock(item)">{{ item.quantity }} {{ item.unit }}</td><td class="px-6 py-4 text-gray-400">{{ item.reorderLevel }} {{ item.unit }}</td><td class="px-6 py-4 text-gray-400">{{ item.unitCost === undefined ? '—' : formatAmount(item.unitCost) + ' FG' }}</td><td class="px-6 py-4"><span [class]="'rounded px-2 py-1 text-xs font-bold ' + (isLowStock(item) ? 'bg-red-500/10 text-red-300' : item.active ? 'bg-green-500/10 text-green-300' : 'bg-gray-500/10 text-gray-400')">{{ isLowStock(item) ? 'À réapprovisionner' : item.active ? 'En stock' : 'Inactif' }}</span></td><td class="px-6 py-4 text-right">@if (pendingDeleteId() === item.id) { <button type="button" (click)="delete(item)" [disabled]="saving()" class="mr-2 rounded-lg bg-red-900 px-3 py-2 text-xs font-bold text-white">Confirmer</button><button type="button" (click)="pendingDeleteId.set(null)" class="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300">Annuler</button> } @else { <button type="button" (click)="edit(item)" class="mr-2 rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-gray-200">Modifier</button><button type="button" (click)="pendingDeleteId.set(item.id)" [attr.aria-label]="'Supprimer ' + item.name" class="rounded-lg border border-red-900/70 px-3 py-2 text-xs font-bold text-red-200">Supprimer</button> }</td></tr> }
          </tbody></table>
        }
      </section>
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn .6s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`]
})
export class StockComponent {
  private readonly adminData = inject(AdminDataService);
  readonly items = signal<InventoryItem[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly pendingDeleteId = signal<string | null>(null);
  readonly errorMessage = signal('');
  draft = emptyDraft();
  readonly activeCount = computed(() => this.items().filter(item => item.active).length);
  readonly lowStockCount = computed(() => this.items().filter(item => this.isLowStock(item)).length);
  readonly totalValue = computed(() => this.items().reduce((sum, item) => sum + item.quantity * (item.unitCost ?? 0), 0));

  constructor() { void this.load(); }
  async load(): Promise<void> { this.loading.set(true); this.errorMessage.set(''); try { this.items.set(await this.adminData.getInventoryItems()); } catch { this.errorMessage.set('Impossible de charger l’inventaire. Réessayez dans un instant.'); } finally { this.loading.set(false); } }
  startCreate(): void { this.draft = emptyDraft(); this.editingId.set(null); this.showForm.set(true); }
  edit(item: InventoryItem): void { this.draft = { name: item.name, category: item.category, unit: item.unit, quantity: item.quantity, reorderLevel: item.reorderLevel, unitCost: item.unitCost ?? null, active: item.active }; this.editingId.set(item.id); this.showForm.set(true); this.pendingDeleteId.set(null); }
  cancelEdit(): void { this.showForm.set(false); this.editingId.set(null); this.draft = emptyDraft(); }
  async save(): Promise<void> {
    if (!this.draft.name.trim() || !this.draft.category.trim() || !this.draft.unit.trim()) return;
    this.saving.set(true); this.errorMessage.set('');
    const payload = { ...this.draft, name: this.draft.name.trim(), category: this.draft.category.trim(), unit: this.draft.unit.trim(), unitCost: this.draft.unitCost ?? undefined };
    try { const id = this.editingId(); if (id) { const updated = await this.adminData.updateInventoryItem(id, payload); this.items.update(items => items.map(item => item.id === id ? updated : item)); } else { const created = await this.adminData.createInventoryItem(payload); this.items.update(items => [...items, created].sort((a, b) => a.name.localeCompare(b.name))); } this.cancelEdit(); } catch { this.errorMessage.set('Impossible d’enregistrer cet article. Vérifiez les valeurs saisies.'); } finally { this.saving.set(false); }
  }
  async delete(item: InventoryItem): Promise<void> { this.saving.set(true); this.errorMessage.set(''); try { await this.adminData.deleteInventoryItem(item.id); this.items.update(items => items.filter(candidate => candidate.id !== item.id)); this.pendingDeleteId.set(null); } catch { this.errorMessage.set('Impossible de supprimer cet article. Réessayez dans un instant.'); } finally { this.saving.set(false); } }
  isLowStock(item: InventoryItem): boolean { return item.active && item.quantity <= item.reorderLevel; }
  formatAmount(value: number): string { return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value || 0); }
}
