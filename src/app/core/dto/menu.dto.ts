export interface MenuItemDto {
  id?: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  active: boolean;
  imageUrl?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isLocalSpecialty?: boolean;
  allergens?: string[];
}
