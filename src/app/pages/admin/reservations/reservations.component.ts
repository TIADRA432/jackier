import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-admin-reservations",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">Réservations</h1>
          <p class="text-gray-400 text-sm mt-1">Gérez les tables et les flux clients</p>
        </div>
        <button class="px-4 py-2 bg-jacquier-gold text-jacquier-dark rounded-xl text-sm font-bold hover:bg-white transition-colors shadow-lg shadow-jacquier-gold/20">
          Nouvelle Réservation
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-3 bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
          <div class="p-6 border-b border-gray-800 flex justify-between items-center">
            <h3 class="text-lg font-serif font-bold text-white">Planning du jour</h3>
            <div class="flex gap-2">
              <button class="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white"><i class="material-icons">chevron_left</i></button>
              <span class="px-4 py-2 text-sm font-bold text-white">Aujourd'hui</span>
              <button class="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white"><i class="material-icons">chevron_right</i></button>
            </div>
          </div>
          
          <div class="p-6 overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800">
                  <th class="pb-4">Client</th>
                  <th class="pb-4">Heure</th>
                  <th class="pb-4">Couverts</th>
                  <th class="pb-4">Table</th>
                  <th class="pb-4">Statut</th>
                  <th class="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                @for (res of reservations(); track res.id) {
                  <tr class="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors group">
                    <td class="py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-jacquier-gold/10 flex items-center justify-center text-jacquier-gold font-bold text-xs">
                          {{ res.client.charAt(0) }}
                        </div>
                        <span class="text-white font-medium">{{ res.client }}</span>
                      </div>
                    </td>
                    <td class="py-4 text-gray-300">{{ res.time }}</td>
                    <td class="py-4 text-gray-300">{{ res.guests }} pers.</td>
                    <td class="py-4 text-gray-300">T-{{ res.table }}</td>
                    <td class="py-4">
                      <span [class]="'px-2 py-1 rounded-md text-[10px] font-bold uppercase ' + res.statusClass">
                        {{ res.status }}
                      </span>
                    </td>
                    <td class="py-4 text-right">
                      <button class="p-2 text-gray-500 hover:text-jacquier-gold transition-colors">
                        <i class="material-icons text-lg">more_vert</i>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
            <h3 class="text-lg font-serif font-bold text-white mb-4">Statut des Tables</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-gray-800/50 rounded-xl text-center">
                <p class="text-2xl font-serif font-bold text-white">12</p>
                <p class="text-[10px] text-gray-500 uppercase font-bold">Libres</p>
              </div>
              <div class="p-4 bg-jacquier-gold/10 rounded-xl text-center">
                <p class="text-2xl font-serif font-bold text-jacquier-gold">8</p>
                <p class="text-[10px] text-jacquier-gold uppercase font-bold">Occupées</p>
              </div>
            </div>
          </div>

          <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
            <h3 class="text-lg font-serif font-bold text-white mb-4">Notes de Service</h3>
            <div class="space-y-4">
              <div class="p-3 bg-orange-500/10 border-l-4 border-orange-500 rounded-r-lg">
                <p class="text-xs font-bold text-orange-500 uppercase mb-1">VIP Attendu</p>
                <p class="text-xs text-gray-300">M. le Ministre à 20h30. Table 1 (Terrasse).</p>
              </div>
              <div class="p-3 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-lg">
                <p class="text-xs font-bold text-blue-500 uppercase mb-1">Anniversaire</p>
                <p class="text-xs text-gray-300">Table 12. Prévoir bougies sur dessert.</p>
              </div>
            </div>
          </div>
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
export class ReservationsComponent {
  reservations = signal([
    { id: 1, client: 'Amadou Diallo', time: '19:30', guests: 4, table: '04', status: 'Confirmé', statusClass: 'bg-green-500/10 text-green-500' },
    { id: 2, client: 'Sarah Konaté', time: '20:00', guests: 2, table: '12', status: 'Arrivé', statusClass: 'bg-blue-500/10 text-blue-500' },
    { id: 3, client: 'Moussa Camara', time: '20:15', guests: 6, table: '01', status: 'En attente', statusClass: 'bg-orange-500/10 text-orange-500' },
    { id: 4, client: 'Fatoumata Sylla', time: '21:00', guests: 3, table: '08', status: 'Confirmé', statusClass: 'bg-green-500/10 text-green-500' },
  ]);
}
