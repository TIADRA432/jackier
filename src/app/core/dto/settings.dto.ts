export interface SettingsDto {
  id?: string;
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  currency: string;
  vat: number;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}
