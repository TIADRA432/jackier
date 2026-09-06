import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-admin-traiteur",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">Service Traiteur</h1>
          <p class="text-gray-400 text-sm mt-1">Gestion des événements et devis</p>
        </div>
        <button class="px-4 py-2 bg-jacquier-gold text-jacquier-dark rounded-xl text-sm font-bold hover:bg-white transition-colors shadow-lg shadow-jacquier-gold/20">
          Nouveau Devis
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Devis en attente</p>
          <h3 class="text-2xl font-serif font-bold text-white">8</h3>
          <p class="text-xs text-jacquier-gold mt-2">Valeur estimée: 150M FG</p>
        </div>
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Événements ce mois</p>
          <h3 class="text-2xl font-serif font-bold text-white">12</h3>
          <p class="text-xs text-green-500 mt-2">+3 vs mois dernier</p>
        </div>
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Taux de conversion</p>
          <h3 class="text-2xl font-serif font-bold text-white">42%</h3>
          <p class="text-xs text-gray-500 mt-2">Objectif: 50%</p>
        </div>
      </div>

      <div class="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
        <div class="p-6 border-b border-gray-800">
          <h3 class="text-lg font-serif font-bold text-white">Événements à venir</h3>
        </div>
        <div class="p-6 space-y-4">
          @for (event of events(); track event.id) {
            <div class="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-800 hover:border-jacquier-gold/30 transition-all group">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-gray-800 flex flex-col items-center justify-center text-jacquier-gold">
                  <span class="text-[10px] font-bold uppercase">{{ event.month }}</span>
                  <span class="text-xl font-serif font-bold">{{ event.day }}</span>
                </div>
                <div>
                  <h4 class="text-white font-bold text-sm">{{ event.title }}</h4>
                  <p class="text-xs text-gray-500">{{ event.location }} • {{ event.guests }} pers.</p>
                </div>
              </div>
              <div class="text-right">
                <span [class]="'px-2 py-1 rounded text-[10px] font-bold uppercase ' + event.statusClass">
                  {{ event.status }}
                </span>
                <p class="text-xs text-white font-bold mt-2">{{ event.price }} FG</p>
              </div>
            </div>
          }
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
export class AdminTraiteurComponent {
  events = signal([
    { id: 1, title: 'Mariage Diallo & Sylla', location: 'Hôtel Noom', guests: 250, day: '15', month: 'JUIN', status: 'Confirmé', statusClass: 'bg-green-500/10 text-green-500', price: '45 000 000' },
    { id: 2, title: 'Cocktail Entreprise Orange', location: 'Siège Social', guests: 100, day: '22', month: 'JUIN', status: 'En attente', statusClass: 'bg-orange-500/10 text-orange-500', price: '12 500 000' },
    { id: 3, title: 'Anniversaire Privé', location: 'Villa Camayenne', guests: 50, day: '05', month: 'JUIL', status: 'Confirmé', statusClass: 'bg-green-500/10 text-green-500', price: '8 000 000' },
  ]);
}
