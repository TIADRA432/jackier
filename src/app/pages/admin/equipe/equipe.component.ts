import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-admin-equipe",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">Équipe & RH</h1>
          <p class="text-gray-400 text-sm mt-1">Gestion du personnel et des plannings</p>
        </div>
        <button class="px-4 py-2 bg-jacquier-gold text-jacquier-dark rounded-xl text-sm font-bold hover:bg-white transition-colors shadow-lg shadow-jacquier-gold/20">
          Ajouter un Membre
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Effectif Total</p>
          <h3 class="text-2xl font-serif font-bold text-white">24 Employés</h3>
          <p class="text-xs text-gray-500 mt-2">18 CDI • 6 Extras</p>
        </div>
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Présents Aujourd'hui</p>
          <h3 class="text-2xl font-serif font-bold text-green-500">16 Membres</h3>
          <p class="text-xs text-gray-500 mt-2">Service Midi & Soir</p>
        </div>
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Masse Salariale</p>
          <h3 class="text-2xl font-serif font-bold text-white">48.5M FG</h3>
          <p class="text-xs text-gray-500 mt-2">Estimation mensuelle</p>
        </div>
      </div>

      <div class="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
        <div class="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 class="text-lg font-serif font-bold text-white">Annuaire du Personnel</h3>
          <div class="flex gap-2">
            <button class="px-3 py-1 bg-gray-800 rounded-lg text-xs font-bold text-white">Tous</button>
            <button class="px-3 py-1 text-xs font-bold text-gray-500 hover:text-white">Cuisine</button>
            <button class="px-3 py-1 text-xs font-bold text-gray-500 hover:text-white">Salle</button>
            <button class="px-3 py-1 text-xs font-bold text-gray-500 hover:text-white">Admin</button>
          </div>
        </div>
        
        <div class="p-6 overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800">
                <th class="pb-4">Employé</th>
                <th class="pb-4">Poste</th>
                <th class="pb-4">Département</th>
                <th class="pb-4">Statut</th>
                <th class="pb-4">Performance</th>
                <th class="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              @for (member of team(); track member.id) {
                <tr class="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors group">
                  <td class="py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                        <img [src]="member.image" class="w-full h-full object-cover">
                      </div>
                      <div>
                        <p class="text-white font-medium">{{ member.name }}</p>
                        <p class="text-[10px] text-gray-500">{{ member.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 text-gray-300">{{ member.role }}</td>
                  <td class="py-4 text-gray-400">{{ member.dept }}</td>
                  <td class="py-4">
                    <span [class]="'px-2 py-1 rounded-md text-[10px] font-bold uppercase ' + member.statusClass">
                      {{ member.status }}
                    </span>
                  </td>
                  <td class="py-4">
                    <div class="flex items-center gap-1 text-jacquier-gold">
                      <i class="material-icons text-sm">star</i>
                      <span class="font-bold">{{ member.rating }}</span>
                    </div>
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
export class AdminEquipeComponent {
  team = signal([
    { id: 1, name: 'Amadou Diallo', email: 'amadou@lejacquier.com', role: 'Directeur Général', dept: 'Direction', status: 'Présent', statusClass: 'bg-green-500/10 text-green-500', rating: 5.0, image: 'https://picsum.photos/seed/staff1/100/100' },
    { id: 2, name: 'Chef Ousmane', email: 'chef@lejacquier.com', role: 'Chef Exécutif', dept: 'Cuisine', status: 'Présent', statusClass: 'bg-green-500/10 text-green-500', rating: 4.9, image: 'https://picsum.photos/seed/staff2/100/100' },
    { id: 3, name: 'Aissatou Barry', email: 'aissatou@lejacquier.com', role: 'Maître d\'Hôtel', dept: 'Salle', status: 'Repos', statusClass: 'bg-gray-500/10 text-gray-500', rating: 4.8, image: 'https://picsum.photos/seed/staff3/100/100' },
    { id: 4, name: 'Moussa Camara', email: 'moussa@lejacquier.com', role: 'Responsable Stock', dept: 'Logistique', status: 'Présent', statusClass: 'bg-green-500/10 text-green-500', rating: 4.7, image: 'https://picsum.photos/seed/staff4/100/100' },
  ]);
}
