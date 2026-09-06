import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 animate-fade-in pb-12">
      <!-- Header with Performance Score -->
      <div
        class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
      >
        <div>
          <h1 class="text-3xl font-serif font-bold text-white">
            Centre de Commande
          </h1>
          <p class="text-gray-400 mt-2 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Système opérationnel • Dernière mise à jour: {{ lastUpdate }}
          </p>
        </div>

        <div
          class="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 flex items-center gap-6 shadow-xl"
        >
          <div class="text-right">
            <p
              class="text-[10px] font-bold text-gray-500 uppercase tracking-widest"
            >
              Score Performance
            </p>
            <p class="text-2xl font-serif font-bold text-jacquier-gold">
              94/100
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-full border-4 border-jacquier-gold/20 border-t-jacquier-gold flex items-center justify-center text-xs font-bold text-jacquier-gold"
          >
            +4%
          </div>
        </div>
      </div>

      <!-- Level 1: Monitoring (KPIs with Visual Indicators) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (stat of stats(); track stat.label) {
        <div
          class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 hover:border-jacquier-gold/30 transition-all group relative overflow-hidden"
        >
          <div
            class="absolute top-0 right-0 w-24 h-24 bg-jacquier-gold/5 rounded-full -mr-8 -mt-8 group-hover:bg-jacquier-gold/10 transition-colors"
          ></div>

          <div class="flex justify-between items-start mb-4 relative z-10">
            <div
              class="p-3 rounded-xl bg-gray-800 text-jacquier-gold group-hover:scale-110 transition-transform"
            >
              <i class="material-icons text-xl">{{ stat.icon }}</i>
            </div>
            <div
              [class]="
                'px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ' +
                stat.statusClass
              "
            >
              {{ stat.status }}
            </div>
          </div>

          <div class="relative z-10">
            <p
              class="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1"
            >
              {{ stat.label }}
            </p>
            <h3 class="text-2xl font-serif font-bold text-white">
              {{ stat.value }}
            </h3>
            <p
              class="text-xs mt-2 flex items-center"
              [class]="stat.trendUp ? 'text-green-500' : 'text-red-500'"
            >
              <i class="material-icons text-sm mr-1">{{
                stat.trendUp ? "trending_up" : "trending_down"
              }}</i>
              {{ stat.trend }} vs hier
            </p>
          </div>
        </div>
        }
      </div>

      <!-- Level 2: Opérations & Intelligence -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Revenue Analysis (BI) -->
        <div
          class="lg:col-span-2 bg-[#1a1a1a] rounded-2xl border border-gray-800 p-8"
        >
          <div class="flex justify-between items-center mb-8">
            <div>
              <h3 class="text-xl font-serif font-bold text-white">
                Analyse des Revenus
              </h3>
              <p class="text-gray-500 text-xs mt-1 uppercase tracking-widest">
                Performance par segment • 30 derniers jours
              </p>
            </div>
            <select
              class="bg-[#121212] border border-gray-800 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-jacquier-gold"
            >
              <option>Mensuel</option>
              <option>Hebdomadaire</option>
            </select>
          </div>

          <div class="h-64 flex items-end gap-4 px-4">
            @for (bar of revenueData(); track bar.label) {
            <div class="flex-1 flex flex-col items-center gap-3 group">
              <div
                class="w-full bg-gray-800 rounded-t-lg relative overflow-hidden"
                [style.height]="bar.height + '%'"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-t from-jacquier-gold/40 to-jacquier-gold/10 opacity-0 group-hover:opacity-100 transition-opacity"
                ></div>
                <div
                  class="absolute bottom-0 left-0 right-0 h-1 bg-jacquier-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                ></div>
              </div>
              <span
                class="text-[10px] text-gray-500 font-bold uppercase tracking-tighter"
                >{{ bar.label }}</span
              >
            </div>
            }
          </div>

          <div
            class="mt-8 pt-8 border-t border-gray-800 grid grid-cols-3 gap-4"
          >
            <div class="text-center">
              <p class="text-[10px] text-gray-500 uppercase font-bold mb-1">
                Restaurant
              </p>
              <p class="text-lg font-serif font-bold text-white">65%</p>
            </div>
            <div class="text-center border-x border-gray-800">
              <p class="text-[10px] text-gray-500 uppercase font-bold mb-1">
                Traiteur
              </p>
              <p class="text-lg font-serif font-bold text-white">22%</p>
            </div>
            <div class="text-center">
              <p class="text-[10px] text-gray-500 uppercase font-bold mb-1">
                École
              </p>
              <p class="text-lg font-serif font-bold text-white">13%</p>
            </div>
          </div>
        </div>

        <!-- Alerts & Notifications (Operations) -->
        <div
          class="bg-[#1a1a1a] rounded-2xl border border-gray-800 flex flex-col"
        >
          <div
            class="p-6 border-b border-gray-800 flex justify-between items-center"
          >
            <h3 class="text-lg font-serif font-bold text-white">
              Alertes Critiques
            </h3>
            <span
              class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
              >3</span
            >
          </div>
          <div class="flex-1 p-6 space-y-6">
            @for (alert of alerts(); track alert.id) {
            <div class="flex gap-4 group cursor-pointer">
              <div
                [class]="
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ' +
                  alert.bgClass
                "
              >
                <i class="material-icons text-xl">{{ alert.icon }}</i>
              </div>
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm font-bold text-white group-hover:text-jacquier-gold transition-colors"
                >
                  {{ alert.title }}
                </p>
                <p class="text-xs text-gray-500 mt-1 line-clamp-1">
                  {{ alert.desc }}
                </p>
                <p class="text-[10px] text-gray-600 mt-1 uppercase font-bold">
                  {{ alert.time }}
                </p>
              </div>
            </div>
            }
          </div>
          <button
            class="p-4 text-xs font-bold text-jacquier-gold hover:bg-jacquier-gold/5 transition-colors border-t border-gray-800 uppercase tracking-widest"
          >
            Voir tout le journal
          </button>
        </div>
      </div>

      <!-- Level 3: Strategic Analysis (BI Insights) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Top Performing Items -->
        <div class="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-8">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-xl font-serif font-bold text-white">
              Plats les plus rentables
            </h3>
            <button
              class="text-jacquier-gold text-xs font-bold uppercase tracking-widest hover:underline"
            >
              Rapport complet
            </button>
          </div>
          <div class="space-y-6">
            @for (item of topItems(); track item.name) {
            <div class="flex items-center justify-between group">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-gray-800 overflow-hidden">
                  <img
                    [src]="item.image"
                    class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div>
                  <p class="text-sm font-bold text-white">{{ item.name }}</p>
                  <p class="text-xs text-gray-500">{{ item.category }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-white">
                  {{ item.margin }}% marge
                </p>
                <div
                  class="w-24 h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden"
                >
                  <div
                    class="h-full bg-jacquier-gold"
                    [style.width]="item.margin + '%'"
                  ></div>
                </div>
              </div>
            </div>
            }
          </div>
        </div>

        <!-- AI Insights & Forecasts -->
        <div
          class="bg-jacquier-gold/5 rounded-2xl border border-jacquier-gold/20 p-8 relative overflow-hidden"
        >
          <div class="absolute top-0 right-0 p-4 opacity-10">
            <i class="material-icons text-8xl text-jacquier-gold">psychology</i>
          </div>

          <h3
            class="text-xl font-serif font-bold text-jacquier-gold mb-6 flex items-center gap-2"
          >
            <i class="material-icons">auto_awesome</i>
            Insights Stratégiques (IA)
          </h3>

          <div class="space-y-6 relative z-10">
            <div
              class="bg-black/20 p-4 rounded-xl border border-jacquier-gold/10"
            >
              <p
                class="text-xs font-bold text-jacquier-gold uppercase tracking-widest mb-2"
              >
                Prévision Fréquentation
              </p>
              <p class="text-sm text-gray-300 leading-relaxed">
                Hausse prévue de
                <span class="text-white font-bold">+15%</span> ce weekend.
                Suggestion: Augmenter le stock de
                <span class="text-white font-bold">Gambas</span> et prévoir un
                renfort en salle.
              </p>
            </div>

            <div
              class="bg-black/20 p-4 rounded-xl border border-jacquier-gold/10"
            >
              <p
                class="text-xs font-bold text-jacquier-gold uppercase tracking-widest mb-2"
              >
                Optimisation Menu
              </p>
              <p class="text-sm text-gray-300 leading-relaxed">
                Le plat
                <span class="text-white font-bold">"Soupe du Pêcheur"</span>
                présente une marge faible (12%). Suggestion: Ajuster le prix de
                +10% ou renégocier avec le fournisseur de poisson.
              </p>
            </div>

            <div
              class="bg-black/20 p-4 rounded-xl border border-jacquier-gold/10"
            >
              <p
                class="text-xs font-bold text-jacquier-gold uppercase tracking-widest mb-2"
              >
                Opportunité Traiteur
              </p>
              <p class="text-sm text-gray-300 leading-relaxed">
                Forte demande pour les
                <span class="text-white font-bold">Mariages</span> en Juin. 4
                devis en attente. Relance recommandée pour maximiser le taux de
                conversion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .animate-fade-in {
        animation: fadeIn 0.6s ease-out forwards;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class DashboardComponent {
  lastUpdate = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  stats = signal([
    {
      label: "CA Aujourd'hui",
      value: "4 250 000 FG",
      icon: "payments",
      trend: "+12%",
      trendUp: true,
      status: "Optimal",
      statusClass: "bg-green-500/10 text-green-500",
    },
    {
      label: "Réservations",
      value: "18",
      icon: "event",
      trend: "+5",
      trendUp: true,
      status: "Chargé",
      statusClass: "bg-orange-500/10 text-orange-500",
    },
    {
      label: "Stock Critique",
      value: "3 Articles",
      icon: "inventory_2",
      trend: "-2",
      trendUp: false,
      status: "Alerte",
      statusClass: "bg-red-500/10 text-red-500",
    },
    {
      label: "Étudiants École",
      value: "42",
      icon: "school",
      trend: "+3",
      trendUp: true,
      status: "Stable",
      statusClass: "bg-blue-500/10 text-blue-500",
    },
  ]);

  revenueData = signal([
    { label: "Lun", height: 45 },
    { label: "Mar", height: 55 },
    { label: "Mer", height: 40 },
    { label: "Jeu", height: 75 },
    { label: "Ven", height: 90 },
    { label: "Sam", height: 100 },
    { label: "Dim", height: 85 },
  ]);

  alerts = signal([
    {
      id: 1,
      title: "Rupture imminente: Gambas",
      desc: "Stock restant: 2kg. Seuil critique atteint.",
      icon: "warning",
      bgClass: "bg-red-500/10 text-red-500",
      time: "Il y a 10 min",
    },
    {
      id: 2,
      title: "Nouvelle Réservation Groupe",
      desc: "Table de 12 personnes pour Samedi 20h.",
      icon: "group",
      bgClass: "bg-jacquier-gold/10 text-jacquier-gold",
      time: "Il y a 25 min",
    },
    {
      id: 3,
      title: "Paiement École en retard",
      desc: "Étudiant: Mamadou Sylla (Programme Pro).",
      icon: "error_outline",
      bgClass: "bg-orange-500/10 text-orange-500",
      time: "Il y a 1 heure",
    },
  ]);

  topItems = signal([
    {
      name: "Poulet Yassa Signature",
      category: "Plat Local",
      margin: 68,
      image: "https://picsum.photos/seed/yassa/100/100",
    },
    {
      name: "Gambas Grillées",
      category: "Fruits de Mer",
      margin: 52,
      image: "https://picsum.photos/seed/gambas/100/100",
    },
    {
      name: "Filet de Bœuf Rossini",
      category: "Viandes",
      margin: 45,
      image: "https://picsum.photos/seed/beef/100/100",
    },
  ]);
}
