
export interface MenuCategory {
  id: string;
  name: string; // Entrées, Plats, Desserts, Vins
  description?: string;
  order: number;
  active: boolean;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  category: string;
  name: string;
  shortDescription: string;
  description?: string;
  price: number;
  imageUrl?: string;
  gallery?: string[];
  dietaryTags?: string[]; // e.g., ['Végétarien', 'Sans Gluten']
  allergens?: string[]; // e.g., ['Lactose', 'Arachides']
  isFeatured: boolean;
  displayOrder: number;
  active: boolean;
}

export interface WineItem {
  id: string;
  name: string;
  origin: string; // e.g., 'Bordeaux, France'
  grape: string; // e.g., 'Merlot'
  year?: number;
  description: string;
  pairingSuggestion?: string;
  priceBottle: number;
  priceGlass?: number;
  imageUrl?: string;
  displayOrder: number;
  active: boolean;
}
