import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from '@uppy/angular';
import Uppy from '@uppy/core';
import type { DashboardOptions } from '@uppy/dashboard';
import French from '@uppy/locales/lib/fr_FR';
import { AdminDataService, GalleryMedia, MediaAsset, MediaCategory, MediaTag, MediaUsage } from '../../../core/services/admin-data.service';

const CATEGORIES: Array<{ value: MediaCategory; label: string }> = [
  { value: 'branding', label: 'Identité visuelle' }, { value: 'hero', label: 'Images permanentes' },
  { value: 'menu', label: 'Plats' }, { value: 'wines', label: 'Vins' },
  { value: 'gallery', label: 'Galerie publique' }, { value: 'team', label: 'Équipe' },
];

type UploadDraft = { id: string; file: File; title: string; altText: string };
type EditDraft = { title: string; altText: string; category: MediaCategory };

@Component({
  selector: 'app-admin-cms', standalone: true, imports: [CommonModule, FormsModule, DashboardComponent], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 class="text-2xl font-serif font-bold text-white">Médiathèque globale</h1><p class="mt-1 text-sm text-gray-400">Centralisez, classez et réutilisez toutes les images du site.</p></div>
        <button type="button" (click)="showForm.set(!showForm())" class="rounded-xl bg-jacquier-gold px-4 py-2 text-sm font-bold text-jacquier-dark transition-colors hover:bg-white">{{ showForm() ? 'Fermer' : 'Importer des images' }}</button>
      </div>
      <p class="rounded-xl border border-gray-800 bg-[#1a1a1a] px-4 py-3 text-sm text-gray-400">JPEG, PNG ou WebP, 5 Mo maximum par image. Vous pouvez sélectionner jusqu’à 20 fichiers. La zone indique où l’image peut être utilisée ; les tags servent au classement et à la recherche.</p>

      @if (errorMessage()) { <p class="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">{{ errorMessage() }}</p> }
      @if (successMessage()) { <p class="rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200" role="status">{{ successMessage() }}</p> }

      @if (showForm()) {
        <form (ngSubmit)="uploadAll()" class="space-y-5 rounded-2xl border border-jacquier-gold/30 bg-[#1a1a1a] p-6">
          <h2 class="text-lg font-serif font-bold text-white">Nouvel import</h2>
          <div class="uppy-shell" aria-label="Sélection des images">
            <uppy-dashboard [uppy]="uppy" [props]="uppyProps"></uppy-dashboard>
          </div>
          <label class="block text-sm text-gray-300">Zone d’utilisation du lot
            <select [(ngModel)]="uploadCategory" name="uploadCategory" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none ring-jacquier-gold focus:ring-1">@for (item of categories; track item.value) { <option [value]="item.value">{{ item.label }}</option> }</select>
            <span class="mt-1 block text-xs text-gray-500">Cette zone sera appliquée à toutes les images de cet import.</span>
            @if (uploadCategory === 'gallery') { <span class="mt-1 block text-xs font-semibold text-emerald-300">Les images seront aussi publiées automatiquement dans la galerie publique.</span> }
          </label>

          @if (uploadDrafts().length) {
            <div class="space-y-3">
              <p class="text-sm font-bold text-white">{{ uploadDrafts().length }} image(s) sélectionnée(s)</p>
              @for (draft of uploadDrafts(); track draft.id) {
                <div class="grid gap-3 rounded-xl border border-gray-800 bg-gray-900/70 p-4 md:grid-cols-2">
                  <div class="flex items-center justify-between gap-3 md:col-span-2">
                    <p class="min-w-0 truncate text-xs text-gray-400">{{ draft.file.name }} · {{ fileSize(draft.file.size) }}</p>
                    <button type="button" (click)="removeUploadDraft(draft.id)" [disabled]="saving()" class="shrink-0 text-xs font-bold text-red-300 hover:text-red-200 disabled:opacity-50">Retirer</button>
                  </div>
                  <label class="text-xs text-gray-300">Titre<input [(ngModel)]="draft.title" [name]="'title-' + $index" maxlength="200" class="mt-1 w-full rounded-lg bg-black/30 px-3 py-2 text-white" /></label>
                  <label class="text-xs text-gray-300">Texte alternatif *<input [(ngModel)]="draft.altText" [name]="'alt-' + $index" maxlength="200" required class="mt-1 w-full rounded-lg bg-black/30 px-3 py-2 text-white" /></label>
                </div>
              }
            </div>
          }

          <fieldset class="space-y-2"><legend class="text-sm font-bold text-white">Tags appliqués à tout le lot</legend>
            <div class="flex flex-wrap gap-2">@for (tag of tags(); track tag.id) {
              <label class="cursor-pointer rounded-full border px-3 py-2 text-xs" [class.border-jacquier-gold]="uploadTagIds().includes(tag.id)" [class.text-jacquier-gold]="uploadTagIds().includes(tag.id)" [class.border-gray-700]="!uploadTagIds().includes(tag.id)" [class.text-gray-300]="!uploadTagIds().includes(tag.id)">
                <input type="checkbox" class="sr-only" [checked]="uploadTagIds().includes(tag.id)" (change)="toggleUploadTag(tag.id)" />{{ tag.name }}
              </label>
            }</div>
          </fieldset>
          <div class="sticky bottom-3 z-20 flex flex-col gap-3 rounded-2xl border border-jacquier-gold/30 bg-[#111111]/95 p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
              @if (missingAltCount()) { <p class="text-xs font-semibold text-amber-300">{{ missingAltCount() }} texte(s) alternatif(s) à compléter avant l’import.</p> }
              @else if (uploadDrafts().length) { <p class="text-xs text-emerald-300">Les informations obligatoires sont complètes.</p> }
              @else { <p class="text-xs text-gray-500">Sélectionnez au moins une image à importer.</p> }
            </div>
            <div class="flex flex-wrap justify-end gap-2">
              <button type="button" (click)="cancelUpload()" [disabled]="saving()" class="rounded-xl border border-gray-700 px-4 py-3 text-sm font-bold text-gray-200 hover:border-white disabled:opacity-50">Annuler</button>
              <button type="submit" [disabled]="saving() || !canUpload()" class="rounded-xl bg-jacquier-gold px-5 py-3 text-sm font-bold text-jacquier-dark shadow-lg shadow-black/20 hover:bg-white disabled:opacity-50">{{ saving() ? 'Import ' + uploadProgress() + '/' + (uploadProgress() + uploadDrafts().length) : 'Importer les images' }}</button>
            </div>
          </div>
        </form>
      }

      <section class="grid gap-4 rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5 lg:grid-cols-[2fr_1fr_1fr]" aria-label="Filtres de la médiathèque">
        <label class="text-sm text-gray-300">Recherche<input type="search" [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="Titre, fichier, description ou tag…" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white" /></label>
        <label class="text-sm text-gray-300">Zone<select [ngModel]="categoryFilter()" (ngModelChange)="categoryFilter.set($event)" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white"><option value="all">Toutes les zones</option>@for (item of categories; track item.value) { <option [value]="item.value">{{ item.label }}</option> }</select></label>
        <label class="text-sm text-gray-300">Tag<select [ngModel]="tagFilter()" (ngModelChange)="tagFilter.set($event)" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white"><option value="all">Tous les tags</option><option value="none">Sans tag</option>@for (tag of tags(); track tag.id) { <option [value]="tag.id">{{ tag.name }}</option> }</select></label>
      </section>

      <section class="flex flex-col gap-3 rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5 sm:flex-row sm:items-end" aria-labelledby="tags-title">
        <label class="flex-1 text-sm text-gray-300"><span id="tags-title" class="font-bold text-white">Créer un tag</span><input [(ngModel)]="newTagName" maxlength="40" placeholder="Ex. brunch, cérémonie, saison sèche" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white" /></label>
        <button type="button" (click)="createTag()" [disabled]="savingTag() || !newTagName.trim()" class="rounded-xl border border-jacquier-gold px-4 py-3 text-sm font-bold text-jacquier-gold disabled:opacity-50">{{ savingTag() ? 'Création…' : 'Ajouter le tag' }}</button>
      </section>

      <p class="text-sm text-gray-400">{{ filteredMedia().length }} image(s) affichée(s) sur {{ media().length }}</p>
      @if (loading()) { <p class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-10 text-center text-sm text-gray-400" role="status">Chargement de la médiathèque…</p> }
      @else if (!filteredMedia().length) { <p class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-10 text-center text-sm text-gray-400">Aucune image ne correspond à ces filtres.</p> }
      @else {
        <section class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">@for (item of filteredMedia(); track item.id) {
          <article class="overflow-hidden rounded-2xl border border-gray-800 bg-[#1a1a1a]">
            <button type="button" (click)="previewItem.set(item)" class="block w-full" [attr.aria-label]="'Agrandir ' + (item.title || item.originalName)">
              <img [src]="item.publicUrl" [alt]="item.altText" class="h-48 w-full object-cover transition-opacity hover:opacity-90" />
            </button>
            <div class="space-y-3 p-4">
              @if (editingId() === item.id) {
                <div class="space-y-3 rounded-xl border border-jacquier-gold/30 bg-black/20 p-3">
                  <label class="block text-xs text-gray-300">Titre
                    <input [(ngModel)]="editDraft.title" maxlength="200" class="mt-1 w-full rounded-lg bg-gray-900 px-3 py-2 text-white" />
                  </label>
                  <label class="block text-xs text-gray-300">Texte alternatif *
                    <input [(ngModel)]="editDraft.altText" maxlength="200" class="mt-1 w-full rounded-lg bg-gray-900 px-3 py-2 text-white" />
                  </label>
                  <label class="block text-xs text-gray-300">Zone
                    <select [(ngModel)]="editDraft.category" class="mt-1 w-full rounded-lg bg-gray-900 px-3 py-2 text-white">
                      @for (category of categories; track category.value) { <option [value]="category.value">{{ category.label }}</option> }
                    </select>
                  </label>
                  <div class="flex justify-end gap-2">
                    <button type="button" (click)="cancelEdit()" class="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300">Annuler</button>
                    <button type="button" (click)="saveEdit(item)" [disabled]="savingAssetId() === item.id || !editDraft.altText.trim()" class="rounded-lg bg-jacquier-gold px-3 py-2 text-xs font-bold text-jacquier-dark disabled:opacity-50">Enregistrer</button>
                  </div>
                </div>
              } @else {
                <div>
                  <div class="flex items-start justify-between gap-3">
                    <p class="truncate text-sm font-bold text-white">{{ item.title || item.originalName }}</p>
                    @if (galleryEntry(item)) { <span class="shrink-0 rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-bold text-emerald-300">Galerie publiée</span> }
                  </div>
                  <p class="text-xs text-gray-500">{{ categoryLabel(item.category) }} · {{ formatDate(item.createdAt) }} · {{ mimeLabel(item.mimeType) }} · {{ fileSize(item.sizeBytes) }}</p>
                </div>
                <p class="line-clamp-2 text-xs text-gray-400">{{ item.altText }}</p>
              }

              <div class="flex flex-wrap gap-1">@for (tag of item.tags; track tag.id) { <span class="rounded-full bg-jacquier-gold/10 px-2 py-1 text-xs text-jacquier-gold">{{ tag.name }}</span> } @empty { <span class="text-xs text-gray-600">Sans tag</span> }</div>

              <details class="rounded-xl border border-gray-800 p-3">
                <summary class="cursor-pointer text-xs font-bold text-gray-300">Tags</summary>
                <div class="mt-3 flex flex-wrap gap-2">@for (tag of tags(); track tag.id) {
                  <label class="cursor-pointer rounded-full border border-gray-700 px-2 py-1 text-xs text-gray-300"><input type="checkbox" class="mr-1" [checked]="hasTag(item, tag.id)" (change)="toggleAssetTag(item, tag.id)" [disabled]="savingAssetId() === item.id" />{{ tag.name }}</label>
                }</div>
              </details>

              <details class="rounded-xl border border-gray-800 p-3" (toggle)="onUsageToggle(item, $event)">
                <summary class="cursor-pointer text-xs font-bold text-gray-300">Utilisations</summary>
                <div class="mt-3 space-y-1 text-xs text-gray-400">
                  @if (usageLoadingId() === item.id) { <p>Vérification…</p> }
                  @else if (assetUsages(item.id); as usages) {
                    @if (usages.length) { @for (usage of usages; track usage.label) { <p>• {{ usage.label }}</p> } }
                    @else { <p>Cette image n’est actuellement utilisée nulle part.</p> }
                  } @else { <p>Ouvrez ce volet pour vérifier.</p> }
                </div>
              </details>

              <div class="flex flex-wrap gap-2 border-t border-gray-800 pt-3">
                <button type="button" (click)="startEdit(item)" class="text-xs font-bold text-white hover:text-jacquier-gold">Modifier</button>
                <button type="button" (click)="toggleGallery(item)" [disabled]="savingAssetId() === item.id" class="text-xs font-bold text-emerald-300 hover:text-white disabled:opacity-50">{{ galleryEntry(item) ? 'Dépublier Galerie' : 'Publier Galerie' }}</button>
                <button type="button" (click)="copyUrl(item)" class="text-xs font-bold text-gray-300 hover:text-white">Copier l’URL</button>
                <button type="button" (click)="download(item)" [disabled]="downloadingId() === item.id" class="text-xs font-bold text-jacquier-gold hover:text-white disabled:opacity-50">{{ downloadingId() === item.id ? 'Téléchargement…' : 'Télécharger' }}</button>
              </div>

              @if (pendingDeleteId() === item.id) {
                <div class="flex flex-wrap items-center justify-end gap-2 rounded-lg border border-red-900/50 p-2">
                  <span class="text-xs text-red-200">Supprimer définitivement ?</span>
                  <button type="button" (click)="delete(item)" [disabled]="saving()" class="rounded-lg bg-red-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-60">Confirmer</button>
                  <button type="button" (click)="pendingDeleteId.set(null)" class="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300">Annuler</button>
                </div>
              } @else {
                <button type="button" (click)="prepareDelete(item)" [attr.aria-label]="'Supprimer ' + (item.title || item.originalName)" class="text-xs font-bold text-red-300 hover:text-red-200">Supprimer</button>
              }
            </div>
          </article>
        }</section>
      }

      @if (previewItem(); as preview) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" role="dialog" aria-modal="true" [attr.aria-label]="'Aperçu de ' + (preview.title || preview.originalName)" (click)="previewItem.set(null)">
          <div class="max-h-[92vh] max-w-6xl" (click)="$event.stopPropagation()">
            <div class="mb-3 flex items-center justify-between gap-4 text-white">
              <div><p class="font-bold">{{ preview.title || preview.originalName }}</p><p class="text-xs text-gray-400">{{ mimeLabel(preview.mimeType) }} · {{ fileSize(preview.sizeBytes) }}</p></div>
              <button type="button" (click)="previewItem.set(null)" class="rounded-lg border border-gray-600 px-3 py-2 text-sm">Fermer</button>
            </div>
            <img [src]="preview.publicUrl" [alt]="preview.altText" class="max-h-[82vh] max-w-full rounded-xl object-contain" />
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
    .uppy-shell { width: 100%; overflow: hidden; border-radius: 1rem; }
    .uppy-shell ::ng-deep .uppy-Dashboard { width: 100%; }
    .uppy-shell ::ng-deep .uppy-Dashboard-inner { width: 100% !important; max-width: none !important; border-color: rgb(55 65 81); background: rgb(17 24 39); }
    .uppy-shell ::ng-deep .uppy-Dashboard-AddFiles { border-color: rgb(75 85 99); }
    .uppy-shell ::ng-deep .uppy-Dashboard-AddFiles-title,
    .uppy-shell ::ng-deep .uppy-Dashboard-dropFilesHereHint { color: rgb(209 213 219); }
    .uppy-shell ::ng-deep .uppy-Dashboard-browse { color: #d4af37; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class CMSComponent implements OnDestroy {
  private readonly adminData = inject(AdminDataService);
  readonly media = signal<MediaAsset[]>([]); readonly tags = signal<MediaTag[]>([]); readonly gallery = signal<GalleryMedia[]>([]);
  readonly loading = signal(true); readonly saving = signal(false); readonly savingTag = signal(false);
  readonly showForm = signal(false); readonly pendingDeleteId = signal<string | null>(null);
  readonly editingId = signal<string | null>(null); readonly previewItem = signal<MediaAsset | null>(null);
  readonly usageLoadingId = signal<string | null>(null); readonly usageByAsset = signal<Record<string, MediaUsage[]>>({});
  readonly savingAssetId = signal<string | null>(null); readonly downloadingId = signal<string | null>(null);
  readonly errorMessage = signal(''); readonly successMessage = signal('');
  readonly uploadDrafts = signal<UploadDraft[]>([]); readonly uploadTagIds = signal<string[]>([]); readonly uploadProgress = signal(0);
  readonly query = signal(''); readonly categoryFilter = signal('all'); readonly tagFilter = signal('all');
  readonly categories = CATEGORIES;
  readonly uppy = new Uppy({
    autoProceed: false,
    locale: French,
    restrictions: {
      maxNumberOfFiles: 20,
      maxFileSize: 5 * 1024 * 1024,
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
  });
  readonly uppyProps: DashboardOptions<Record<string, never>, Record<string, unknown>> = {
    inline: true,
    height: 360,
    hideUploadButton: true,
    proudlyDisplayPoweredByUppy: false,
    theme: 'dark',
    note: 'JPEG, PNG ou WebP · 5 Mo maximum · 20 images maximum',
  };
  uploadCategory: MediaCategory = 'menu'; newTagName = '';
  editDraft: EditDraft = { title: '', altText: '', category: 'menu' };
  readonly filteredMedia = computed(() => {
    const query = this.normalize(this.query()); const category = this.categoryFilter(); const tag = this.tagFilter();
    return this.media().filter(item => {
      const searchable = this.normalize(`${item.title} ${item.originalName} ${item.altText} ${item.tags.map(value => value.name).join(' ')}`);
      return (!query || searchable.includes(query)) && (category === 'all' || item.category === category)
        && (tag === 'all' || (tag === 'none' ? !item.tags.length : item.tags.some(value => value.id === tag)));
    });
  });

  constructor() {
    this.uppy.on('file-added', file => {
      const selectedFile = file.data as File;
      const label = this.fileLabel(selectedFile.name);
      this.uploadDrafts.update(drafts => [...drafts, {
        id: file.id,
        file: selectedFile,
        title: label,
        altText: label,
      }]);
    });
    this.uppy.on('file-removed', file => this.uploadDrafts.update(drafts => drafts.filter(draft => draft.id !== file.id)));
    this.uppy.on('restriction-failed', (_file, error) => this.errorMessage.set(error.message));
    void this.load();
  }
  ngOnDestroy(): void { this.uppy.destroy(); }
  async load(): Promise<void> {
    this.loading.set(true); this.errorMessage.set('');
    try {
      const [media, tags, gallery] = await Promise.all([
        this.adminData.getMediaAssets(), this.adminData.getMediaTags(), this.adminData.getGalleryMedia()
      ]);
      this.media.set(media); this.tags.set(tags); this.gallery.set(gallery);
    }
    catch { this.errorMessage.set('Impossible de charger la médiathèque. Réessayez dans un instant.'); }
    finally { this.loading.set(false); }
  }
  missingAltCount(): number { return this.uploadDrafts().filter(draft => !draft.altText.trim()).length; }
  canUpload(): boolean {
    return this.uploadDrafts().length > 0 && this.missingAltCount() === 0;
  }
  removeUploadDraft(id: string): void { this.uppy.removeFile(id); }
  cancelUpload(): void {
    if (this.saving()) return;
    this.uppy.clear();
    this.uploadTagIds.set([]);
    this.uploadProgress.set(0);
    this.showForm.set(false);
    this.errorMessage.set('');
  }
  toggleUploadTag(id: string) { this.uploadTagIds.update(ids => ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id]); }
  async uploadAll(): Promise<void> {
    const drafts = [...this.uploadDrafts()];
    if (!this.canUpload() || this.saving()) return;

    this.saving.set(true); this.uploadProgress.set(0); this.errorMessage.set(''); this.successMessage.set('');
    const created: MediaAsset[] = [];
    try {
      for (const draft of drafts) {
        let asset: MediaAsset | undefined;
        try {
          asset = await this.adminData.uploadMediaAsset(draft.file, {
            title: draft.title.trim(), altText: draft.altText.trim(),
            category: this.uploadCategory, tagIds: this.uploadTagIds()
          });

          if (asset.category === 'gallery') {
            const galleryItem = await this.adminData.createGalleryMedia({
              imageUrl: asset.publicUrl, title: asset.title, category: 'gallery'
            });
            this.gallery.update(items => [galleryItem, ...items]);
          }

          created.push(asset);
          this.uploadProgress.update(value => value + 1);
          this.uppy.removeFile(draft.id);
        } catch (error) {
          if (asset) {
            try { await this.adminData.deleteMediaAsset(asset.id); } catch { /* cleanup best effort */ }
          }
          throw error;
        }
      }

      this.media.update(items => [...created.slice().reverse(), ...items]);
      this.uploadTagIds.set([]); this.showForm.set(false);
      this.successMessage.set(`${created.length} image(s) importée(s)${this.uploadCategory === 'gallery' ? ' et publiée(s) dans la galerie' : ''}.`);
    } catch {
      if (created.length) this.media.update(items => [...created.slice().reverse(), ...items]);
      this.errorMessage.set(
        `Import interrompu après ${created.length} image(s). Les images déjà terminées ont été retirées de la sélection ; vous pouvez corriger puis relancer uniquement les fichiers restants.`
      );
    } finally {
      this.saving.set(false);
    }
  }
  async createTag(): Promise<void> {
    const name = this.newTagName.trim(); if (!name || this.savingTag()) return;
    this.savingTag.set(true); this.errorMessage.set('');
    try { const tag = await this.adminData.createMediaTag(name); this.tags.update(tags => [...tags, tag].sort((a, b) => a.name.localeCompare(b.name, 'fr'))); this.newTagName = ''; }
    catch { this.errorMessage.set('Ce tag existe déjà ou son nom n’est pas valide.'); }
    finally { this.savingTag.set(false); }
  }
  galleryEntry(item: MediaAsset): GalleryMedia | undefined { return this.gallery().find(entry => entry.imageUrl === item.publicUrl); }
  assetUsages(id: string): MediaUsage[] | undefined { return this.usageByAsset()[id]; }
  mimeLabel(value: string): string { return value.replace('image/', '').toUpperCase(); }

  startEdit(item: MediaAsset): void {
    this.editingId.set(item.id);
    this.editDraft = { title: item.title, altText: item.altText, category: item.category };
    this.errorMessage.set(''); this.successMessage.set('');
  }
  cancelEdit(): void { this.editingId.set(null); }
  async saveEdit(item: MediaAsset): Promise<void> {
    if (this.savingAssetId() || !this.editDraft.altText.trim()) return;
    this.savingAssetId.set(item.id); this.errorMessage.set(''); this.successMessage.set('');
    try {
      const updated = await this.adminData.updateMediaAsset(item.id, {
        title: this.editDraft.title.trim(), altText: this.editDraft.altText.trim(), category: this.editDraft.category
      });
      this.media.update(items => items.map(value => value.id === item.id ? updated : value));
      const published = this.galleryEntry(item);
      if (published && published.title !== updated.title) {
        await this.adminData.deleteGalleryMedia(published.id);
        const replacement = await this.adminData.createGalleryMedia({ imageUrl: updated.publicUrl, title: updated.title, category: 'gallery' });
        this.gallery.update(items => [replacement, ...items.filter(value => value.id !== published.id)]);
      }
      this.editingId.set(null); this.successMessage.set('Les informations de l’image ont été mises à jour.');
    } catch { this.errorMessage.set('Impossible de modifier cette image. Vérifiez le titre, le texte alternatif et la zone.'); }
    finally { this.savingAssetId.set(null); }
  }

  async toggleGallery(item: MediaAsset): Promise<void> {
    if (this.savingAssetId()) return;
    this.savingAssetId.set(item.id); this.errorMessage.set(''); this.successMessage.set('');
    try {
      const published = this.galleryEntry(item);
      if (published) {
        await this.adminData.deleteGalleryMedia(published.id);
        this.gallery.update(items => items.filter(value => value.id !== published.id));
        this.successMessage.set('Image retirée de la galerie publique.');
      } else {
        const created = await this.adminData.createGalleryMedia({ imageUrl: item.publicUrl, title: item.title, category: 'gallery' });
        this.gallery.update(items => [created, ...items]);
        this.successMessage.set('Image publiée dans la galerie publique.');
      }
      await this.inspectUsage(item, true);
    } catch { this.errorMessage.set('Impossible de modifier la publication dans la galerie.'); }
    finally { this.savingAssetId.set(null); }
  }

  async copyUrl(item: MediaAsset): Promise<void> {
    try { await navigator.clipboard.writeText(item.publicUrl); this.successMessage.set('URL de l’image copiée.'); }
    catch { this.errorMessage.set('Impossible de copier automatiquement l’URL.'); }
  }

  async inspectUsage(item: MediaAsset, force = false): Promise<void> {
    if (!force && this.assetUsages(item.id) !== undefined) return;
    this.usageLoadingId.set(item.id); this.errorMessage.set('');
    try {
      const usages = await this.adminData.getMediaAssetUsage(item.id);
      this.usageByAsset.update(current => ({ ...current, [item.id]: usages }));
    } catch { this.errorMessage.set('Impossible de vérifier les utilisations de cette image.'); }
    finally { this.usageLoadingId.set(null); }
  }
  onUsageToggle(item: MediaAsset, event: Event): void {
    if ((event.currentTarget as HTMLDetailsElement).open) void this.inspectUsage(item);
  }
  async prepareDelete(item: MediaAsset): Promise<void> {
    await this.inspectUsage(item, true);
    const usages = this.assetUsages(item.id) ?? [];
    if (usages.length) {
      this.errorMessage.set('Suppression bloquée : ' + usages.map(usage => usage.label).join(' · '));
      return;
    }
    this.pendingDeleteId.set(item.id);
  }

  hasTag(item: MediaAsset, tagId: string) { return item.tags.some(tag => tag.id === tagId); }
  async toggleAssetTag(item: MediaAsset, tagId: string): Promise<void> {
    if (this.savingAssetId()) return; this.savingAssetId.set(item.id); this.errorMessage.set('');
    const tagIds = this.hasTag(item, tagId) ? item.tags.filter(tag => tag.id !== tagId).map(tag => tag.id) : [...item.tags.map(tag => tag.id), tagId];
    try { const updated = await this.adminData.updateMediaAsset(item.id, { tagIds }); this.media.update(items => items.map(value => value.id === item.id ? updated : value)); }
    catch { this.errorMessage.set('Les tags de cette image n’ont pas pu être modifiés.'); }
    finally { this.savingAssetId.set(null); }
  }
  async download(item: MediaAsset): Promise<void> {
    if (this.downloadingId()) return; this.downloadingId.set(item.id); this.errorMessage.set('');
    try {
      const blob = await this.adminData.downloadMediaAsset(item.id); const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
      anchor.href = url; anchor.download = item.originalName; anchor.click(); URL.revokeObjectURL(url);
    } catch { this.errorMessage.set('Le téléchargement de cette image a échoué.'); }
    finally { this.downloadingId.set(null); }
  }
  async delete(item: MediaAsset): Promise<void> {
    this.saving.set(true); this.errorMessage.set(''); this.successMessage.set('');
    try {
      await this.adminData.deleteMediaAsset(item.id);
      this.media.update(items => items.filter(candidate => candidate.id !== item.id));
      this.pendingDeleteId.set(null);
      this.usageByAsset.update(current => { const next = { ...current }; delete next[item.id]; return next; });
      this.successMessage.set('Image supprimée de la médiathèque.');
    } catch {
      await this.inspectUsage(item, true);
      const usages = this.assetUsages(item.id) ?? [];
      this.errorMessage.set(usages.length ? 'Suppression bloquée : ' + usages.map(usage => usage.label).join(' · ') : 'Suppression impossible.');
    } finally { this.saving.set(false); }
  }
  categoryLabel(category: MediaCategory): string { return CATEGORIES.find(item => item.value === category)?.label ?? category; }
  formatDate(value: string): string { return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value)); }
  fileSize(value: number): string { return value >= 1024 * 1024 ? `${(value / 1024 / 1024).toFixed(1)} Mo` : `${Math.ceil(value / 1024)} Ko`; }
  private fileLabel(name: string): string {
    return name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  private normalize(value: string): string { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').trim(); }
}
