import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-admin-school",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">École Gastronomique</h1>
          <p class="text-gray-400 text-sm mt-1">Gestion des programmes et des étudiants</p>
        </div>
        <button class="px-4 py-2 bg-jacquier-gold text-jacquier-dark rounded-xl text-sm font-bold hover:bg-white transition-colors shadow-lg shadow-jacquier-gold/20">
          Nouvelle Inscription
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Étudiants Actifs</p>
          <h3 class="text-2xl font-serif font-bold text-white">42</h3>
          <p class="text-xs text-green-500 mt-2">+5 cette session</p>
        </div>
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Programmes en cours</p>
          <h3 class="text-2xl font-serif font-bold text-white">4</h3>
          <p class="text-xs text-gray-500 mt-2">Pro, Amateur, Pâtisserie, Local</p>
        </div>
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Revenus Scolarité</p>
          <h3 class="text-2xl font-serif font-bold text-white">85M FG</h3>
          <p class="text-xs text-jacquier-gold mt-2">Session Juin-Août</p>
        </div>
      </div>

      <div class="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
        <div class="p-6 border-b border-gray-800">
          <h3 class="text-lg font-serif font-bold text-white">Liste des Étudiants</h3>
        </div>
        <div class="p-6 overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800">
                <th class="pb-4">Étudiant</th>
                <th class="pb-4">Programme</th>
                <th class="pb-4">Date Début</th>
                <th class="pb-4">Paiement</th>
                <th class="pb-4">Progrès</th>
                <th class="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              @for (student of students(); track student.id) {
                <tr class="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors group">
                  <td class="py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gray-800 overflow-hidden">
                        <img [src]="student.image" class="w-full h-full object-cover">
                      </div>
                      <span class="text-white font-medium">{{ student.name }}</span>
                    </div>
                  </td>
                  <td class="py-4 text-gray-400">{{ student.program }}</td>
                  <td class="py-4 text-gray-400">{{ student.startDate }}</td>
                  <td class="py-4">
                    <span [class]="'px-2 py-1 rounded-md text-[10px] font-bold uppercase ' + student.paymentClass">
                      {{ student.payment }}
                    </span>
                  </td>
                  <td class="py-4">
                    <div class="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div class="h-full bg-jacquier-gold" [style.width]="student.progress + '%'"></div>
                    </div>
                  </td>
                  <td class="py-4 text-right">
                    <button class="p-2 text-gray-500 hover:text-jacquier-gold transition-colors">
                      <i class="material-icons text-lg">visibility</i>
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
export class AdminSchoolComponent {
  students = signal([
    { id: 1, name: 'Mamadou Sylla', program: 'Gastronomie Pro', startDate: '01/06/2024', payment: 'Payé', paymentClass: 'bg-green-500/10 text-green-500', progress: 25, image: 'https://picsum.photos/seed/student1/100/100' },
    { id: 2, name: 'Aissatou Barry', program: 'Pâtisserie Fine', startDate: '01/06/2024', payment: 'Partiel', paymentClass: 'bg-orange-500/10 text-orange-500', progress: 40, image: 'https://picsum.photos/seed/student2/100/100' },
    { id: 3, name: 'Ibrahim Camara', program: 'Cuisine Locale', startDate: '15/06/2024', payment: 'En retard', paymentClass: 'bg-red-500/10 text-red-500', progress: 10, image: 'https://picsum.photos/seed/student3/100/100' },
  ]);
}
