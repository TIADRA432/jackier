import type { Dish } from './index';

export interface MenuCategory { id: string; name: string; order?: number; }
export interface CategoryFilter { id: string; label: string; }
const labels: Record<string, string> = {
  entree: 'Entrées', plat: 'Plats', dessert: 'Desserts', boisson: 'Boissons',
  fruits_de_mer: 'Fruits de mer', local: 'Cuisine locale', vin: 'Vins',
  grillade: 'Grillades', accompagnement: 'Accompagnements'
};
export const normalizeSearch = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLocaleLowerCase('fr');

export function categoryKey(dish: Dish, categories: readonly MenuCategory[]): string {
  const category = categories.find(item => item.id === dish.categoryId)
    ?? categories.find(item => normalizeSearch(item.name) === normalizeSearch(dish.category));
  return category ? `category:${category.id}` : `legacy:${dish.category}`;
}

export function categoryFilters(dishes: readonly Dish[], categories: readonly MenuCategory[]): CategoryFilter[] {
  const used = new Set(dishes.map(dish => categoryKey(dish, categories)));
  const result: CategoryFilter[] = [{ id: 'all', label: 'Tout' }];
  for (const category of [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))) {
    const id = `category:${category.id}`;
    if (used.delete(id)) result.push({ id, label: category.name });
  }
  for (const dish of dishes) {
    const id = categoryKey(dish, categories);
    if (used.delete(id)) result.push({ id, label: labels[dish.category] ?? (dish.category || 'Autres') });
  }
  return result;
}

export interface MenuFilters {
  query: string; category: string; vegetarian: boolean; spicy: boolean;
  local: boolean; featured: boolean; minPrice: number; maxPrice: number;
}
export function filterDishes(dishes: readonly Dish[], categories: readonly MenuCategory[], filters: MenuFilters): Dish[] {
  const query = normalizeSearch(filters.query);
  return dishes.filter(dish =>
    (!query || normalizeSearch(`${dish.name} ${dish.description}`).includes(query)) &&
    (filters.category === 'all' || categoryKey(dish, categories) === filters.category) &&
    (!filters.vegetarian || dish.isVegetarian) && (!filters.spicy || dish.isSpicy) &&
    (!filters.local || dish.isLocalSpecialty) && (!filters.featured || dish.isFeatured) &&
    dish.price >= filters.minPrice && dish.price <= filters.maxPrice);
}
