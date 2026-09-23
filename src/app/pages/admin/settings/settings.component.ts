import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  AdminDataService,
  BrandSettings,
  MediaAsset,
  MediaReference,
  PublicSettings,
  SiteMediaSlot
} from '../../../core/services/admin-data.service';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

const EMPTY_SETTINGS: PublicSettings = {
  restaurantName: '',
  tagline: '',
  address: '',
  neighborhood: '',
  phone: '',
  email: '',
  openingHours: '',
  currency: 'FG',
  mapQuery: '',
  socialMedia: {},
  brand: {}
};

const SITE_MEDIA_SLOTS: Array<{ key: SiteMediaSlot; label: string; description: string }> = [
  { key: 'homeHero', label: 'Accueil', description: 'Image principale de la page d’accueil' },
  { key: 'menuHero', label: 'Menu', description: 'Couverture de la carte et des vins' },
  { key: 'reservationHero', label: 'Réservation', description: 'Couverture du parcours de réservation' },
  { key: 'aboutHero', label: 'À propos', description: 'Couverture histoire et équipe' },
  { key: 'contactHero', label: 'Contact', description: 'Couverture contact et accès' },
  { key: 'schoolHero', label: 'École', description: 'Couverture de l’école gastronomique' },
  { key: 'galleryHero', label: 'Galerie', description: 'Couverture de la galerie publique' },
  { key: 'cateringHero', label: 'Traiteur', description: 'Couverture du service traiteur' },
];

const SOCIAL_FIELDS = [
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/224...' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/...' },
] as const;

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 pb-28 animate-fade-in">
      <header class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-jacquier-gold">Configuration globale</p>
          <h1 class="mt-1 text-3xl font-serif font-bold text-white">Paramètres du site</h1>
          <p class="mt-2 max-w-3xl text-sm text-gray-400">
            Source unique des informations publiques, de l’identité visuelle, de la localisation et des réseaux sociaux.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" (click)="load()" [disabled]="loading() || saving()"
            class="rounded-xl border border-gray-700 px-4 py-3 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-50">
            Recharger
          </button>
          <a routerLink="/" target="_blank" rel="noopener"
            class="rounded-xl border border-jacquier-gold px-4 py-3 text-sm font-bold text-jacquier-gold hover:bg-jacquier-gold hover:text-jacquier-dark">
            Voir le site ↗
          </a>
          <button type="button" (click)="save()" [disabled]="loading() || saving() || !canSave()"
            class="rounded-xl bg-jacquier-gold px-5 py-3 text-sm font-bold text-jacquier-dark hover:bg-white disabled:opacity-50">
            {{ saving() ? 'Sauvegarde…' : 'Sauvegarder' }}
          </button>
        </div>
      </header>

      @if (errorMessage()) {
        <p class="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">{{ errorMessage() }}</p>
      }
      @if (successMessage()) {
        <p class="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200" role="status">{{ successMessage() }}</p>
      }

      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Complétude</p>
          <p class="mt-2 text-3xl font-bold text-white">{{ completionPercent() }}%</p>
          <p class="mt-1 text-xs text-gray-500">{{ completedCoreFields() }}/{{ coreFieldCount }} informations essentielles</p>
        </article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Réseaux actifs</p>
          <p class="mt-2 text-3xl font-bold text-white">{{ activeSocialCount() }}</p>
          <p class="mt-1 text-xs text-gray-500">liens publics configurés</p>
        </article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Couvertures</p>
          <p class="mt-2 text-3xl font-bold text-white">{{ configuredHeroCount() }}/{{ siteMediaSlots.length }}</p>
          <p class="mt-1 text-xs text-gray-500">visuels personnalisés</p>
        </article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500">État</p>
          <p class="mt-2 text-lg font-bold" [class.text-amber-300]="dirty()" [class.text-emerald-300]="!dirty()">
            {{ dirty() ? 'Modifications non enregistrées' : 'À jour' }}
          </p>
          <p class="mt-1 text-xs text-gray-500">{{ dirty() ? 'Pensez à sauvegarder avant de quitter.' : 'La configuration affichée est enregistrée.' }}</p>
        </article>
      </section>

      <section class="overflow-hidden rounded-2xl border border-jacquier-gold/30 bg-[#171717]">
        <div class="grid lg:grid-cols-[1.1fr_1fr]">
          <div class="p-6 md:p-8">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-jacquier-gold">Aperçu public</p>
            <h2 class="mt-2 font-serif text-3xl font-bold text-white">{{ settings.restaurantName || 'Le Jacquier' }}</h2>
            <p class="mt-3 max-w-xl text-sm leading-relaxed text-gray-400">
              {{ settings.tagline || 'Ajoutez ici la phrase de présentation principale du restaurant.' }}
            </p>
            <div class="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div class="rounded-xl border border-gray-800 bg-black/20 p-4">
                <p class="text-xs uppercase tracking-wider text-gray-500">Contact</p>
                <p class="mt-2 font-bold text-white">{{ settings.phone || 'Téléphone non renseigné' }}</p>
                <p class="mt-1 text-gray-400">{{ settings.email || 'E-mail non renseigné' }}</p>
              </div>
              <div class="rounded-xl border border-gray-800 bg-black/20 p-4">
                <p class="text-xs uppercase tracking-wider text-gray-500">Adresse & horaires</p>
                <p class="mt-2 font-bold text-white">{{ settings.neighborhood || 'Quartier' }}</p>
                <p class="mt-1 text-gray-400">{{ settings.openingHours || 'Horaires non renseignés' }}</p>
              </div>
            </div>
          </div>
          <div class="min-h-64 bg-[#101010] p-6 md:p-8">
            <p class="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">Identité active</p>
            <div class="flex min-h-40 items-center justify-center rounded-2xl border border-gray-800 bg-white/95 p-8">
              <img [src]="logoPreview().url" [alt]="logoPreview().altText" class="max-h-28 max-w-full object-contain" />
            </div>
          </div>
        </div>
      </section>

      @if (loading()) {
        <p class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-sm text-gray-400" role="status">
          Chargement de la configuration…
        </p>
      } @else {
        <section id="etablissement" class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6 md:p-8">
          <div class="border-b border-gray-800 pb-4">
            <h2 class="text-xl font-serif font-bold text-white">Établissement</h2>
            <p class="mt-1 text-sm text-gray-400">Nom commercial, message principal et devise utilisés sur le site.</p>
          </div>
          <div class="mt-6 grid gap-6 md:grid-cols-2">
            <label class="text-sm text-gray-300">Nom de l’enseigne *
              <input [ngModel]="settings.restaurantName" (ngModelChange)="patch('restaurantName', $event)" name="restaurantName"
                maxlength="120" required class="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3 text-white outline-none focus:ring-1 focus:ring-jacquier-gold" />
            </label>
            <label class="text-sm text-gray-300">Devise
              <input [ngModel]="settings.currency" (ngModelChange)="patch('currency', $event)" name="currency"
                maxlength="16" class="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3 text-white outline-none focus:ring-1 focus:ring-jacquier-gold" />
            </label>
            <label class="text-sm text-gray-300 md:col-span-2">Slogan / phrase d’accueil
              <textarea [ngModel]="settings.tagline" (ngModelChange)="patch('tagline', $event)" name="tagline"
                maxlength="240" rows="3" class="mt-2 w-full resize-y rounded-xl bg-gray-900 px-4 py-3 text-white outline-none focus:ring-1 focus:ring-jacquier-gold"
                placeholder="L’élégance de la fusion franco-guinéenne…"></textarea>
            </label>
          </div>
        </section>

        <section id="contact" class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6 md:p-8">
          <div class="border-b border-gray-800 pb-4">
            <h2 class="text-xl font-serif font-bold text-white">Contact & localisation</h2>
            <p class="mt-1 text-sm text-gray-400">Ces données alimentent directement Contact et le Footer.</p>
          </div>
          <div class="mt-6 grid gap-6 md:grid-cols-2">
            <label class="text-sm text-gray-300 md:col-span-2">Adresse *
              <input [ngModel]="settings.address" (ngModelChange)="patch('address', $event)" name="address"
                maxlength="300" class="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3 text-white" />
            </label>
            <label class="text-sm text-gray-300">Quartier / zone
              <input [ngModel]="settings.neighborhood" (ngModelChange)="patch('neighborhood', $event)" name="neighborhood"
                maxlength="120" placeholder="Kipé" class="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3 text-white" />
            </label>
            <label class="text-sm text-gray-300">Recherche Google Maps
              <input [ngModel]="settings.mapQuery" (ngModelChange)="patch('mapQuery', $event)" name="mapQuery"
                maxlength="300" placeholder="Le Jacquier, Kipé, Conakry" class="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3 text-white" />
              <span class="mt-1 block text-xs text-gray-500">Utilisée pour centrer la carte de la page Contact.</span>
            </label>
            <label class="text-sm text-gray-300">Téléphone *
              <input type="tel" [ngModel]="settings.phone" (ngModelChange)="patch('phone', $event)" name="phone"
                maxlength="64" class="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3 text-white" />
            </label>
            <label class="text-sm text-gray-300">E-mail *
              <input type="email" [ngModel]="settings.email" (ngModelChange)="patch('email', $event)" name="email"
                maxlength="254" class="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3 text-white" />
            </label>
            <label class="text-sm text-gray-300 md:col-span-2">Horaires d’ouverture *
              <input [ngModel]="settings.openingHours" (ngModelChange)="patch('openingHours', $event)" name="openingHours"
                maxlength="300" placeholder="Tous les jours de 12h à 23h" class="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3 text-white" />
            </label>
          </div>
        </section>

        <section id="reseaux" class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6 md:p-8">
          <div class="border-b border-gray-800 pb-4">
            <h2 class="text-xl font-serif font-bold text-white">Réseaux sociaux</h2>
            <p class="mt-1 text-sm text-gray-400">Seuls les liens renseignés seront affichés publiquement dans le Footer.</p>
          </div>
          <div class="mt-6 grid gap-5 md:grid-cols-2">
            @for (social of socialFields; track social.key) {
              <label class="text-sm text-gray-300">{{ social.label }}
                <input type="url" [ngModel]="socialValue(social.key)" (ngModelChange)="setSocial(social.key, $event)"
                  [name]="'social-' + social.key" [placeholder]="social.placeholder"
                  class="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3 text-white" />
              </label>
            }
          </div>
        </section>

        <section id="identite" class="rounded-2xl border border-jacquier-gold/30 bg-[#1a1a1a] p-6 md:p-8">
          <div class="flex flex-col gap-3 border-b border-gray-800 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 class="text-xl font-serif font-bold text-white">Identité visuelle</h2>
              <p class="mt-1 text-sm text-gray-400">Logo global du Header et du site public.</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <a routerLink="/admin/cms" class="rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold text-gray-300 hover:border-jacquier-gold hover:text-jacquier-gold">Ouvrir la Médiathèque</a>
              <label class="cursor-pointer rounded-xl border border-jacquier-gold/60 px-4 py-2 text-sm font-bold text-jacquier-gold hover:bg-jacquier-gold/10">
                {{ uploadingBrand() ? 'Import…' : 'Importer un logo' }}
                <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" [disabled]="uploadingBrand()" (change)="uploadLogo($event)" />
              </label>
            </div>
          </div>

          <div class="mt-6 grid gap-5 lg:grid-cols-[220px_1fr] lg:items-start">
            <div class="rounded-xl border border-gray-700 bg-white/95 p-5">
              <img [src]="logoPreview().url" [alt]="logoPreview().altText" class="h-20 w-full object-contain" />
            </div>
            <label class="grid gap-2 text-sm text-gray-300">Logo du site
              <select [ngModel]="selectedLogoId()" (ngModelChange)="setLogo($event)" name="logoMedia"
                class="rounded-xl bg-gray-900 px-4 py-3 text-white">
                <option value="">Logo de secours versionné dans Git</option>
                @for (asset of brandingAssets(); track asset.id) {
                  <option [value]="asset.id">{{ asset.title || asset.originalName }}</option>
                }
              </select>
              <span class="text-xs text-gray-500">PNG ou WebP transparent recommandé.</span>
            </label>
          </div>
        </section>

        <section id="couvertures" class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6 md:p-8">
          <div class="flex flex-col gap-3 border-b border-gray-800 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 class="text-xl font-serif font-bold text-white">Images de couverture</h2>
              <p class="mt-1 text-sm text-gray-400">Choisissez les images permanentes utilisées sur chaque page.</p>
            </div>
            <a routerLink="/admin/cms" class="text-sm font-bold text-jacquier-gold hover:text-white">Gérer les images dans la Médiathèque →</a>
          </div>

          <div class="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            @for (slot of siteMediaSlots; track slot.key) {
              <article class="overflow-hidden rounded-2xl border border-gray-800 bg-[#121212]">
                <div class="h-40 bg-gray-900">
                  @if (siteMediaPreview(slot.key); as preview) {
                    <img [src]="preview.url" [alt]="preview.altText" class="h-full w-full object-cover" />
                  } @else {
                    <div class="flex h-full items-center justify-center px-6 text-center text-xs text-gray-600">Visuel de secours du site</div>
                  }
                </div>
                <div class="space-y-3 p-4">
                  <div>
                    <p class="font-bold text-white">{{ slot.label }}</p>
                    <p class="mt-1 text-xs text-gray-500">{{ slot.description }}</p>
                  </div>
                  <select [ngModel]="selectedSiteMediaId(slot.key)" (ngModelChange)="setSiteMedia(slot.key, $event)"
                    [name]="slot.key" class="w-full rounded-lg bg-gray-900 px-3 py-2 text-sm text-white">
                    <option value="">Utiliser le visuel de secours</option>
                    @for (asset of heroAssets(); track asset.id) {
                      <option [value]="asset.id">{{ asset.title || asset.originalName }}</option>
                    }
                  </select>
                </div>
              </article>
            }
          </div>
        </section>
      }

      @if (dirty()) {
        <div class="fixed bottom-4 left-4 right-4 z-[80] md:left-[17.5rem] lg:right-10">
          <div class="mx-auto flex max-w-5xl flex-col gap-3 rounded-2xl border border-jacquier-gold/40 bg-[#151515]/95 p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-sm font-bold text-white">Modifications non enregistrées</p>
              <p class="text-xs text-gray-500">Sauvegardez pour publier ces changements sur le site visiteur.</p>
            </div>
            <div class="flex gap-2">
              <button type="button" (click)="discardChanges()" [disabled]="saving()"
                class="rounded-xl border border-gray-700 px-4 py-2 text-sm text-gray-300 disabled:opacity-50">Annuler les changements</button>
              <button type="button" (click)="save()" [disabled]="saving() || !canSave()"
                class="rounded-xl bg-jacquier-gold px-5 py-2 text-sm font-bold text-jacquier-dark disabled:opacity-50">
                {{ saving() ? 'Sauvegarde…' : 'Sauvegarder maintenant' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn .35s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminSettingsComponent {
  private readonly adminData = inject(AdminDataService);
  private readonly siteSettings = inject(SiteSettingsService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly uploadingBrand = signal(false);
  readonly dirty = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly mediaAssets = signal<MediaAsset[]>([]);

  readonly siteMediaSlots = SITE_MEDIA_SLOTS;
  readonly socialFields = SOCIAL_FIELDS;
  readonly coreFieldCount = 7;

  settings: PublicSettings = { ...EMPTY_SETTINGS };
  private savedSettings: PublicSettings = { ...EMPTY_SETTINGS };

  constructor() {
    void this.load();
  }

  brandingAssets(): MediaAsset[] {
    return this.mediaAssets().filter(asset => asset.category === 'branding');
  }

  heroAssets(): MediaAsset[] {
    return this.mediaAssets().filter(asset => asset.category === 'hero');
  }

  logoPreview(): MediaReference {
    return this.settings.brand?.logo ?? { url: '/brand/le-jacquier-logo.svg', altText: 'Logo Le Jacquier' };
  }

  siteMediaPreview(slot: SiteMediaSlot): MediaReference | undefined {
    return this.settings.brand?.siteMedia?.[slot];
  }

  selectedLogoId(): string {
    return this.settings.brand?.logo?.id ?? '';
  }

  selectedSiteMediaId(slot: SiteMediaSlot): string {
    return this.settings.brand?.siteMedia?.[slot]?.id ?? '';
  }

  socialValue(key: string): string {
    return this.settings.socialMedia?.[key] ?? '';
  }

  completedCoreFields(): number {
    const values = [
      this.settings.restaurantName,
      this.settings.address,
      this.settings.phone,
      this.settings.email,
      this.settings.openingHours,
      this.settings.neighborhood,
      this.settings.tagline,
    ];
    return values.filter(value => Boolean(value?.trim())).length;
  }

  completionPercent(): number {
    return Math.round((this.completedCoreFields() / this.coreFieldCount) * 100);
  }

  activeSocialCount(): number {
    return Object.values(this.settings.socialMedia ?? {}).filter(value => Boolean(value?.trim())).length;
  }

  configuredHeroCount(): number {
    return Object.keys(this.settings.brand?.siteMedia ?? {}).length;
  }

  canSave(): boolean {
    return Boolean(
      this.settings.restaurantName?.trim() &&
      this.settings.address?.trim() &&
      this.settings.phone?.trim() &&
      this.settings.email?.trim() &&
      this.settings.openingHours?.trim()
    );
  }

  patch(key: keyof PublicSettings, value: string): void {
    this.settings = { ...this.settings, [key]: value };
    this.markDirty();
  }

  setSocial(key: string, value: string): void {
    this.settings = {
      ...this.settings,
      socialMedia: { ...(this.settings.socialMedia ?? {}), [key]: value }
    };
    this.markDirty();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    try {
      const [settings, assets] = await Promise.all([
        this.adminData.getSettings(),
        this.adminData.getMediaAssets()
      ]);
      this.settings = this.normalizeSettings(settings);
      this.savedSettings = this.cloneSettings(this.settings);
      this.mediaAssets.set(assets);
      this.dirty.set(false);
    } catch {
      this.errorMessage.set('Impossible de charger les paramètres ou la Médiathèque. Réessayez dans un instant.');
    } finally {
      this.loading.set(false);
    }
  }

  discardChanges(): void {
    this.settings = this.cloneSettings(this.savedSettings);
    this.dirty.set(false);
    this.errorMessage.set('');
    this.successMessage.set('Les modifications locales ont été annulées.');
  }

  setLogo(id: string): void {
    this.setBrandReference('logo', id);
    this.markDirty();
  }

  setSiteMedia(slot: SiteMediaSlot, id: string): void {
    const brand = this.settings.brand ?? {};
    const siteMedia = { ...(brand.siteMedia ?? {}) };
    const asset = this.mediaAssets().find(candidate => candidate.id === id);

    if (asset) siteMedia[slot] = this.toReference(asset);
    else delete siteMedia[slot];

    this.settings = { ...this.settings, brand: { ...brand, siteMedia } };
    this.markDirty();
  }

  async uploadLogo(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    this.uploadingBrand.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    try {
      const asset = await this.adminData.uploadMediaAsset(file, {
        title: 'Logo principal',
        altText: `Logo ${this.settings.restaurantName?.trim() || 'Le Jacquier'}`,
        category: 'branding'
      });
      this.mediaAssets.update(items => [asset, ...items]);
      this.setLogo(asset.id);
      this.successMessage.set('Logo importé. Sauvegardez pour le publier.');
    } catch {
      this.errorMessage.set('Import impossible. Utilisez une image JPEG, PNG ou WebP de 5 Mo maximum.');
    } finally {
      this.uploadingBrand.set(false);
    }
  }

  async save(): Promise<void> {
    if (this.loading() || this.saving() || !this.canSave()) return;

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    try {
      const payload = this.buildPayload();
      await this.adminData.updateSettings(payload);
      this.settings = this.normalizeSettings(payload);
      this.savedSettings = this.cloneSettings(this.settings);
      this.dirty.set(false);
      await this.siteSettings.reload();
      this.successMessage.set('Configuration publiée. Le site visiteur utilise maintenant ces valeurs.');
    } catch {
      this.errorMessage.set('Impossible d’enregistrer les paramètres. Vérifiez les champs et les URLs des réseaux sociaux.');
    } finally {
      this.saving.set(false);
    }
  }

  private buildPayload(): PublicSettings {
    const brand = this.cleanBrand(this.settings.brand);
    const socialMedia = Object.fromEntries(
      Object.entries(this.settings.socialMedia ?? {})
        .map(([key, value]) => [key, value.trim()])
        .filter(([, value]) => Boolean(value))
    );

    return {
      restaurantName: this.settings.restaurantName?.trim(),
      tagline: this.settings.tagline?.trim(),
      address: this.settings.address?.trim(),
      neighborhood: this.settings.neighborhood?.trim(),
      phone: this.settings.phone?.trim(),
      email: this.settings.email?.trim(),
      openingHours: this.settings.openingHours?.trim(),
      currency: this.settings.currency?.trim() || 'FG',
      mapQuery: this.settings.mapQuery?.trim(),
      socialMedia,
      ...(brand ? { brand } : {})
    };
  }

  private normalizeSettings(settings: PublicSettings): PublicSettings {
    return {
      ...EMPTY_SETTINGS,
      ...settings,
      socialMedia: { ...(settings.socialMedia ?? {}) },
      brand: {
        ...(settings.brand ?? {}),
        siteMedia: { ...(settings.brand?.siteMedia ?? {}) }
      }
    };
  }

  private cloneSettings(settings: PublicSettings): PublicSettings {
    return JSON.parse(JSON.stringify(settings)) as PublicSettings;
  }

  private markDirty(): void {
    this.dirty.set(true);
    this.successMessage.set('');
  }

  private setBrandReference(kind: 'logo', id: string): void {
    const brand = this.settings.brand ?? {};
    const asset = this.mediaAssets().find(candidate => candidate.id === id);
    this.settings = {
      ...this.settings,
      brand: {
        ...brand,
        ...(asset ? { [kind]: this.toReference(asset) } : { [kind]: undefined })
      }
    };
  }

  private toReference(asset: MediaAsset): MediaReference {
    return { id: asset.id, url: asset.publicUrl, altText: asset.altText };
  }

  private cleanBrand(brand: BrandSettings | undefined): BrandSettings | undefined {
    if (!brand) return undefined;
    const siteMedia = Object.fromEntries(
      Object.entries(brand.siteMedia ?? {}).filter(([, value]) => Boolean(value))
    );
    return brand.logo || Object.keys(siteMedia).length
      ? {
          ...(brand.logo ? { logo: brand.logo } : {}),
          ...(Object.keys(siteMedia).length ? { siteMedia } : {})
        }
      : undefined;
  }
}
