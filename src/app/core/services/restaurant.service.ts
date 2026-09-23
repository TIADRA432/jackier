
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Dish, TeamMember, CateringService, SchoolProgram, Wine, GalleryImage } from '../models';
import { environment } from '../../../environments/environment';
import { MenuCategory } from '../models/menu-catalog';

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
  readonly menuCategories = signal<MenuCategory[]>([]);
  private wines = signal<Wine[]>([]);
  private galleryImages = signal<GalleryImage[]>([]);
  private schoolPrograms = signal<SchoolProgram[]>([]);
  private team = signal<TeamMember[]>([]);

  private loadingMenu = signal(true);
  private loadingWines = signal(true);
  private loadingGallery = signal(true);
  private loadingSchool = signal(true);
  private loadingTeam = signal(true);
  private errorMenu = signal<string | null>(null);
  private errorWines = signal<string | null>(null);
  private errorGallery = signal<string | null>(null);
  private errorSchool = signal<string | null>(null);
  private errorTeam = signal<string | null>(null);


  // Cartes marketing statiques présentées sur la page traiteur (distinctes des demandes de devis, qui elles sont envoyées via /api/catering).
  private cateringServices = signal<CateringService[]>([
    { id: '1', title: 'Mariages & Cérémonies', description: 'Des menus sur-mesure pour votre grand jour.', icon: '💍' },
    { id: '2', title: 'Événements d\'Entreprise', description: 'Cocktails, buffets et déjeuners d\'affaires.', icon: '🏢' },
    { id: '3', title: 'Dîners Privés', description: 'L\'expérience Le Jacquier directement chez vous.', icon: '🍽️' },
    { id: '4', title: 'Location Matériel', description: 'Tables, chaises, vaisselle et décoration.', icon: '🎪' }
  ]);

  constructor() {
    this.loadDishes();
    this.loadMenuCategories();
    this.loadWines();
    this.loadGallery();
    this.loadSchoolPrograms();
    this.loadTeam();
  }

  private async loadDishes() {
    this.loadingMenu.set(true);
    this.errorMenu.set(null);
    try {
      const raw = await firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/menu`));
      // The public endpoint already applies this policy. Keep the client-side guard
      // as defence in depth if a stale proxy response is ever served.
      this.dishes.set((raw || []).filter(item => item.active !== false).map(item => ({
        id: item.id,
        name: item.name,
        description: item.shortDescription ?? item.description ?? '',
        price: item.price,
        category: item.category,
        categoryId: item.categoryId,
        isFeatured: item.isFeatured === true,
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

  private async loadMenuCategories() {
    try {
      this.menuCategories.set(await firstValueFrom(this.http.get<MenuCategory[]>(`${this.apiUrl}/categories`)));
    } catch {
      // The catalogue stays usable with the category labels carried by each dish.
      this.menuCategories.set([]);
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
        origin: item.origin ?? '',
        grape: item.grape ?? '',
        year: item.year,
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
        displayOrder: item.displayOrder ?? 0,
        uploadedAt: item.uploadedAt
      })));
    } catch (err) {
      console.error('Impossible de charger la galerie depuis l\'API', err);
      this.errorGallery.set('La galerie n\'a pas pu être chargée.');
    } finally {
      this.loadingGallery.set(false);
    }
  }

  private async loadTeam() {
    this.loadingTeam.set(true);
    this.errorTeam.set(null);
    try {
      const raw = await firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/team/public`));
      this.team.set((raw || []).map(item => ({
        id: item.id,
        name: item.name,
        role: item.role,
        department: item.department,
        image: item.photoUrl ?? '',
        bio: item.bio ?? '',
        displayOrder: item.displayOrder ?? 0
      })));
    } catch (err) {
      console.error('Impossible de charger l\'équipe publique', err);
      this.team.set([]);
      this.errorTeam.set('L’équipe n’a pas pu être chargée.');
    } finally {
      this.loadingTeam.set(false);
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
  getTeam() { return this.team.asReadonly(); }
  getCateringServices() { return this.cateringServices.asReadonly(); }
  getSchoolPrograms() { return this.schoolPrograms.asReadonly(); }

  // États de chargement/erreur (lecture seule) pour piloter spinners/messages côté pages
  isLoadingMenu() { return this.loadingMenu.asReadonly(); }
  isLoadingWines() { return this.loadingWines.asReadonly(); }
  isLoadingGallery() { return this.loadingGallery.asReadonly(); }
  isLoadingSchool() { return this.loadingSchool.asReadonly(); }
  isLoadingTeam() { return this.loadingTeam.asReadonly(); }
  getMenuError() { return this.errorMenu.asReadonly(); }
  getWinesError() { return this.errorWines.asReadonly(); }
  getGalleryError() { return this.errorGallery.asReadonly(); }
  getSchoolError() { return this.errorSchool.asReadonly(); }
  getTeamError() { return this.errorTeam.asReadonly(); }

  /** Relance le chargement du menu après une erreur (bouton "Réessayer"). */
  retryLoadDishes() { return this.loadDishes(); }
  retryLoadWines() { return this.loadWines(); }
  retryLoadGallery() { return this.loadGallery(); }
  retryLoadSchoolPrograms() { return this.loadSchoolPrograms(); }
  retryLoadTeam() { return this.loadTeam(); }

  getDailySpecial() {
    return this.dishes().find(dish => dish.isFeatured === true);
  }

  /** Soumet une demande de devis traiteur/événement vers /api/catering (endpoint public). */
  async submitCateringRequest(payload: Record<string, unknown>) {
    return firstValueFrom(this.http.post(`${this.apiUrl}/catering`, payload));
  }
}
