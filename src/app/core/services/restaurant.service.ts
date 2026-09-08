
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Dish, Review, TeamMember, CateringService, SchoolProgram, Wine, GalleryImage } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  readonly info = {
    name: 'Le Jacquier',
    address: 'Face au Lycée Kipé / T2 Carrefour Métal Guinée, Conakry',
    phone: '+224 625 67 53 63',
    hours: 'Tous les jours de 12h à 23h',
    email: 'contact@lejacquier-conakry.com',
    location: { lat: 9.608, lng: -13.626 } // Approx coordinates for Kipé
  };

  private dishes = signal<Dish[]>([]);
  private wines = signal<Wine[]>([]);
  private galleryImages = signal<GalleryImage[]>([]);
  private schoolPrograms = signal<SchoolProgram[]>([]);

  // États de chargement/erreur exposés aux pages, pour éviter l'écran figé ou les faux
  // messages "aucun résultat" pendant que les données arrivent encore du serveur.
  private loadingMenu = signal(true);
  private loadingWines = signal(true);
  private loadingGallery = signal(true);
  private loadingSchool = signal(true);
  private errorMenu = signal<string | null>(null);
  private errorWines = signal<string | null>(null);
  private errorGallery = signal<string | null>(null);
  private errorSchool = signal<string | null>(null);

  // Pas de table backend dédiée pour les avis clients et l'équipe : contenu éditorial statique pour le moment.
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

  // Cartes marketing statiques présentées sur la page traiteur (distinctes des demandes de devis, qui elles sont envoyées via /api/catering).
  private cateringServices = signal<CateringService[]>([
    { id: '1', title: 'Mariages & Cérémonies', description: 'Des menus sur-mesure pour votre grand jour.', icon: '💍' },
    { id: '2', title: 'Événements d\'Entreprise', description: 'Cocktails, buffets et déjeuners d\'affaires.', icon: '🏢' },
    { id: '3', title: 'Dîners Privés', description: 'L\'expérience Le Jacquier directement chez vous.', icon: '🍽️' },
    { id: '4', title: 'Location Matériel', description: 'Tables, chaises, vaisselle et décoration.', icon: '🎪' }
  ]);

  constructor() {
    this.loadDishes();
    this.loadWines();
    this.loadGallery();
    this.loadSchoolPrograms();
  }

  private async loadDishes() {
    this.loadingMenu.set(true);
    this.errorMenu.set(null);
    try {
      const raw = await firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/menu`));
      this.dishes.set((raw || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.shortDescription ?? item.description ?? '',
        price: item.price,
        category: item.category,
        image: item.imageUrl ?? item.image ?? '',
        isVegetarian: item.isVegetarian,
        isSpicy: item.isSpicy,
        isLocalSpecialty: item.isLocalSpecialty
      })));
    } catch (err) {
      console.error('Impossible de charger le menu depuis l\'API', err);
      this.errorMenu.set('Le menu n\'a pas pu être chargé. Merci de réessayer dans un instant.');
    } finally {
      this.loadingMenu.set(false);
    }
  }

  private async loadWines() {
    this.loadingWines.set(true);
    this.errorWines.set(null);
    try {
      const raw = await firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/wines`));
      this.wines.set((raw || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description ?? '',
        priceBottle: item.priceBottle,
        priceGlass: item.priceGlass,
        image: item.imageUrl ?? ''
      })));
    } catch (err) {
      console.error('Impossible de charger les vins depuis l\'API', err);
      this.errorWines.set('La carte des vins n\'a pas pu être chargée.');
    } finally {
      this.loadingWines.set(false);
    }
  }

  private async loadGallery() {
    this.loadingGallery.set(true);
    this.errorGallery.set(null);
    try {
      const raw = await firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/gallery`));
      this.galleryImages.set((raw || []).map(item => ({
        id: item.id,
        imageUrl: item.imageUrl,
        title: item.title,
        category: item.category,
        uploadedAt: item.uploadedAt
      })));
    } catch (err) {
      console.error('Impossible de charger la galerie depuis l\'API', err);
      this.errorGallery.set('La galerie n\'a pas pu être chargée.');
    } finally {
      this.loadingGallery.set(false);
    }
  }

  private async loadSchoolPrograms() {
    this.loadingSchool.set(true);
    this.errorSchool.set(null);
    try {
      const raw = await firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/school`));
      this.schoolPrograms.set(raw || []);
    } catch (err) {
      console.error('Impossible de charger les programmes école depuis l\'API', err);
      this.errorSchool.set('Les programmes de l\'école n\'ont pas pu être chargés.');
    } finally {
      this.loadingSchool.set(false);
    }
  }

  // Readonly exposures
  getDishes() { return this.dishes.asReadonly(); }
  getWines() { return this.wines.asReadonly(); }
  getGalleryImages() { return this.galleryImages.asReadonly(); }
  getReviews() { return this.reviews.asReadonly(); }
  getTeam() { return this.team.asReadonly(); }
  getCateringServices() { return this.cateringServices.asReadonly(); }
  getSchoolPrograms() { return this.schoolPrograms.asReadonly(); }

  // États de chargement/erreur (lecture seule) pour piloter spinners/messages côté pages
  isLoadingMenu() { return this.loadingMenu.asReadonly(); }
  isLoadingWines() { return this.loadingWines.asReadonly(); }
  isLoadingGallery() { return this.loadingGallery.asReadonly(); }
  isLoadingSchool() { return this.loadingSchool.asReadonly(); }
  getMenuError() { return this.errorMenu.asReadonly(); }
  getWinesError() { return this.errorWines.asReadonly(); }
  getGalleryError() { return this.errorGallery.asReadonly(); }
  getSchoolError() { return this.errorSchool.asReadonly(); }

  /** Relance le chargement du menu après une erreur (bouton "Réessayer"). */
  retryLoadDishes() { return this.loadDishes(); }
  retryLoadGallery() { return this.loadGallery(); }
  retryLoadSchoolPrograms() { return this.loadSchoolPrograms(); }

  getDailySpecial() {
    const list = this.dishes();
    return list.length ? list[Math.min(2, list.length - 1)] : undefined;
  }

  /** Soumet une demande de devis traiteur/événement vers /api/catering (endpoint public). */
  async submitCateringRequest(payload: Record<string, unknown>) {
    return firstValueFrom(this.http.post(`${this.apiUrl}/catering`, payload));
  }
}
