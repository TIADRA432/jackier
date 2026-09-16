import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, MediaAsset, MediaCategory, MediaTag } from '../../../core/services/admin-data.service';

const CATEGORIES: Array<{ value: MediaCategory; label: string }> = [
  { value: 'branding', label: 'Identité visuelle' }, { value: 'hero', label: 'Images permanentes' },
  { value: 'menu', label: 'Plats' }, { value: 'wines', label: 'Vins' },
  { value: 'gallery', label: 'Galerie publique' }, { value: 'team', label: 'Équipe' },
];

type UploadDraft = { file: File; title: string; altText: string };

@Component({
  selector: 'app-admin-cms', standalone: true, imports: [CommonModule, FormsModule], changeDetection: ChangeDetectionStrategy.OnPush,
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
          <label class="block text-sm text-gray-300">Images
            <input type="file" multiple accept="image/jpeg,image/png,image/webp" required (change)="selectFiles($event)" class="mt-2 block w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-jacquier-gold file:px-3 file:py-2 file:text-sm file:font-bold file:text-jacquier-dark" />
          </label>
          <label class="block text-sm text-gray-300">Zone d’utilisation
            <select [(ngModel)]="uploadCategory" name="uploadCategory" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none ring-jacquier-gold focus:ring-1">@for (item of categories; track item.value) { <option [value]="item.value">{{ item.label }}</option> }</select>
          </label>

          @if (uploadDrafts().length) {
            <div class="space-y-3">
              <p class="text-sm font-bold text-white">{{ uploadDrafts().length }} image(s) sélectionnée(s)</p>
              @for (draft of uploadDrafts(); track draft.file.name + draft.file.lastModified) {
                <div class="grid gap-3 rounded-xl border border-gray-800 bg-gray-900/70 p-4 md:grid-cols-2">
                  <p class="truncate text-xs text-gray-400 md:col-span-2">{{ draft.file.name }} · {{ fileSize(draft.file.size) }}</p>
                  <label class="text-xs text-gray-300">Titre<input [(ngModel)]="draft.title" [name]="'title-' + $index" maxlength="200" class="mt-1 w-full rounded-lg bg-black/30 px-3 py-2 text-white" /></label>
                  <label class="text-xs text-gray-300">Texte alternatif *<input [(ngModel)]="draft.altText" [name]="'alt-' + $index" maxlength="200" required class="mt-1 w-full rounded-lg bg-black/30 px-3 py-2 text-white" /></label>
                </div>
              }
            </div>
          }

          <fieldset class="space-y-2"><legend class="text-sm font-bold text-white">Tags appliqués à cet import</legend>
            <div class="flex flex-wrap gap-2">@for (tag of tags(); track tag.id) {
              <label class="cursor-pointer rounded-full border px-3 py-2 text-xs" [class.border-jacquier-gold]="uploadTagIds().includes(tag.id)" [class.text-jacquier-gold]="uploadTagIds().includes(tag.id)" [class.border-gray-700]="!uploadTagIds().includes(tag.id)" [class.text-gray-300]="!uploadTagIds().includes(tag.id)">
                <input type="checkbox" class="sr-only" [checked]="uploadTagIds().includes(tag.id)" (change)="toggleUploadTag(tag.id)" />{{ tag.name }}
              </label>
            }</div>
          </fieldset>
          <div class="flex justify-end"><button type="submit" [disabled]="saving() || !canUpload()" class="rounded-xl bg-jacquier-gold px-5 py-3 text-sm font-bold text-jacquier-dark disabled:opacity-50">{{ saving() ? 'Import ' + uploadProgress() + '/' + uploadDrafts().length : 'Importer les images' }}</button></div>
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
            <img [src]="item.publicUrl" [alt]="item.altText" class="h-48 w-full object-cover" />
            <div class="space-y-3 p-4">
              <div><p class="truncate text-sm font-bold text-white">{{ item.title || item.originalName }}</p><p class="text-xs text-gray-500">{{ categoryLabel(item.category) }} · {{ formatDate(item.createdAt) }} · {{ fileSize(item.sizeBytes) }}</p></div>
              <p class="line-clamp-2 text-xs text-gray-400">{{ item.altText }}</p>
              <div class="flex flex-wrap gap-1">@for (tag of item.tags; track tag.id) { <span class="rounded-full bg-jacquier-gold/10 px-2 py-1 text-xs text-jacquier-gold">{{ tag.name }}</span> } @empty { <span class="text-xs text-gray-600">Sans tag</span> }</div>
              <details class="rounded-xl border border-gray-800 p-3"><summary class="cursor-pointer text-xs font-bold text-gray-300">Modifier les tags</summary><div class="mt-3 flex flex-wrap gap-2">@for (tag of tags(); track tag.id) { <label class="cursor-pointer rounded-full border border-gray-700 px-2 py-1 text-xs text-gray-300"><input type="checkbox" class="mr-1" [checked]="hasTag(item, tag.id)" (change)="toggleAssetTag(item, tag.id)" [disabled]="savingAssetId() === item.id" />{{ tag.name }}</label> }</div></details>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <button type="button" (click)="download(item)" [disabled]="downloadingId() === item.id" class="text-xs font-bold text-jacquier-gold hover:text-white disabled:opacity-50">{{ downloadingId() === item.id ? 'Téléchargement…' : 'Télécharger' }}</button>
                @if (pendingDeleteId() === item.id) { <div class="flex gap-2"><button type="button" (click)="delete(item)" [disabled]="saving()" class="rounded-lg bg-red-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-60">Confirmer</button><button type="button" (click)="pendingDeleteId.set(null)" class="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300">Annuler</button></div> }
                @else { <button type="button" (click)="pendingDeleteId.set(item.id)" [attr.aria-label]="'Supprimer ' + (item.title || item.originalName)" class="text-xs font-bold text-red-300 hover:text-red-200">Supprimer</button> }
              </div>
            </div>
          </article>
        }</section>
      }
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`]
})
export class CMSComponent {
  private readonly adminData = inject(AdminDataService);
  readonly media = signal<MediaAsset[]>([]); readonly tags = signal<MediaTag[]>([]);
  readonly loading = signal(true); readonly saving = signal(false); readonly savingTag = signal(false);
  readonly showForm = signal(false); readonly pendingDeleteId = signal<string | null>(null);
  readonly savingAssetId = signal<string | null>(null); readonly downloadingId = signal<string | null>(null);
  readonly errorMessage = signal(''); readonly successMessage = signal('');
  readonly uploadDrafts = signal<UploadDraft[]>([]); readonly uploadTagIds = signal<string[]>([]); readonly uploadProgress = signal(0);
  readonly query = signal(''); readonly categoryFilter = signal('all'); readonly tagFilter = signal('all');
  readonly categories = CATEGORIES;
  uploadCategory: MediaCategory = 'menu'; newTagName = '';
  readonly canUpload = computed(() => this.uploadDrafts().length > 0 && this.uploadDrafts().every(draft => draft.altText.trim().length > 0));
  readonly filteredMedia = computed(() => {
    const query = this.normalize(this.query()); const category = this.categoryFilter(); const tag = this.tagFilter();
    return this.media().filter(item => {
      const searchable = this.normalize(`${item.title} ${item.originalName} ${item.altText} ${item.tags.map(value => value.name).join(' ')}`);
      return (!query || searchable.includes(query)) && (category === 'all' || item.category === category)
        && (tag === 'all' || (tag === 'none' ? !item.tags.length : item.tags.some(value => value.id === tag)));
    });
  });

  constructor() { void this.load(); }
  async load(): Promise<void> {
    this.loading.set(true); this.errorMessage.set('');
    try { const [media, tags] = await Promise.all([this.adminData.getMediaAssets(), this.adminData.getMediaTags()]); this.media.set(media); this.tags.set(tags); }
    catch { this.errorMessage.set('Impossible de charger la médiathèque. Réessayez dans un instant.'); }
    finally { this.loading.set(false); }
  }
  selectFiles(event: Event): void {
    const files = Array.from((event.target as HTMLInputElement).files ?? []).slice(0, 20);
    this.uploadDrafts.set(files.map(file => ({ file, title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '), altText: '' })));
  }
  toggleUploadTag(id: string) { this.uploadTagIds.update(ids => ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id]); }
  async uploadAll(): Promise<void> {
    const drafts = this.uploadDrafts(); if (!this.canUpload() || this.saving()) return;
    this.saving.set(true); this.uploadProgress.set(0); this.errorMessage.set(''); this.successMessage.set('');
    const created: MediaAsset[] = [];
    try {
      for (const draft of drafts) {
        const asset = await this.adminData.uploadMediaAsset(draft.file, { title: draft.title.trim(), altText: draft.altText.trim(), category: this.uploadCategory, tagIds: this.uploadTagIds() });
        created.push(asset); this.uploadProgress.update(value => value + 1);
        if (asset.category === 'gallery') await this.adminData.createGalleryMedia({ imageUrl: asset.publicUrl, title: asset.title, category: 'gallery' });
      }
      this.media.update(items => [...created.reverse(), ...items]); this.uploadDrafts.set([]); this.uploadTagIds.set([]); this.showForm.set(false);
      this.successMessage.set(`${created.length} image(s) importée(s)${this.uploadCategory === 'gallery' ? ' et publiée(s) dans la galerie' : ''}.`);
    } catch { this.errorMessage.set(`Import interrompu après ${created.length} image(s). Vérifiez le format, la taille et les textes alternatifs.`); if (created.length) this.media.update(items => [...created.reverse(), ...items]); }
    finally { this.saving.set(false); }
  }
  async createTag(): Promise<void> {
    const name = this.newTagName.trim(); if (!name || this.savingTag()) return;
    this.savingTag.set(true); this.errorMessage.set('');
    try { const tag = await this.adminData.createMediaTag(name); this.tags.update(tags => [...tags, tag].sort((a, b) => a.name.localeCompare(b.name, 'fr'))); this.newTagName = ''; }
    catch { this.errorMessage.set('Ce tag existe déjà ou son nom n’est pas valide.'); }
    finally { this.savingTag.set(false); }
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
  async delete(item: MediaAsset): Promise<void> { this.saving.set(true); this.errorMessage.set(''); try { await this.adminData.deleteMediaAsset(item.id); this.media.update(items => items.filter(candidate => candidate.id !== item.id)); this.pendingDeleteId.set(null); } catch { this.errorMessage.set('Suppression impossible : cette image est peut-être utilisée par le site.'); } finally { this.saving.set(false); } }
  categoryLabel(category: MediaCategory): string { return CATEGORIES.find(item => item.value === category)?.label ?? category; }
  formatDate(value: string): string { return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value)); }
  fileSize(value: number): string { return value >= 1024 * 1024 ? `${(value / 1024 / 1024).toFixed(1)} Mo` : `${Math.ceil(value / 1024)} Ko`; }
  private normalize(value: string): string { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').trim(); }
}
