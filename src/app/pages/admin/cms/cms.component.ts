import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, MediaAsset, MediaCategory } from '../../../core/services/admin-data.service';

const CATEGORIES: Array<{ value: MediaCategory; label: string }> = [
  { value: 'branding', label: 'Identité visuelle' }, { value: 'hero', label: 'Images permanentes' },
  { value: 'menu', label: 'Plats' }, { value: 'wines', label: 'Vins' },
  { value: 'gallery', label: 'Galerie publique' }, { value: 'team', label: 'Équipe' },
];

@Component({
  selector: 'app-admin-cms', standalone: true, imports: [CommonModule, FormsModule], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 class="text-2xl font-serif font-bold text-white">Médiathèque</h1><p class="mt-1 text-sm text-gray-400">Importez, décrivez et réutilisez les images du site.</p></div>
        <button type="button" (click)="showForm.set(!showForm())" class="rounded-xl bg-jacquier-gold px-4 py-2 text-sm font-bold text-jacquier-dark transition-colors hover:bg-white">{{ showForm() ? 'Fermer' : 'Importer une image' }}</button>
      </div>
      <p class="rounded-xl border border-gray-800 bg-[#1a1a1a] px-4 py-3 text-sm text-gray-400">Formats autorisés : JPEG, PNG et WebP, 5 Mo maximum. Le texte alternatif est obligatoire pour rendre les images accessibles. Les fichiers restent dans Supabase Storage ; cette page gère leur fiche d’utilisation.</p>

      @if (errorMessage()) { <p class="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">{{ errorMessage() }}</p> }
      @if (successMessage()) { <p class="rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200" role="status">{{ successMessage() }}</p> }

      @if (showForm()) {
        <form (ngSubmit)="upload()" class="grid gap-4 rounded-2xl border border-jacquier-gold/30 bg-[#1a1a1a] p-6 md:grid-cols-2">
          <h2 class="text-lg font-serif font-bold text-white md:col-span-2">Nouvelle image</h2>
          <label class="text-sm text-gray-300 md:col-span-2">Fichier image<input type="file" accept="image/jpeg,image/png,image/webp" required (change)="selectFile($event)" class="mt-2 block w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-jacquier-gold file:px-3 file:py-2 file:text-sm file:font-bold file:text-jacquier-dark" />@if (selectedFileName()) { <span class="mt-2 block text-xs text-gray-500">{{ selectedFileName() }}</span> }</label>
          <label class="text-sm text-gray-300">Titre interne<input [(ngModel)]="title" name="title" maxlength="200" placeholder="Ex. Logo principal" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
          <label class="text-sm text-gray-300">Zone d’utilisation<select [(ngModel)]="category" name="category" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1">@for (item of categories; track item.value) { <option [value]="item.value">{{ item.label }}</option> }</select></label>
          <label class="text-sm text-gray-300 md:col-span-2">Texte alternatif <span class="text-red-300">*</span><input [(ngModel)]="altText" name="altText" maxlength="200" required placeholder="Décrivez l’image pour les lecteurs d’écran" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
          <div class="flex justify-end md:col-span-2"><button type="submit" [disabled]="saving() || !selectedFile() || !altText.trim()" class="rounded-xl border border-jacquier-gold/50 px-4 py-2 text-sm font-bold text-jacquier-gold hover:bg-jacquier-gold/10 disabled:opacity-60">{{ saving() ? 'Import…' : 'Importer dans la médiathèque' }}</button></div>
        </form>
      }

      @if (loading()) { <p class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-10 text-center text-sm text-gray-400" role="status">Chargement de la médiathèque…</p> } @else if (!media().length) { <p class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-10 text-center text-sm text-gray-400">Aucune image n’est encore enregistrée.</p> } @else {
        <section class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">@for (item of media(); track item.id) {
          <article class="overflow-hidden rounded-2xl border border-gray-800 bg-[#1a1a1a]"><img [src]="item.publicUrl" [alt]="item.altText" class="h-48 w-full object-cover" /><div class="space-y-2 p-4"><p class="truncate text-sm font-bold text-white">{{ item.title || item.originalName }}</p><p class="text-xs text-gray-500">{{ categoryLabel(item.category) }} · {{ formatDate(item.createdAt) }}</p><p class="line-clamp-2 text-xs text-gray-400">{{ item.altText }}</p>@if (pendingDeleteId() === item.id) { <div class="flex gap-2 pt-2"><button type="button" (click)="delete(item)" [disabled]="saving()" class="rounded-lg bg-red-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-60">Confirmer</button><button type="button" (click)="pendingDeleteId.set(null)" class="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300">Annuler</button></div> } @else { <button type="button" (click)="pendingDeleteId.set(item.id)" [attr.aria-label]="'Supprimer ' + (item.title || item.originalName)" class="pt-2 text-xs font-bold text-red-300 hover:text-red-200">Supprimer</button> }</div></article>
        }</section>
      }
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`]
})
export class CMSComponent {
  private readonly adminData = inject(AdminDataService);
  readonly media = signal<MediaAsset[]>([]); readonly loading = signal(true); readonly saving = signal(false);
  readonly showForm = signal(false); readonly pendingDeleteId = signal<string | null>(null); readonly errorMessage = signal(''); readonly successMessage = signal('');
  readonly selectedFile = signal<File | null>(null); readonly selectedFileName = signal(''); readonly categories = CATEGORIES;
  title = ''; altText = ''; category: MediaCategory = 'gallery';

  constructor() { void this.load(); }
  async load(): Promise<void> { this.loading.set(true); this.errorMessage.set(''); try { this.media.set(await this.adminData.getMediaAssets()); } catch { this.errorMessage.set('Impossible de charger la médiathèque. Réessayez dans un instant.'); } finally { this.loading.set(false); } }
  selectFile(event: Event): void { const file = (event.target as HTMLInputElement).files?.[0] ?? null; this.selectedFile.set(file); this.selectedFileName.set(file ? `${file.name} · ${Math.ceil(file.size / 1024)} Ko` : ''); }
  async upload(): Promise<void> {
    const file = this.selectedFile(); if (!file || !this.altText.trim()) return;
    this.saving.set(true); this.errorMessage.set(''); this.successMessage.set('');
    try {
      const asset = await this.adminData.uploadMediaAsset(file, { title: this.title.trim(), altText: this.altText.trim(), category: this.category });
      this.media.update(items => [asset, ...items]);
      if (asset.category === 'gallery') await this.adminData.createGalleryMedia({ imageUrl: asset.publicUrl, title: asset.title, category: 'gallery' });
      this.title = ''; this.altText = ''; this.category = 'gallery'; this.selectedFile.set(null); this.selectedFileName.set(''); this.showForm.set(false);
      this.successMessage.set(asset.category === 'gallery' ? 'Image importée et publiée dans la galerie.' : 'Image importée dans la médiathèque.');
    } catch { this.errorMessage.set('Import impossible. Vérifiez le format, la taille et le texte alternatif.'); }
    finally { this.saving.set(false); }
  }
  async delete(item: MediaAsset): Promise<void> { this.saving.set(true); this.errorMessage.set(''); try { await this.adminData.deleteMediaAsset(item.id); this.media.update(items => items.filter(candidate => candidate.id !== item.id)); this.pendingDeleteId.set(null); } catch { this.errorMessage.set('Suppression impossible : cette image est peut-être utilisée par le site.'); } finally { this.saving.set(false); } }
  categoryLabel(category: MediaCategory): string { return CATEGORIES.find(item => item.value === category)?.label ?? category; }
  formatDate(value: string): string { return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value)); }
}
