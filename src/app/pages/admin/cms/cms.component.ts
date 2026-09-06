import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-admin-cms",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">CMS & Contenu</h1>
          <p class="text-gray-400 text-sm mt-1">Gérez le site web et la communication</p>
        </div>
        <button class="px-4 py-2 bg-jacquier-gold text-jacquier-dark rounded-xl text-sm font-bold hover:bg-white transition-colors shadow-lg shadow-jacquier-gold/20">
          Nouvel Article
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
            <div class="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 class="text-lg font-serif font-bold text-white">Articles & Actualités</h3>
              <div class="flex gap-2">
                <button class="px-3 py-1 bg-gray-800 rounded-lg text-xs font-bold text-white">Tous</button>
                <button class="px-3 py-1 text-xs font-bold text-gray-500 hover:text-white">Publiés</button>
                <button class="px-3 py-1 text-xs font-bold text-gray-500 hover:text-white">Brouillons</button>
              </div>
            </div>
            
            <div class="p-6 space-y-4">
              @for (post of posts(); track post.id) {
                <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-800/50 transition-colors group">
                  <div class="w-24 h-24 rounded-lg bg-gray-800 overflow-hidden shrink-0">
                    <img [src]="post.image" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start">
                      <h4 class="text-white font-bold text-sm group-hover:text-jacquier-gold transition-colors truncate">{{ post.title }}</h4>
                      <span [class]="'px-2 py-0.5 rounded text-[10px] font-bold uppercase ' + (post.status === 'Publié' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500')">
                        {{ post.status }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ post.excerpt }}</p>
                    <div class="flex items-center gap-4 mt-3">
                      <span class="text-[10px] text-gray-600 uppercase font-bold">{{ post.date }}</span>
                      <span class="text-[10px] text-gray-600 uppercase font-bold flex items-center gap-1">
                        <i class="material-icons text-[12px]">visibility</i> {{ post.views }}
                      </span>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <button class="p-2 text-gray-500 hover:text-jacquier-gold transition-colors"><i class="material-icons text-lg">edit</i></button>
                    <button class="p-2 text-gray-500 hover:text-red-500 transition-colors"><i class="material-icons text-lg">delete</i></button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
            <h3 class="text-lg font-serif font-bold text-white mb-4">Promotions Actives</h3>
            <div class="space-y-4">
              @for (promo of promos(); track promo.id) {
                <div class="p-4 bg-jacquier-gold/5 border border-jacquier-gold/20 rounded-xl relative overflow-hidden">
                  <div class="absolute -right-4 -top-4 w-12 h-12 bg-jacquier-gold/10 rounded-full"></div>
                  <p class="text-xs font-bold text-jacquier-gold uppercase tracking-widest mb-1">{{ promo.code }}</p>
                  <p class="text-sm font-bold text-white">{{ promo.title }}</p>
                  <p class="text-xs text-gray-500 mt-1">Expire le: {{ promo.expiry }}</p>
                </div>
              }
            </div>
            <button class="w-full mt-4 py-2 text-xs font-bold text-jacquier-gold border border-jacquier-gold/20 rounded-lg hover:bg-jacquier-gold/5 transition-colors uppercase tracking-widest">
              Nouvelle Promo
            </button>
          </div>

          <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
            <h3 class="text-lg font-serif font-bold text-white mb-4">SEO & Réseaux</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">Score SEO Global</span>
                <span class="text-sm font-bold text-green-500">85/100</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">Posts Instagram (Semaine)</span>
                <span class="text-sm font-bold text-white">4</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">Avis Google non répondus</span>
                <span class="text-sm font-bold text-red-500">2</span>
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
export class CMSComponent {
  posts = signal([
    { id: 1, title: 'Lancement de la nouvelle carte d\'été', excerpt: 'Découvrez nos nouvelles créations inspirées des saveurs tropicales et des produits locaux de saison...', status: 'Publié', date: '12 Juin 2024', views: 1240, image: 'https://picsum.photos/seed/post1/200/200' },
    { id: 2, title: 'Atelier Gastronomique: Maîtriser le Yassa', excerpt: 'Rejoignez notre Chef pour une matinée immersive dédiée à l\'art du Yassa traditionnel revisité...', status: 'Publié', date: '08 Juin 2024', views: 850, image: 'https://picsum.photos/seed/post2/200/200' },
    { id: 3, title: 'Le Jacquier s\'agrandit: Nouvelle terrasse', excerpt: 'Nous sommes ravis de vous annoncer l\'ouverture de notre nouvel espace extérieur avec vue sur...', status: 'Brouillon', date: '05 Juin 2024', views: 0, image: 'https://picsum.photos/seed/post3/200/200' },
  ]);

  promos = signal([
    { id: 1, code: 'SUMMER24', title: '-15% sur les cocktails', expiry: '31 Août 2024' },
    { id: 2, code: 'ECOLEPRO', title: 'Frais d\'inscription offerts', expiry: '15 Sept 2024' },
  ]);
}
