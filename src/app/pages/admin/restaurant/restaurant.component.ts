import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

@Component({
  selector: "app-admin-restaurant",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">
            Gestion Restaurant
          </h1>
          <p class="text-gray-400 text-sm mt-1">
            Gérez vos plats, menus et disponibilités
          </p>
        </div>
        <button
          class="px-4 py-2 bg-jacquier-gold text-jacquier-dark rounded-xl text-sm font-bold hover:bg-white transition-colors shadow-lg shadow-jacquier-gold/20 flex items-center"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Nouveau Plat
        </button>
      </div>

      <!-- Filters -->
      <div
        class="bg-[#1a1a1a] p-4 rounded-2xl border border-gray-800 flex flex-wrap gap-4"
      >
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <svg
              class="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"
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
              placeholder="Rechercher un plat..."
              class="w-full pl-10 pr-4 py-2 bg-[#121212] border border-gray-800 rounded-xl text-sm text-white focus:ring-1 focus:ring-jacquier-gold outline-none"
            />
          </div>
        </div>
        <select
          class="px-4 py-2 bg-[#121212] border border-gray-800 rounded-xl text-sm text-white outline-none"
        >
          <option value="">Toutes les catégories</option>
          <option value="local">Plats Locaux</option>
          <option value="seafood">Fruits de Mer</option>
          <option value="dessert">Desserts</option>
        </select>
        <select
          class="px-4 py-2 bg-[#121212] border border-gray-800 rounded-xl text-sm text-white outline-none"
        >
          <option value="">Tous les statuts</option>
          <option value="available">Disponible</option>
          <option value="unavailable">Rupture</option>
        </select>
      </div>

      <!-- Table -->
      <div
        class="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-400">
            <thead
              class="text-xs text-gray-500 uppercase bg-[#121212] border-b border-gray-800"
            >
              <tr>
                <th scope="col" class="px-6 py-4">Plat</th>
                <th scope="col" class="px-6 py-4">Catégorie</th>
                <th scope="col" class="px-6 py-4">Prix</th>
                <th scope="col" class="px-6 py-4">Statut</th>
                <th scope="col" class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (dish of dishes(); track dish.id) {
                <tr
                  class="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                >
                  <td
                    class="px-6 py-4 font-medium text-white flex items-center gap-3"
                  >
                    <div
                      class="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden"
                    >
                      <img
                        [src]="dish.image"
                        class="w-full h-full object-cover"
                        [alt]="dish.name"
                      />
                    </div>
                    {{ dish.name }}
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300"
                    >
                      {{ dish.category }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-white font-medium">
                    {{ dish.price }} FG
                  </td>
                  <td class="px-6 py-4">
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        class="sr-only peer"
                        [checked]="dish.isAvailable"
                      />
                      <div
                        class="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"
                      ></div>
                    </label>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button
                      class="text-gray-400 hover:text-white mr-3 transition-colors"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      class="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          class="p-4 border-t border-gray-800 flex items-center justify-between text-sm text-gray-500"
        >
          <span>Affichage de 1 à 5 sur 24 plats</span>
          <div class="flex gap-2">
            <button
              class="px-3 py-1 rounded-lg border border-gray-800 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50"
              disabled
            >
              Précédent
            </button>
            <button
              class="px-3 py-1 rounded-lg border border-gray-800 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminRestaurantComponent {
  dishes = signal([
    {
      id: "1",
      name: 'Poulet Yassa "Le Jacquier"',
      category: "Plats Locaux",
      price: "120 000",
      isAvailable: true,
      image: "https://picsum.photos/seed/yassa/100/100",
    },
    {
      id: "2",
      name: "Filet de Bœuf Rossini",
      category: "Viandes",
      price: "250 000",
      isAvailable: true,
      image: "https://picsum.photos/seed/beef/100/100",
    },
    {
      id: "3",
      name: "Gambas Grillées",
      category: "Fruits de Mer",
      price: "180 000",
      isAvailable: false,
      image: "https://picsum.photos/seed/gambas/100/100",
    },
    {
      id: "4",
      name: "Soupe du Pêcheur",
      category: "Entrées",
      price: "90 000",
      isAvailable: true,
      image: "https://picsum.photos/seed/soup/100/100",
    },
    {
      id: "5",
      name: "Moelleux au Chocolat",
      category: "Desserts",
      price: "60 000",
      isAvailable: true,
      image: "https://picsum.photos/seed/choco/100/100",
    },
  ]);
}
