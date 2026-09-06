import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-admin-stock",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">Stock & Inventaire</h1>
          <p class="text-gray-400 text-sm mt-1">Contrôle des matières premières et coûts</p>
        </div>
        <div class="flex gap-3">
          <button class="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium border border-gray-700 hover:bg-gray-700 transition-colors">
            Inventaire Rapide
          </button>
          <button class="px-4 py-2 bg-jacquier-gold text-jacquier-dark rounded-xl text-sm font-bold hover:bg-white transition-colors shadow-lg shadow-jacquier-gold/20">
            Passer Commande
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Valeur Totale Stock</p>
          <h3 class="text-2xl font-serif font-bold text-white">45 250 000 FG</h3>
          <p class="text-xs text-green-500 mt-2">+2.4% vs mois dernier</p>
        </div>
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Alertes Rupture</p>
          <h3 class="text-2xl font-serif font-bold text-red-500">3 Articles</h3>
          <p class="text-xs text-gray-500 mt-2">Action immédiate requise</p>
        </div>
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Coût Matières (Food Cost)</p>
          <h3 class="text-2xl font-serif font-bold text-jacquier-gold">28.5%</h3>
          <p class="text-xs text-green-500 mt-2">-1.2% (Optimisé)</p>
        </div>
      </div>

      <div class="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
        <div class="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 class="text-lg font-serif font-bold text-white">Matières Premières</h3>
          <div class="relative">
            <i class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">search</i>
            <input type="text" placeholder="Rechercher un ingrédient..." class="bg-gray-800 border-none text-white text-xs rounded-lg pl-10 pr-4 py-2 outline-none w-64 focus:ring-1 focus:ring-jacquier-gold">
          </div>
        </div>
        
        <div class="p-6 overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800">
                <th class="pb-4">Ingrédient</th>
                <th class="pb-4">Catégorie</th>
                <th class="pb-4">Stock Actuel</th>
                <th class="pb-4">Unité</th>
                <th class="pb-4">Seuil Alerte</th>
                <th class="pb-4">Statut</th>
                <th class="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              @for (item of inventory(); track item.id) {
                <tr class="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors group">
                  <td class="py-4">
                    <span class="text-white font-medium">{{ item.name }}</span>
                  </td>
                  <td class="py-4 text-gray-400">{{ item.category }}</td>
                  <td class="py-4 font-bold" [class]="item.stock <= item.threshold ? 'text-red-500' : 'text-white'">
                    {{ item.stock }}
                  </td>
                  <td class="py-4 text-gray-400">{{ item.unit }}</td>
                  <td class="py-4 text-gray-400">{{ item.threshold }}</td>
                  <td class="py-4">
                    <span [class]="'px-2 py-1 rounded-md text-[10px] font-bold uppercase ' + (item.stock <= item.threshold ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500')">
                      {{ item.stock <= item.threshold ? 'Alerte' : 'En Stock' }}
                    </span>
                  </td>
                  <td class="py-4 text-right">
                    <button class="p-2 text-gray-500 hover:text-jacquier-gold transition-colors">
                      <i class="material-icons text-lg">edit</i>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.6s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class StockComponent {
  inventory = signal([
    { id: 1, name: 'Gambas Tigrées', category: 'Fruits de Mer', stock: 2.5, unit: 'kg', threshold: 5 },
    { id: 2, name: 'Filet de Bœuf', category: 'Viandes', stock: 15, unit: 'kg', threshold: 10 },
    { id: 3, name: 'Riz Basmati', category: 'Épicerie', stock: 50, unit: 'kg', threshold: 20 },
    { id: 4, name: 'Huile d\'Olive', category: 'Épicerie', stock: 12, unit: 'L', threshold: 5 },
    { id: 5, name: 'Poulet Fermier', category: 'Viandes', stock: 8, unit: 'pce', threshold: 15 },
  ]);
}
