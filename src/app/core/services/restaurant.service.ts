
import { Injectable, signal } from '@angular/core';
import { Dish, Review, TeamMember, CateringService, SchoolProgram } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  
  readonly info = {
    name: 'Le Jacquier',
    address: 'Face au Lycée Kipé / T2 Carrefour Métal Guinée, Conakry',
    phone: '+224 625 67 53 63',
    hours: 'Tous les jours de 12h à 23h',
    email: 'contact@lejacquier-conakry.com',
    location: { lat: 9.608, lng: -13.626 } // Approx coordinates for Kipé
  };

  private dishes = signal<Dish[]>([
    {
      id: '1',
      name: 'Salade de Chèvre Chaud',
      description: 'Toast de chèvre sur lit de salade fraîche, noix et miel.',
      price: 85000,
      category: 'entree',
      image: 'https://picsum.photos/seed/salad/400/300',
      isVegetarian: true
    },
    {
      id: '2',
      name: 'Carpaccio de Capitaine',
      description: 'Fines tranches de poisson capitaine mariné au citron vert et baies roses.',
      price: 95000,
      category: 'entree',
      image: 'https://picsum.photos/seed/carpaccio/400/300',
      isLocalSpecialty: true
    },
    {
      id: '3',
      name: 'Poulet Yassa "Le Jacquier"',
      description: 'Cuisse de poulet braisée, sauce aux oignons confits, riz blanc.',
      price: 120000,
      category: 'local',
      image: 'https://picsum.photos/seed/yassa/400/300',
      isLocalSpecialty: true,
      isSpicy: true
    },
    {
      id: '4',
      name: 'Filet de Bœuf Rossini',
      description: 'Tournedos de bœuf, foie gras poêlé, sauce truffe.',
      price: 180000,
      category: 'plat',
      image: 'https://picsum.photos/seed/beef/400/300'
    },
    {
      id: '5',
      name: 'Risotto aux Champignons des Bois',
      description: 'Riz arborio crémeux, mélange forestier, parmesan.',
      price: 110000,
      category: 'plat',
      image: 'https://picsum.photos/seed/risotto/400/300',
      isVegetarian: true
    },
    {
      id: '6',
      name: 'Moelleux au Chocolat',
      description: 'Cœur coulant, glace vanille de Madagascar.',
      price: 75000,
      category: 'dessert',
      image: 'https://picsum.photos/seed/choc/400/300'
    },
    {
      id: '7',
      name: 'Déclinaison de Mangue',
      description: 'Sorbet, mousse et fruits frais selon la saison.',
      price: 70000,
      category: 'dessert',
      image: 'https://picsum.photos/seed/mango/400/300',
      isLocalSpecialty: true
    },
    {
      id: '8',
      name: 'Jus de Bissap Maison',
      description: 'Fleur d\'hibiscus, menthe fraîche, peu sucré.',
      price: 25000,
      category: 'boisson',
      image: 'https://picsum.photos/seed/bissap/400/300',
      isLocalSpecialty: true
    },
    // New Seafood Items
    {
      id: '9',
      name: 'Gambas Grillées à la Guinéenne',
      description: 'Gambas géantes grillées aux épices locales, alloco.',
      price: 190000,
      category: 'fruits_de_mer',
      image: 'https://picsum.photos/seed/gambas/400/300',
      isLocalSpecialty: true,
      isSpicy: true
    },
    {
      id: '10',
      name: 'Pavé de Thon Rouge',
      description: 'Thon mi-cuit, sésame, purée de patates douces.',
      price: 160000,
      category: 'fruits_de_mer',
      image: 'https://picsum.photos/seed/tuna/400/300'
    },
    // New Local Items
    {
      id: '11',
      name: 'Sauce Feuille au Poisson Fumé',
      description: 'Plat traditionnel revisité, servi avec riz blanc ou fonio.',
      price: 90000,
      category: 'local',
      image: 'https://picsum.photos/seed/leafsauce/400/300',
      isLocalSpecialty: true,
      isSpicy: true
    },
    {
      id: '12',
      name: 'Riz Gras Royal',
      description: 'Le classique des fêtes, garni de viandes et légumes.',
      price: 110000,
      category: 'local',
      image: 'https://picsum.photos/seed/jollof/400/300',
      isLocalSpecialty: true
    },
    // Wines
    {
      id: '13',
      name: 'Château Margaux 2015',
      description: 'Grand cru classé, notes de fruits noirs et épices.',
      price: 950000,
      category: 'vin',
      image: 'https://picsum.photos/seed/wine/400/300'
    }
  ]);

  private reviews = signal<Review[]>([
    { author: 'Mariam C.', rating: 5, comment: 'Une expérience incroyable ! Le cadre est magnifique et les plats sont délicieux.', date: '2023-10-15' },
    { author: 'Jean-Pierre L.', rating: 4, comment: 'Très bonne cuisine fusion. Le service est impeccable.', date: '2023-11-02' },
    { author: 'Fatim D.', rating: 5, comment: 'Le meilleur restaurant de Kipé. Je recommande le Yassa revisité.', date: '2023-12-10' }
  ]);

  private team = signal<TeamMember[]>([
    { id: '1', name: 'Chef Amadou Diallo', role: 'Chef Exécutif', image: 'https://picsum.photos/seed/chef1/300/300', bio: '20 ans d\'expérience entre Paris et Conakry.' },
    { id: '2', name: 'Sophie Martin', role: 'Responsable Salle', image: 'https://picsum.photos/seed/staff2/300/300', bio: 'Experte en hospitalité et sommelier.' },
    { id: '3', name: 'Ibrahima Bah', role: 'Chef Pâtissier', image: 'https://picsum.photos/seed/chef3/300/300', bio: 'Le maître des douceurs et des fruits locaux.' },
    { id: '4', name: 'Kadiatou Camara', role: 'Responsable Traiteur', image: 'https://picsum.photos/seed/staff4/300/300', bio: 'Organisatrice de vos plus beaux événements.' }
  ]);

  private cateringServices = signal<CateringService[]>([
    { id: '1', title: 'Mariages & Cérémonies', description: 'Des menus sur-mesure pour votre grand jour.', icon: '💍' },
    { id: '2', title: 'Événements d\'Entreprise', description: 'Cocktails, buffets et déjeuners d\'affaires.', icon: 'guinée' },
    { id: '3', title: 'Dîners Privés', description: 'L\'expérience Le Jacquier directement chez vous.', icon: '🍽️' },
    { id: '4', title: 'Location Matériel', description: 'Tables, chaises, vaisselle et décoration.', icon: '🎪' }
  ]);

  private schoolPrograms = signal<SchoolProgram[]>([
    { id: '1', title: 'Cuisine Guinéenne & Africaine', duration: '6 Mois', description: 'Maîtrisez les classiques et la modernisation.', level: 'Débutant à Intermédiaire' },
    { id: '2', title: 'Pâtisserie & Boulangerie', duration: '3 Mois', description: 'Techniques françaises et ingrédients locaux.', level: 'Tous niveaux' },
    { id: '3', title: 'Hygiène & Sécurité (HACCP)', duration: '1 Semaine', description: 'Certification indispensable pour les pros.', level: 'Professionnel' }
  ]);

  // Readonly exposures
  getDishes() { return this.dishes.asReadonly(); }
  getReviews() { return this.reviews.asReadonly(); }
  getTeam() { return this.team.asReadonly(); }
  getCateringServices() { return this.cateringServices.asReadonly(); }
  getSchoolPrograms() { return this.schoolPrograms.asReadonly(); }

  getDailySpecial() {
    // Return a random dish as daily special for demo
    return this.dishes()[2]; // Poulet Yassa
  }
}
