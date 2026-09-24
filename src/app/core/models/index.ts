
export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryId?: string;
  isFeatured?: boolean;
  image: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isLocalSpecialty?: boolean;
}

export interface Wine {
  id: string;
  name: string;
  origin?: string;
  grape?: string;
  year?: number;
  description: string;
  priceBottle: number;
  priceGlass?: number;
  image: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  displayOrder: number;
  uploadedAt: string;
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
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  image: string;
  bio?: string;
  displayOrder?: number;
}


export interface SchoolProgram {
  id: string;
  title: string;
  duration: string;
  description: string;
  level: 'Débutant' | 'Intermédiaire' | 'Pro' | string;
  price?: number | null;
  capacity?: number;
  prerequisites?: string | null;
  instructor?: string | null;
  materialsIncluded?: string[];
  status?: 'draft' | 'published' | 'archived';
  displayOrder?: number;
}

export interface SchoolSession {
  id: string;
  programId: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  location?: string | null;
  status: 'scheduled' | 'cancelled' | 'completed';
  registeredCount: number;
  remainingPlaces: number;
}

export interface SchoolRegistrationReceipt {
  id: string;
  sessionId: string;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  createdAt?: string;
}
