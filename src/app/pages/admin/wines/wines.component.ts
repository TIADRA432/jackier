import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, WineItem } from '../../../core/services/admin-data.service';

type WineDraft = Omit<WineItem, 'id'>;

@Component({
  selector: 'app-admin-wines',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 class="text-2xl font-serif font-bold text-white">Carte des vins</h1><p class="mt-1 text-sm text-gray-400">Gérez la sélection et les tarifs affichés sur le site.</p></div><button type="button" (click)="load()" [disabled]="loading()" class="self-start rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-50">{{ loading() ? 'Actualisation…' : 'Actualiser' }}</button></header>
      @if (errorMessage()) { <div role="alert" class="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">{{ errorMessage() }}</div> }
      <section class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6"><h2 class="font-serif text-lg font-bold text-white">{{ editingId() ? 'Modifier un vin' : 'Ajouter un vin' }}</h2><form class="mt-4 grid gap-4 md:grid-cols-2" (ngSubmit)="save()"><label class="grid gap-1 text-sm text-gray-300">Nom<input required maxlength="120" [ngModel]="draft().name" (ngModelChange)="patchDraft({ name: $event })" name="wineName" class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white outline-none focus:border-jacquier-gold" /></label><label class="grid gap-1 text-sm text-gray-300">Prix bouteille (FG)<input required min="0" type="number" [ngModel]="draft().priceBottle" (ngModelChange)="patchDraft({ priceBottle: numberValue($event) })" name="priceBottle" class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white outline-none focus:border-jacquier-gold" /></label><label class="grid gap-1 text-sm text-gray-300">Prix verre (FG, facultatif)<input min="0" type="number" [ngModel]="draft().priceGlass ?? ''" (ngModelChange)="setGlassPrice($event)" name="priceGlass" class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white outline-none focus:border-jacquier-gold" /></label><label class="grid gap-1 text-sm text-gray-300">Ordre<input required min="0" max="10000" type="number" [ngModel]="draft().displayOrder" (ngModelChange)="patchDraft({ displayOrder: numberValue($event) })" name="wineOrder" class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white outline-none focus:border-jacquier-gold" /></label><label class="grid gap-1 text-sm text-gray-300 md:col-span-2">Description<textarea maxlength="1000" rows="3" [ngModel]="draft().description" (ngModelChange)="patchDraft({ description: $event })" name="wineDescription" class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white outline-none focus:border-jacquier-gold"></textarea></label><label class="grid gap-1 text-sm text-gray-300 md:col-span-2">URL de l’image (facultatif)<input type="url" [ngModel]="draft().imageUrl" (ngModelChange)="patchDraft({ imageUrl: $event })" name="wineImageUrl" class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white outline-none focus:border-jacquier-gold" /></label><div class="flex gap-2 md:col-span-2"><button type="submit" [disabled]="saving()" class="rounded-lg bg-jacquier-gold px-4 py-2 text-sm font-bold text-jacquier-dark disabled:opacity-50">{{ saving() ? 'Enregistrement…' : (editingId() ? 'Enregistrer' : 'Ajouter') }}</button>@if (editingId()) { <button type="button" (click)="resetDraft()" class="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300">Annuler</button> }</div></form></section>
      @if (loading()) { <div role="status" class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-gray-400">Chargement de la carte des vins…</div> } @else if (!wines().length) { <div class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-gray-400">Aucun vin n’est encore enregistré.</div> } @else { <section class="overflow-x-auto rounded-2xl border border-gray-800 bg-[#1a1a1a]"><table class="w-full min-w-[720px] text-left text-sm"><thead class="border-b border-gray-800 bg-[#121212] text-xs uppercase text-gray-500"><tr><th class="px-6 py-4">Vin</th><th class="px-6 py-4">Bouteille</th><th class="px-6 py-4">Verre</th><th class="px-6 py-4">Ordre</th><th class="px-6 py-4 text-right"><span class="sr-only">Actions</span></th></tr></thead><tbody>@for (wine of sortedWines(); track wine.id) { <tr class="border-b border-gray-800/50"><td class="px-6 py-4 font-medium text-white"><div class="flex items-center gap-3">@if (wine.imageUrl) { <img [src]="wine.imageUrl" [alt]="wine.name" class="h-10 w-10 rounded-lg object-cover" /> }<span>{{ wine.name }}</span></div></td><td class="px-6 py-4 text-gray-300">{{ wine.priceBottle }} FG</td><td class="px-6 py-4 text-gray-300">{{ wine.priceGlass ?? '—' }}{{ wine.priceGlass !== undefined ? ' FG' : '' }}</td><td class="px-6 py-4 text-gray-300">{{ wine.displayOrder ?? 0 }}</td><td class="px-6 py-4 text-right">@if (pendingDeleteId() === wine.id) { <span class="mr-3 text-xs text-red-200">Supprimer ?</span><button type="button" (click)="deleteWine(wine)" [disabled]="saving()" class="mr-2 rounded-lg bg-red-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Confirmer</button><button type="button" (click)="pendingDeleteId.set(null)" class="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300">Annuler</button> } @else { <button type="button" (click)="edit(wine)" class="mr-2 rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold">Modifier</button><button type="button" (click)="pendingDeleteId.set(wine.id)" [attr.aria-label]="'Supprimer le vin ' + wine.name" class="rounded-lg border border-red-900/70 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-950/40">Supprimer</button> }</td></tr> }</tbody></table></section> }
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn .6s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`]
})
export class AdminWinesComponent {
  private readonly adminData = inject(AdminDataService);
  readonly wines = signal<WineItem[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly editingId = signal<string | null>(null);
  readonly pendingDeleteId = signal<string | null>(null);
  readonly draft = signal<WineDraft>({ name: '', description: '', priceBottle: 0, displayOrder: 0 });
  readonly sortedWines = computed(() => [...this.wines()].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));

  constructor() { void this.load(); }

  numberValue(value: string | number): number { return Number(value); }
  patchDraft(patch: Partial<WineDraft>): void { this.draft.update(draft => ({ ...draft, ...patch })); }
  setGlassPrice(value: string | number): void { this.patchDraft({ priceGlass: value === '' ? undefined : Number(value) }); }
  resetDraft(): void { this.editingId.set(null); this.pendingDeleteId.set(null); this.draft.set({ name: '', description: '', priceBottle: 0, displayOrder: this.wines().length }); }

  async load(): Promise<void> {
    this.loading.set(true); this.errorMessage.set('');
    try { this.wines.set(await this.adminData.getWines()); }
    catch { this.errorMessage.set('Impossible de charger la carte des vins. Vérifiez votre session puis réessayez.'); }
    finally { this.loading.set(false); }
  }

  edit(wine: WineItem): void { this.pendingDeleteId.set(null); this.editingId.set(wine.id); this.draft.set({ name: wine.name, description: wine.description ?? '', priceBottle: wine.priceBottle, priceGlass: wine.priceGlass, imageUrl: wine.imageUrl ?? '', displayOrder: wine.displayOrder ?? 0 }); }

  async save(): Promise<void> {
    const raw = this.draft();
    const payload: WineDraft = { ...raw, name: raw.name.trim(), description: raw.description?.trim(), imageUrl: raw.imageUrl?.trim(), priceBottle: Number(raw.priceBottle), priceGlass: raw.priceGlass === undefined ? undefined : Number(raw.priceGlass), displayOrder: Number(raw.displayOrder) };
    if (!payload.name || !Number.isFinite(payload.priceBottle) || payload.priceBottle < 0 || !Number.isInteger(payload.displayOrder) || payload.displayOrder < 0 || (payload.priceGlass !== undefined && (!Number.isFinite(payload.priceGlass) || payload.priceGlass < 0))) { this.errorMessage.set('Vérifiez le nom, les prix et l’ordre du vin.'); return; }
    this.saving.set(true); this.errorMessage.set('');
    try { const currentId = this.editingId(); const saved = currentId ? await this.adminData.updateWine(currentId, payload) : await this.adminData.createWine(payload); this.wines.update(wines => currentId ? wines.map(wine => wine.id === saved.id ? saved : wine) : [...wines, saved]); this.resetDraft(); }
    catch { this.errorMessage.set('Le vin n’a pas pu être enregistré.'); }
    finally { this.saving.set(false); }
  }

  async deleteWine(wine: WineItem): Promise<void> {
    this.saving.set(true); this.errorMessage.set('');
    try { await this.adminData.deleteWine(wine.id); this.wines.update(wines => wines.filter(item => item.id !== wine.id)); this.resetDraft(); }
    catch { this.errorMessage.set(`Le vin « ${wine.name} » n’a pas pu être supprimé.`); }
    finally { this.saving.set(false); }
  }
}
