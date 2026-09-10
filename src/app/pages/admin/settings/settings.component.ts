import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, BrandSettings, MediaAsset, MediaReference, PublicSettings, SiteMediaSlot } from '../../../core/services/admin-data.service';

const EMPTY_SETTINGS: PublicSettings = {
  restaurantName: '', address: '', phone: '', email: '', openingHours: '', currency: 'FG', brand: {}
};

const SITE_MEDIA_SLOTS: Array<{ key: SiteMediaSlot; label: string; fallback: string }> = [
  { key: 'homeHero', label: 'Accueil — image principale', fallback: 'Image d’ambiance de l’accueil' },
  { key: 'menuHero', label: 'Menu — couverture', fallback: 'Image d’ambiance du menu' },
  { key: 'reservationHero', label: 'Réservation — couverture', fallback: 'Image d’ambiance de réservation' },
  { key: 'aboutHero', label: 'À propos — couverture', fallback: 'Image d’ambiance à propos' },
  { key: 'contactHero', label: 'Contact — couverture', fallback: 'Image d’ambiance contact' },
  { key: 'schoolHero', label: 'École — couverture', fallback: 'Image d’ambiance école' },
  { key: 'galleryHero', label: 'Galerie — couverture', fallback: 'Image d’ambiance galerie' },
  { key: 'cateringHero', label: 'Traiteur — couverture', fallback: 'Image d’ambiance traiteur' },
];

@Component({
  selector: 'app-admin-settings', standalone: true, imports: [CommonModule, FormsModule], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 class="text-2xl font-serif font-bold text-white">Paramètres</h1><p class="mt-1 text-sm text-gray-400">Informations publiques et identité visuelle de l’établissement</p></div>
        <button type="button" (click)="save()" [disabled]="loading() || saving()" class="rounded-xl bg-jacquier-gold px-6 py-2 text-sm font-bold text-jacquier-dark shadow-lg shadow-jacquier-gold/20 transition-colors hover:bg-white disabled:opacity-60">{{ saving() ? 'Sauvegarde…' : 'Sauvegarder' }}</button>
      </div>

      @if (errorMessage()) { <p class="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">{{ errorMessage() }}</p> }
      @if (successMessage()) { <p class="rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200" role="status">{{ successMessage() }}</p> }

      <section class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6 md:p-8">
        <h2 class="border-b border-gray-800 pb-4 text-lg font-serif font-bold text-white">Informations de l’établissement</h2>
        @if (loading()) { <p class="py-8 text-sm text-gray-400" role="status">Chargement des paramètres…</p> } @else {
          <form (ngSubmit)="save()" class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <label class="text-sm text-gray-300">Nom de l’enseigne<input [(ngModel)]="settings.restaurantName" name="restaurantName" maxlength="120" required class="mt-2 w-full rounded-xl bg-gray-800 px-4 py-3 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
            <label class="text-sm text-gray-300">Devise<input [(ngModel)]="settings.currency" name="currency" maxlength="16" required class="mt-2 w-full rounded-xl bg-gray-800 px-4 py-3 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
            <label class="text-sm text-gray-300 md:col-span-2">Adresse<input [(ngModel)]="settings.address" name="address" maxlength="300" required class="mt-2 w-full rounded-xl bg-gray-800 px-4 py-3 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
            <label class="text-sm text-gray-300">E-mail de contact<input type="email" [(ngModel)]="settings.email" name="email" maxlength="254" required class="mt-2 w-full rounded-xl bg-gray-800 px-4 py-3 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
            <label class="text-sm text-gray-300">Téléphone<input type="tel" [(ngModel)]="settings.phone" name="phone" maxlength="64" required class="mt-2 w-full rounded-xl bg-gray-800 px-4 py-3 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
            <label class="text-sm text-gray-300 md:col-span-2">Horaires d’ouverture<input [(ngModel)]="settings.openingHours" name="openingHours" maxlength="300" required class="mt-2 w-full rounded-xl bg-gray-800 px-4 py-3 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
          </form>
        }
      </section>

      <section class="rounded-2xl border border-jacquier-gold/30 bg-[#1a1a1a] p-6 md:p-8">
        <div class="flex flex-col gap-3 border-b border-gray-800 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div><h2 class="text-lg font-serif font-bold text-white">Identité visuelle</h2><p class="mt-1 text-sm text-gray-400">Le logo et les images permanentes du site sont administrés ici.</p></div>
          <label class="cursor-pointer rounded-xl border border-jacquier-gold/60 px-4 py-2 text-sm font-bold text-jacquier-gold hover:bg-jacquier-gold/10">{{ uploadingBrand() ? 'Import…' : 'Importer un logo' }}<input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" [disabled]="uploadingBrand()" (change)="uploadLogo($event)" /></label>
        </div>
        @if (loading()) { <p class="py-8 text-sm text-gray-400" role="status">Chargement de la médiathèque…</p> } @else {
          <div class="mt-6 grid gap-5 lg:grid-cols-[180px_1fr] lg:items-start">
            <div class="rounded-xl border border-gray-700 bg-[#121212] p-4"><p class="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">Logo actif</p><img [src]="logoPreview().url" [alt]="logoPreview().altText" class="h-16 w-full object-contain object-left" /></div>
            <label class="grid gap-2 text-sm text-gray-300">Logo du site<select [ngModel]="selectedLogoId()" (ngModelChange)="setLogo($event)" name="logoMedia" class="rounded-xl bg-gray-800 px-4 py-3 text-white outline-none ring-jacquier-gold focus:ring-1"><option value="">Logo de secours versionné dans Git</option>@for (asset of brandingAssets(); track asset.id) { <option [value]="asset.id">{{ asset.title || asset.originalName }}</option> }</select><span class="text-xs text-gray-500">Les PNG et WebP transparents sont recommandés. Le logo de secours est conservé dans <code>public/brand</code>.</span></label>
          </div>

          <div class="mt-8"><h3 class="text-base font-serif font-bold text-white">Images permanentes</h3><p class="mt-1 text-sm text-gray-400">Choisissez les visuels de couverture. Sans sélection, le site conserve son visuel de secours.</p><div class="mt-4 grid gap-4 md:grid-cols-2">@for (slot of siteMediaSlots; track slot.key) { <label class="grid gap-2 rounded-xl border border-gray-800 bg-[#121212] p-4 text-sm text-gray-300"><span class="font-bold text-white">{{ slot.label }}</span><select [ngModel]="selectedSiteMediaId(slot.key)" (ngModelChange)="setSiteMedia(slot.key, $event)" [name]="slot.key" class="rounded-lg bg-gray-800 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1"><option value="">{{ slot.fallback }}</option>@for (asset of heroAssets(); track asset.id) { <option [value]="asset.id">{{ asset.title || asset.originalName }}</option> }</select></label> }</div></div>
        }
      </section>
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn .6s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`]
})
export class AdminSettingsComponent {
  private readonly adminData = inject(AdminDataService);
  readonly loading = signal(true); readonly saving = signal(false); readonly uploadingBrand = signal(false);
  readonly errorMessage = signal(''); readonly successMessage = signal(''); readonly mediaAssets = signal<MediaAsset[]>([]);
  readonly siteMediaSlots = SITE_MEDIA_SLOTS;
  settings: PublicSettings = { ...EMPTY_SETTINGS };

  constructor() { void this.load(); }

  brandingAssets(): MediaAsset[] { return this.mediaAssets().filter(asset => asset.category === 'branding'); }
  heroAssets(): MediaAsset[] { return this.mediaAssets().filter(asset => asset.category === 'hero'); }
  logoPreview(): MediaReference { return this.settings.brand?.logo ?? { url: '/brand/le-jacquier-logo.svg', altText: 'Logo Le Jacquier' }; }
  selectedLogoId(): string { return this.settings.brand?.logo?.id ?? ''; }
  selectedSiteMediaId(slot: SiteMediaSlot): string { return this.settings.brand?.siteMedia?.[slot]?.id ?? ''; }

  async load(): Promise<void> {
    this.loading.set(true); this.errorMessage.set('');
    try {
      const [settings, assets] = await Promise.all([this.adminData.getSettings(), this.adminData.getMediaAssets()]);
      this.settings = { ...EMPTY_SETTINGS, ...settings, brand: settings.brand ?? {} };
      this.mediaAssets.set(assets);
    } catch { this.errorMessage.set('Impossible de charger les paramètres ou la médiathèque. Réessayez dans un instant.'); }
    finally { this.loading.set(false); }
  }

  setLogo(id: string): void { this.setBrandReference('logo', id); }
  setSiteMedia(slot: SiteMediaSlot, id: string): void {
    const brand = this.settings.brand ?? {}; const siteMedia = { ...(brand.siteMedia ?? {}) };
    const asset = this.mediaAssets().find(candidate => candidate.id === id);
    if (asset) siteMedia[slot] = this.toReference(asset); else delete siteMedia[slot];
    this.settings = { ...this.settings, brand: { ...brand, siteMedia } };
  }

  async uploadLogo(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement; const file = input.files?.[0]; input.value = '';
    if (!file) return;
    this.uploadingBrand.set(true); this.errorMessage.set('');
    try {
      const asset = await this.adminData.uploadMediaAsset(file, { title: 'Logo principal', altText: `Logo ${this.settings.restaurantName?.trim() || 'Le Jacquier'}`, category: 'branding' });
      this.mediaAssets.update(items => [asset, ...items]); this.setLogo(asset.id);
      this.successMessage.set('Logo importé. Sauvegardez les paramètres pour le publier sur le site.');
    } catch { this.errorMessage.set('Import impossible. Utilisez une image JPEG, PNG ou WebP de 5 Mo maximum.'); }
    finally { this.uploadingBrand.set(false); }
  }

  async save(): Promise<void> {
    if (this.loading() || !this.settings.restaurantName?.trim() || !this.settings.email?.trim()) return;
    this.saving.set(true); this.errorMessage.set(''); this.successMessage.set('');
    try {
      const brand = this.cleanBrand(this.settings.brand);
      await this.adminData.updateSettings({ restaurantName: this.settings.restaurantName.trim(), address: this.settings.address?.trim(), phone: this.settings.phone?.trim(), email: this.settings.email.trim(), openingHours: this.settings.openingHours?.trim(), currency: this.settings.currency?.trim(), ...(brand ? { brand } : {}) });
      this.successMessage.set('Les informations publiques et l’identité visuelle ont été enregistrées.');
    } catch { this.errorMessage.set('Impossible d’enregistrer les paramètres. Vérifiez les valeurs saisies.'); }
    finally { this.saving.set(false); }
  }

  private setBrandReference(kind: 'logo', id: string): void {
    const brand = this.settings.brand ?? {}; const asset = this.mediaAssets().find(candidate => candidate.id === id);
    this.settings = { ...this.settings, brand: { ...brand, ...(asset ? { [kind]: this.toReference(asset) } : { [kind]: undefined }) } };
  }
  private toReference(asset: MediaAsset): MediaReference { return { id: asset.id, url: asset.publicUrl, altText: asset.altText }; }
  private cleanBrand(brand: BrandSettings | undefined): BrandSettings | undefined {
    if (!brand) return undefined;
    const siteMedia = Object.fromEntries(Object.entries(brand.siteMedia ?? {}).filter(([, value]) => Boolean(value)));
    return brand.logo || Object.keys(siteMedia).length ? { ...(brand.logo ? { logo: brand.logo } : {}), ...(Object.keys(siteMedia).length ? { siteMedia } : {}) } : undefined;
  }
}
