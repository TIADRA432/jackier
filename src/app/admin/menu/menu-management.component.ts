import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../core/services/menu.service';
import { MenuItem } from '../../core/models/menu.model';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="p-6">
      <div class="flex items-center justify-between mb-6"><h1 class="text-2xl font-bold">Gestion du menu</h1></div>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        @for (item of items; track item.id) {
          <article class="rounded-lg border p-4"><h2 class="font-semibold">{{ item.name }}</h2><p class="text-sm opacity-70">{{ item.shortDescription || item.description }}</p><p class="mt-2 font-bold">{{ item.price | currency }}</p></article>
        } @empty { <p>Aucun plat disponible.</p> }
      </div>
    </section>
  `
})
export class MenuManagementComponent implements OnInit {
  private menuService = inject(MenuService);
  items: MenuItem[] = [];
  ngOnInit() { this.menuService.getItems().subscribe(items => this.items = items); }
}
