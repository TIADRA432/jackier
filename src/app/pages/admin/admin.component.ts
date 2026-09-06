import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-admin-layout",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="min-h-screen bg-[#121212] text-white flex overflow-hidden font-sans"
    >
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] border-r border-gray-800 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0"
        [class.-translate-x-full]="!isSidebarOpen()"
      >
        <!-- Logo Area -->
        <div
          class="h-20 flex items-center justify-between px-6 border-b border-gray-800"
        >
          <a
            routerLink="/"
            class="text-jacquier-gold font-serif font-bold text-xl tracking-widest uppercase flex items-center gap-3"
          >
            <div
              class="w-8 h-8 bg-jacquier-gold rounded-full flex items-center justify-center text-[#1a1a1a] font-bold text-lg"
            >
              J
            </div>
            Le Jacquier
          </a>
          <button
            (click)="toggleSidebar()"
            class="md:hidden text-gray-400 hover:text-white"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-6 custom-scrollbar">
          <ul class="space-y-2 px-4">
            <!-- Layer 1: Monitoring -->
            <li>
              <div
                class="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 px-4"
              >
                Monitoring
              </div>
              <a
                routerLink="/admin/dashboard"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold"
                class="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-transparent group"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  ></path>
                </svg>
                Centre de Commande
              </a>
            </li>

            <!-- Layer 2: Opérations -->
            <li class="pt-4">
              <div
                class="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 px-4"
              >
                Opérations
              </div>
              <a
                routerLink="/admin/restaurant"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold"
                class="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-transparent group"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  ></path>
                </svg>
                Restaurant & Menu
              </a>
              <a
                routerLink="/admin/reservations"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold"
                class="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-transparent group mt-1"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                Réservations
              </a>
              <a
                routerLink="/admin/traiteur"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold"
                class="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-transparent group mt-1"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                Service Traiteur
              </a>
              <a
                routerLink="/admin/ecole"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold"
                class="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-transparent group mt-1"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  ></path>
                </svg>
                École Gastronomique
              </a>
              <a
                routerLink="/admin/stock"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold"
                class="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-transparent group mt-1"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>
                Stock & Inventaire
              </a>
            </li>

            <!-- Layer 3: Intelligence -->
            <li class="pt-4">
              <div
                class="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 px-4"
              >
                Intelligence
              </div>
              <a
                routerLink="/admin/finance"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold"
                class="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-transparent group"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
                Finance & BI
              </a>
              <a
                routerLink="/admin/analytics"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold"
                class="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-transparent group mt-1"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                Analyses Avancées
              </a>
            </li>

            <!-- Layer 4: Administration -->
            <li class="pt-4">
              <div
                class="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 px-4"
              >
                Administration
              </div>
              <a
                routerLink="/admin/equipe"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold"
                class="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-transparent group"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                Équipe & RH
              </a>
              <a
                routerLink="/admin/cms"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold"
                class="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-transparent group mt-1"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  ></path>
                </svg>
                CMS & Contenu
              </a>
              <a
                routerLink="/admin/settings"
                routerLinkActive="bg-jacquier-gold/10 text-jacquier-gold border-jacquier-gold"
                class="flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border-l-2 border-transparent group mt-1"
              >
                <svg
                  class="w-5 h-5 mr-3 group-hover:text-jacquier-gold transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                </svg>
                Paramètres
              </a>
            </li>
          </ul>
        </nav>

        <!-- User Profile (Bottom Sidebar) -->
        <div class="p-4 border-t border-gray-800">
          <div
            class="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700"
          >
            <div
              class="w-10 h-10 rounded-full bg-jacquier-gold flex items-center justify-center text-[#1a1a1a] font-bold"
            >
              AD
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-white truncate">Amadou Diallo</p>
              <p class="text-xs text-jacquier-gold truncate">Admin System</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Overlay for mobile -->
      @if (isSidebarOpen()) {
        <div
          class="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          (click)="toggleSidebar()"
        ></div>
      }

      <!-- Main Content Area -->
      <div
        class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative"
      >
        <!-- Top Navbar -->
        <header
          class="h-20 bg-[#121212]/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 lg:px-10 z-30 sticky top-0"
        >
          <div class="flex items-center gap-4">
            <button
              (click)="toggleSidebar()"
              class="md:hidden text-gray-400 hover:text-white p-2 -ml-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <div
              class="hidden sm:flex items-center bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 w-64 focus-within:border-jacquier-gold focus-within:ring-1 focus-within:ring-jacquier-gold transition-all"
            >
              <svg
                class="w-5 h-5 text-gray-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <input
                type="text"
                placeholder="Rechercher..."
                class="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
              />
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button
              class="relative p-2 text-gray-400 hover:text-jacquier-gold transition-colors rounded-lg hover:bg-gray-800"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
              <span
                class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#121212]"
              ></span>
            </button>
            <a
              routerLink="/"
              class="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-700"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                ></path>
              </svg>
              Aller au site
            </a>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #333;
        border-radius: 20px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #555;
      }
    `,
  ],
})
export class AdminComponent {
  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }
}
