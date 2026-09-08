import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService, MenuItem } from '../../../core/services/admin-data.service';

@Component({
  selector: 'app-admin-restaurant', standalone: true, imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 class="text-2xl font-serif font-bold text-white">Gestion Restaurant</h1><p class="mt-1 text-sm text-gray-400">Plats actuellement publiés dans le menu.</p></div><button type="button" (click)="load()" [disabled]="loading()" class="self-start rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-50">{{ loading() ? 'Actualisation…' : 'Actualiser' }}</button></header>
      <input type="search" [value]="query()" (input)="query.set($any($event.target).value)" placeholder="Rechercher un plat…" aria-label="Rechercher un plat" class="w-full rounded-xl border border-gray-800 bg-[#1a1a1a] px-4 py-3 text-white outline-none focus:border-jacquier-gold" />
      @if (errorMessage()) { <div role="alert" class="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">{{ errorMessage() }} <button type="button" (click)="load()" class="ml-2 font-bold underline">Réessayer</button></div> }
      @if (loading()) { <div role="status" class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-gray-400">Chargement du menu…</div> }
      @else if (!filteredItems().length) { <div class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-gray-400">Aucun plat ne correspond à cette recherche.</div> }
      @else { <section class="overflow-hidden rounded-2xl border border-gray-800 bg-[#1a1a1a]"><table class="w-full text-left text-sm"><thead class="border-b border-gray-800 bg-[#121212] text-xs uppercase text-gray-500"><tr><th class="px-6 py-4">Plat</th><th class="px-6 py-4">Catégorie</th><th class="px-6 py-4">Prix</th></tr></thead><tbody>@for (dish of filteredItems(); track dish.id) { <tr class="border-b border-gray-800/50"><td class="flex items-center gap-3 px-6 py-4 font-medium text-white">@if (dish.imageUrl || dish.image) { <img [src]="dish.imageUrl || dish.image" [alt]="dish.name || 'Photo du plat'" class="h-10 w-10 rounded-lg object-cover" /> } {{ dish.name || 'Plat sans nom' }}</td><td class="px-6 py-4 text-gray-300">{{ dish.category || 'Non classé' }}</td><td class="px-6 py-4 text-white">{{ dish.price || 'Prix non renseigné' }}{{ dish.price ? ' FG' : '' }}</td></tr> }</tbody></table></section> }
      <p class="text-xs text-gray-500">La modification de disponibilité reste désactivée tant que son champ de données n’est pas formalisé côté API.</p>
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn .6s ease-out forwards; } @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`]
})
export class AdminRestaurantComponent {
  private readonly adminData = inject(AdminDataService);
  readonly items = signal<MenuItem[]>([]); readonly loading = signal(true); readonly errorMessage = signal(''); readonly query = signal('');
  readonly filteredItems = computed(() => { const query = this.query().trim().toLocaleLowerCase('fr'); return this.items().filter(item => !query || `${item.name || ''} ${item.category || ''}`.toLocaleLowerCase('fr').includes(query)); });
  constructor() { void this.load(); }
  async load(): Promise<void> { this.loading.set(true); this.errorMessage.set(''); try { this.items.set(await this.adminData.getMenuItems()); } catch { this.errorMessage.set('Impossible de charger le menu. Vérifiez votre session administrateur puis réessayez.'); } finally { this.loading.set(false); } }
}
