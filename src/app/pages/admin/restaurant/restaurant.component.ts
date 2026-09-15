import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService, MenuItem } from '../../../core/services/admin-data.service';

@Component({
  selector: 'app-admin-restaurant',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">Gestion Restaurant</h1>
          <p class="mt-1 text-sm text-gray-400">Plats publiés et disponibilité de la carte.</p>
        </div>
        <button type="button" (click)="load()" [disabled]="loading()" class="self-start rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-50">
          {{ loading() ? 'Actualisation…' : 'Actualiser' }}
        </button>
      </header>

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
          <table class="w-full min-w-[720px] text-left text-sm">
            <thead class="border-b border-gray-800 bg-[#121212] text-xs uppercase text-gray-500">
              <tr><th class="px-6 py-4">Plat</th><th class="px-6 py-4">Catégorie</th><th class="px-6 py-4">Prix</th><th class="px-6 py-4">Carte</th><th class="px-6 py-4"><span class="sr-only">Actions</span></th></tr>
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
                  <td class="px-6 py-4 text-gray-300">{{ dish.category || 'Non classé' }}</td>
                  <td class="px-6 py-4 text-white">{{ dish.price || 'Prix non renseigné' }}{{ dish.price ? ' FG' : '' }}</td>
                  <td class="px-6 py-4">
                    <span [class]="isActive(dish) ? 'rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300' : 'rounded-full bg-gray-700 px-3 py-1 text-xs font-bold text-gray-300'">
                      {{ isActive(dish) ? 'Disponible' : 'Indisponible' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button type="button" (click)="toggleAvailability(dish)" [disabled]="savingId() === dish.id" [attr.aria-label]="isActive(dish) ? 'Marquer ' + (dish.name || 'ce plat') + ' indisponible' : 'Marquer ' + (dish.name || 'ce plat') + ' disponible'" class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:cursor-wait disabled:opacity-50">
                      {{ savingId() === dish.id ? 'Enregistrement…' : (isActive(dish) ? 'Rendre indisponible' : 'Rendre disponible') }}
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </section>
      }
      <p class="text-xs text-gray-500">Un plat indisponible reste visible pour l’administration mais disparaît immédiatement de la carte publique.</p>
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn .6s ease-out forwards; } @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`]
})
export class AdminRestaurantComponent {
  private readonly adminData = inject(AdminDataService);

  readonly items = signal<MenuItem[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly query = signal('');
  readonly savingId = signal<string | null>(null);
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
      this.items.set(await this.adminData.getMenuItems());
    } catch {
      this.errorMessage.set('Impossible de charger le menu. Vérifiez votre session administrateur puis réessayez.');
    } finally {
      this.loading.set(false);
    }
  }

  async toggleAvailability(dish: MenuItem): Promise<void> {
    if (this.savingId()) return;
    this.savingId.set(dish.id);
    this.errorMessage.set('');
    try {
      const updated = await this.adminData.updateMenuItem(dish.id, { active: !this.isActive(dish) });
      this.items.update(items => items.map(item => item.id === updated.id ? { ...item, ...updated } : item));
    } catch {
      this.errorMessage.set(`La disponibilité de « ${dish.name || 'ce plat'} » n’a pas pu être mise à jour.`);
    } finally {
      this.savingId.set(null);
    }
  }
}
