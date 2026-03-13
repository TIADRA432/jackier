export interface MenuCategory {
  id?: string;
  name: string;
  description?: string;
  order: number;
  active: boolean;
}

export interface MenuItem {
  id?: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  description?: string;
  price: number;
  imageUrl: string;
  isFeatured: boolean;
  displayOrder: number;
  active: boolean;
}

export interface WineItem {
  id?: string;
  name: string;
  origin: string;
  grape: string;
  year?: number;
  description: string;
  pairingSuggestion?: string;
  priceBottle: number;
  priceGlass?: number;
  imageUrl: string;
  displayOrder: number;
  active: boolean;
}
