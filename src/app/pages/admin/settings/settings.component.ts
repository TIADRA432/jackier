import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-admin-settings",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">Paramètres</h1>
          <p class="text-gray-400 text-sm mt-1">Configuration du système et sécurité</p>
        </div>
        <button class="px-6 py-2 bg-jacquier-gold text-jacquier-dark rounded-xl text-sm font-bold hover:bg-white transition-colors shadow-lg shadow-jacquier-gold/20">
          Sauvegarder les modifications
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div class="lg:col-span-1 space-y-2">
          <button class="w-full text-left px-4 py-3 rounded-xl bg-jacquier-gold/10 text-jacquier-gold font-bold text-sm border-l-4 border-jacquier-gold">
            Général
          </button>
          <button class="w-full text-left px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm">
            Sécurité & Accès
          </button>
          <button class="w-full text-left px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm">
            Notifications
          </button>
          <button class="w-full text-left px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm">
            Facturation & TVA
          </button>
          <button class="w-full text-left px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm">
            API & Intégrations
          </button>
        </div>

        <div class="lg:col-span-3 space-y-8">
          <div class="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 space-y-6">
            <h3 class="text-lg font-serif font-bold text-white border-b border-gray-800 pb-4">Informations de l'Établissement</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nom de l'enseigne</label>
                <input type="text" value="Le Jacquier" class="w-full bg-gray-800 border-none text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-jacquier-gold">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Slogan</label>
                <input type="text" value="L'excellence culinaire à Conakry" class="w-full bg-gray-800 border-none text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-jacquier-gold">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email de contact</label>
                <input type="email" value="contact@lejacquier.com" class="w-full bg-gray-800 border-none text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-jacquier-gold">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Téléphone</label>
                <input type="text" value="+224 622 00 00 00" class="w-full bg-gray-800 border-none text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-jacquier-gold">
              </div>
            </div>
          </div>

          <div class="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 space-y-6">
            <h3 class="text-lg font-serif font-bold text-white border-b border-gray-800 pb-4">Configuration Opérationnelle</h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                <div>
                  <p class="text-sm font-bold text-white">Réservations Automatiques</p>
                  <p class="text-xs text-gray-500">Confirmer les réservations sans validation manuelle</p>
                </div>
                <div class="w-12 h-6 bg-jacquier-gold rounded-full relative cursor-pointer">
                  <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                <div>
                  <p class="text-sm font-bold text-white">Alertes Stock IA</p>
                  <p class="text-xs text-gray-500">Utiliser l'IA pour prédire les ruptures de stock</p>
                </div>
                <div class="w-12 h-6 bg-jacquier-gold rounded-full relative cursor-pointer">
                  <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                <div>
                  <p class="text-sm font-bold text-white">Mode Maintenance Site Web</p>
                  <p class="text-xs text-gray-500">Afficher une page d'attente sur le site public</p>
                </div>
                <div class="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                  <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-red-500/5 p-8 rounded-2xl border border-red-500/20 space-y-4">
            <h3 class="text-lg font-serif font-bold text-red-500">Zone de Danger</h3>
            <p class="text-xs text-gray-500">Ces actions sont irréversibles. Soyez prudent.</p>
            <div class="flex gap-4">
              <button class="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest">
                Réinitialiser les données
              </button>
              <button class="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest">
                Désactiver le compte Admin
              </button>
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
export class AdminSettingsComponent {}
