
export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'entree' | 'plat' | 'dessert' | 'boisson' | 'fruits_de_mer' | 'local' | 'vin';
  image: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isLocalSpecialty?: boolean;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Reservation {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
}

export interface CateringService {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SchoolProgram {
  id: string;
  title: string;
  duration: string;
  description: string;
  level: string;
}
