import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-admin-analytics",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">Analyses Avancées</h1>
          <p class="text-gray-400 text-sm mt-1">Intelligence d'affaires et prévisions</p>
        </div>
        <div class="flex gap-3">
          <label class="sr-only" for="analytics-period">Période d'analyse</label>
          <select id="analytics-period" class="bg-[#1a1a1a] border border-gray-800 text-white text-xs rounded-xl px-4 py-2 outline-none focus:border-jacquier-gold">
            <option>Derniers 30 jours</option>
            <option>Trimestre en cours</option>
            <option>Année 2024</option>
          </select>
          <button class="px-4 py-2 bg-jacquier-gold text-jacquier-dark rounded-xl text-sm font-bold hover:bg-white transition-colors shadow-lg shadow-jacquier-gold/20">
            Générer Rapport PDF
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800">
          <h3 class="text-lg font-serif font-bold text-white mb-6">Répartition du CA par Segment</h3>
          <div class="flex items-center justify-center h-64 relative">
            <!-- Mock Donut Chart -->
            <div class="w-48 h-48 rounded-full border-[20px] border-gray-800 relative" role="img" aria-label="Graphique en anneau: répartition du chiffre d'affaires par segment">
              <div class="absolute inset-0 rounded-full border-[20px] border-jacquier-gold border-t-transparent border-r-transparent rotate-45" aria-hidden="true"></div>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <p class="text-2xl font-serif font-bold text-white">124M</p>
                <p class="text-[10px] text-gray-500 uppercase font-bold">Total FG</p>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4 mt-8">
            <div class="text-center">
              <div class="w-3 h-3 bg-jacquier-gold rounded-full mx-auto mb-2" aria-hidden="true"></div>
              <p class="text-xs text-gray-400">Restaurant</p>
              <p class="text-sm font-bold text-white">65%</p>
            </div>
            <div class="text-center">
              <div class="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2" aria-hidden="true"></div>
              <p class="text-xs text-gray-400">Traiteur</p>
              <p class="text-sm font-bold text-white">22%</p>
            </div>
            <div class="text-center">
              <div class="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-2" aria-hidden="true"></div>
              <p class="text-xs text-gray-400">École</p>
              <p class="text-sm font-bold text-white">13%</p>
            </div>
          </div>
        </div>

        <div class="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800">
          <h3 class="text-lg font-serif font-bold text-white mb-6">Prévisions de Fréquentation</h3>
          <div class="space-y-6">
            @for (day of forecasts(); track day.label) {
              <div class="group">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-white font-medium">{{ day.label }}</span>
                  <span class="text-xs text-jacquier-gold font-bold">{{ day.percentage }}% attendu</span>
                </div>
                <div class="h-2 bg-gray-800 rounded-full overflow-hidden" role="progressbar" [attr.aria-valuenow]="day.percentage" aria-valuemin="0" aria-valuemax="100" [attr.aria-label]="day.label">
                  <div class="h-full bg-jacquier-gold transition-all duration-1000" [style.width]="day.percentage + '%'"></div>
                </div>
                <p class="text-[10px] text-gray-500 mt-2 uppercase font-bold tracking-widest">{{ day.insight }}</p>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800">
        <h3 class="text-lg font-serif font-bold text-white mb-8">Performance des Serveurs</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          @for (staff of staffPerformance(); track staff.name) {
            <div class="text-center group">
              <div class="w-20 h-20 rounded-full bg-gray-800 mx-auto mb-4 overflow-hidden border-2 border-transparent group-hover:border-jacquier-gold transition-all">
                <img [src]="staff.image" [alt]="'Photo de ' + staff.name" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all">
              </div>
              <p class="text-sm font-bold text-white">{{ staff.name }}</p>
              <p class="text-xs text-gray-500 mb-2">{{ staff.role }}</p>
              <div class="flex justify-center items-center gap-1 text-jacquier-gold">
                <i class="material-icons text-sm" aria-hidden="true">star</i>
                <span class="text-xs font-bold">{{ staff.rating }}</span>
              </div>
              <p class="text-[10px] text-gray-600 mt-2 uppercase font-bold">CA Généré: {{ staff.sales }}M</p>
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
export class AnalyticsComponent {
  forecasts = signal([
    { label: 'Vendredi Soir', percentage: 85, insight: 'Forte demande - Prévoir renfort' },
    { label: 'Samedi Midi', percentage: 45, insight: 'Normal' },
    { label: 'Samedi Soir', percentage: 100, insight: 'Complet - Liste d\'attente active' },
    { label: 'Dimanche Midi', percentage: 70, insight: 'Brunch familial - Stocker viennoiseries' },
  ]);

  staffPerformance = signal([
    { name: 'Ousmane B.', role: 'Serveur Principal', rating: 4.9, sales: 12.5, image: 'https://picsum.photos/seed/staff1/100/100' },
    { name: 'Aissatou D.', role: 'Serveuse', rating: 4.8, sales: 10.2, image: 'https://picsum.photos/seed/staff2/100/100' },
    { name: 'Mamadou S.', role: 'Serveur', rating: 4.7, sales: 9.8, image: 'https://picsum.photos/seed/staff3/100/100' },
    { name: 'Binta K.', role: 'Apprentie', rating: 4.6, sales: 5.4, image: 'https://picsum.photos/seed/staff4/100/100' },
  ]);
}
