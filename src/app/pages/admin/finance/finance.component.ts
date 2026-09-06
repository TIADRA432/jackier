import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-admin-finance",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">Finance & BI</h1>
          <p class="text-gray-400 text-sm mt-1">Suivi des revenus, dépenses et rentabilité</p>
        </div>
        <div class="flex gap-3">
          <button class="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium border border-gray-700 hover:bg-gray-700 transition-colors">
            Journal de Caisse
          </button>
          <button class="px-4 py-2 bg-jacquier-gold text-jacquier-dark rounded-xl text-sm font-bold hover:bg-white transition-colors shadow-lg shadow-jacquier-gold/20">
            Clôture Journalière
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Revenu Brut (Mois)</p>
          <h3 class="text-2xl font-serif font-bold text-white">342.5M FG</h3>
          <p class="text-xs text-green-500 mt-2">+15.2% vs M-1</p>
        </div>
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Dépenses (Mois)</p>
          <h3 class="text-2xl font-serif font-bold text-white">215.8M FG</h3>
          <p class="text-xs text-red-500 mt-2">+8.4% vs M-1</p>
        </div>
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Marge Nette</p>
          <h3 class="text-2xl font-serif font-bold text-jacquier-gold">37%</h3>
          <p class="text-xs text-green-500 mt-2">+2.1% (Optimisé)</p>
        </div>
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Trésorerie</p>
          <h3 class="text-2xl font-serif font-bold text-white">128.4M FG</h3>
          <p class="text-xs text-gray-500 mt-2">Disponible</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800">
          <h3 class="text-lg font-serif font-bold text-white mb-6">Flux de Trésorerie</h3>
          <div class="h-64 flex items-end gap-4">
            @for (bar of cashflow(); track bar.month) {
              <div class="flex-1 flex flex-col items-center gap-2 group">
                <div class="w-full flex flex-col justify-end gap-1 h-full">
                  <div class="w-full bg-green-500/40 rounded-t-sm" [style.height]="bar.in + '%'"></div>
                  <div class="w-full bg-red-500/40 rounded-b-sm" [style.height]="bar.out + '%'"></div>
                </div>
                <span class="text-[10px] text-gray-500 font-bold uppercase">{{ bar.month }}</span>
              </div>
            }
          </div>
          <div class="flex justify-center gap-6 mt-6">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-green-500/40 rounded-full"></div>
              <span class="text-xs text-gray-400">Entrées</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-red-500/40 rounded-full"></div>
              <span class="text-xs text-gray-400">Sorties</span>
            </div>
          </div>
        </div>

        <div class="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800">
          <h3 class="text-lg font-serif font-bold text-white mb-6">Dernières Transactions</h3>
          <div class="space-y-4">
            @for (tx of transactions(); track tx.id) {
              <div class="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-800">
                <div class="flex items-center gap-4">
                  <div [class]="'w-10 h-10 rounded-full flex items-center justify-center ' + (tx.type === 'IN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500')">
                    <i class="material-icons">{{ tx.type === 'IN' ? 'add' : 'remove' }}</i>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-white">{{ tx.label }}</p>
                    <p class="text-xs text-gray-500">{{ tx.date }} • {{ tx.category }}</p>
                  </div>
                </div>
                <p [class]="'text-sm font-bold ' + (tx.type === 'IN' ? 'text-green-500' : 'text-red-500')">
                  {{ tx.type === 'IN' ? '+' : '-' }} {{ tx.amount }} FG
                </p>
              </div>
            }
          </div>
          <button class="w-full mt-6 py-3 text-xs font-bold text-jacquier-gold border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors uppercase tracking-widest">
            Voir tout l'historique
          </button>
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
export class AdminFinanceComponent {
  cashflow = signal([
    { month: 'Jan', in: 60, out: 40 },
    { month: 'Fév', in: 65, out: 45 },
    { month: 'Mar', in: 70, out: 50 },
    { month: 'Avr', in: 80, out: 55 },
    { month: 'Mai', in: 90, out: 60 },
    { month: 'Juin', in: 100, out: 65 },
  ]);

  transactions = signal([
    { id: 1, label: 'Ventes Restaurant (Service Midi)', amount: '4 250 000', type: 'IN', date: 'Aujourd\'hui', category: 'Ventes' },
    { id: 2, label: 'Fournisseur Poisson (Gambas)', amount: '1 800 000', type: 'OUT', date: 'Aujourd\'hui', category: 'Achats' },
    { id: 3, label: 'Paiement École (Session Pro)', amount: '12 000 000', type: 'IN', date: 'Hier', category: 'Scolarité' },
    { id: 4, label: 'Facture Électricité (EDG)', amount: '2 500 000', type: 'OUT', date: 'Hier', category: 'Charges' },
  ]);
}
