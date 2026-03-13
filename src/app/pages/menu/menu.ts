
import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage, DecimalPipe } from '@angular/common';
import { MenuService } from '../../core/services/menu.service';
import { MenuCategory, MenuItem, WineItem } from '../../core/models/menu.model';
import { MatIconModule } from '@angular/material/icon';
import { animate, stagger } from 'motion';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, DecimalPipe, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu implements OnInit {
  private menuService = inject(MenuService);

  categories = signal<MenuCategory[]>([]);
  items = signal<MenuItem[]>([]);
  wines = signal<WineItem[]>([]);
  
  activeCategoryId = signal<string>('all');
  
  filteredItems = computed(() => {
    const catId = this.activeCategoryId();
    const allItems = this.items();
    if (catId === 'all') return allItems;
    if (catId === 'wines') return []; // Wines are handled separately
    return allItems.filter(item => item.categoryId === catId);
  });

  featuredItems = computed(() => this.items().filter(item => item.isFeatured));

  ngOnInit() {
    this.menuService.getCategories().subscribe(cats => {
      this.categories.set(cats.filter(c => c.active));
    });
    this.menuService.getItems().subscribe(items => {
      this.items.set(items.filter(i => i.active));
    });
    this.menuService.getWines().subscribe(wines => {
      this.wines.set(wines.filter(w => w.active));
    });
  }

  scrollToCategory(categoryId: string) {
    this.activeCategoryId.set(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  animateItems() {
    animate(
      '.menu-item-card',
      { opacity: [0, 1], y: [20, 0] },
      { delay: stagger(0.05), duration: 0.5 }
    );
  }
}
