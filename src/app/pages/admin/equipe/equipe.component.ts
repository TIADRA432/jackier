import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminDataService, AdminTeamMember, MediaAsset } from '../../../core/services/admin-data.service';

const DEPARTMENTS = [
  { value: 'direction', label: 'Direction' },
  { value: 'cuisine', label: 'Cuisine' },
  { value: 'salle', label: 'Salle' },
  { value: 'administration', label: 'Administration' },
  { value: 'traiteur', label: 'Traiteur' },
  { value: 'ecole', label: 'École gastronomique' },
] as const;

type TeamDraft = {
  name: string;
  role: string;
  department: string;
  photoUrl: string;
  bio: string;
  active: boolean;
  publicVisible: boolean;
  displayOrder: number;
};

const emptyDraft = (): TeamDraft => ({
  name: '',
  role: '',
  department: 'salle',
  photoUrl: '',
  bio: '',
  active: true,
  publicVisible: false,
  displayOrder: 0,
});

@Component({
  selector: 'app-admin-equipe',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <header class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-jacquier-gold">Organisation</p>
          <h1 class="mt-1 text-3xl font-serif font-bold text-white">Équipe & Personnel</h1>
          <p class="mt-2 max-w-3xl text-sm text-gray-400">
            Gérez les membres de l’équipe et choisissez séparément ceux qui peuvent apparaître publiquement sur le site.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" (click)="previewOpen.set(!previewOpen())"
            class="rounded-xl border border-gray-700 px-4 py-3 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold">
            {{ previewOpen() ? 'Masquer l’aperçu' : 'Aperçu équipe publique' }}
          </button>
          <button type="button" (click)="load()" [disabled]="loading()"
            class="rounded-xl border border-gray-700 px-4 py-3 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-60">
            Actualiser
          </button>
          <button type="button" (click)="startCreate()"
            class="rounded-xl bg-jacquier-gold px-4 py-3 text-sm font-bold text-jacquier-dark hover:bg-white">
            + Ajouter un membre
          </button>
        </div>
      </header>

      <p class="rounded-xl border border-gray-800 bg-[#1a1a1a] px-4 py-3 text-sm text-gray-400">
        Ce module gère l’annuaire et la présentation de l’équipe. Il ne stocke pas de salaire, contrat, congé, présence ou autre donnée RH sensible.
      </p>

      @if (errorMessage()) {
        <p class="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">{{ errorMessage() }}</p>
      }
      @if (successMessage()) {
        <p class="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200" role="status">{{ successMessage() }}</p>
      }

      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Résumé de l’équipe">
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Enregistrés</p>
          <p class="mt-2 text-3xl font-bold text-white">{{ members().length }}</p>
          <p class="mt-1 text-xs text-gray-500">membres dans l’annuaire</p>
        </article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Actifs</p>
          <p class="mt-2 text-3xl font-bold text-jacquier-gold">{{ activeCount() }}</p>
          <p class="mt-1 text-xs text-gray-500">membres actuellement actifs</p>
        </article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Publics</p>
          <p class="mt-2 text-3xl font-bold text-emerald-300">{{ publicCount() }}</p>
          <p class="mt-1 text-xs text-gray-500">visibles sur la page À propos</p>
        </article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Départements</p>
          <p class="mt-2 text-3xl font-bold text-white">{{ departmentCount() }}</p>
          <p class="mt-1 text-xs text-gray-500">groupes actuellement représentés</p>
        </article>
      </section>

      @if (previewOpen()) {
        <section class="rounded-2xl border border-jacquier-gold/30 bg-[#171717] p-5">
          <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="font-serif text-xl font-bold text-white">Aperçu de l’équipe publique</h2>
              <p class="text-xs text-gray-500">Seuls les membres actifs avec “Afficher publiquement” activé apparaissent ici.</p>
            </div>
            <a routerLink="/about" target="_blank" rel="noopener"
              class="text-sm font-bold text-jacquier-gold hover:text-white">Voir la page À propos ↗</a>
          </div>
          @if (publicMembers().length) {
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              @for (member of publicMembers(); track member.id) {
                <article class="overflow-hidden rounded-2xl border border-gray-800 bg-[#111]">
                  <div class="h-52 bg-gray-900">
                    @if (member.photoUrl) {
                      <img [src]="member.photoUrl" [alt]="'Photo de ' + member.name" class="h-full w-full object-cover" />
                    } @else {
                      <div class="flex h-full items-center justify-center text-4xl font-serif font-bold text-jacquier-gold/60">{{ initials(member.name) }}</div>
                    }
                  </div>
                  <div class="p-4 text-center">
                    <p class="font-serif text-lg font-bold text-white">{{ member.name }}</p>
                    <p class="mt-1 text-xs font-bold uppercase tracking-wider text-jacquier-gold">{{ member.role }}</p>
                    <p class="mt-2 text-[11px] uppercase tracking-wider text-gray-500">{{ departmentLabel(member.department) }}</p>
                    @if (member.bio) { <p class="mt-3 line-clamp-3 text-xs leading-relaxed text-gray-400">{{ member.bio }}</p> }
                  </div>
                </article>
              }
            </div>
          } @else {
            <p class="rounded-xl border border-dashed border-gray-700 p-8 text-center text-sm text-gray-500">Aucun membre n’est actuellement publié.</p>
          }
        </section>
      }

      @if (showForm()) {
        <form (ngSubmit)="save()" class="grid gap-4 rounded-2xl border border-jacquier-gold/30 bg-[#1a1a1a] p-6 md:grid-cols-2">
          <div class="md:col-span-2">
            <h2 class="text-lg font-serif font-bold text-white">{{ editingId() ? 'Modifier le membre' : 'Nouveau membre' }}</h2>
            <p class="mt-1 text-xs text-gray-500">Les champs publics sont contrôlés séparément de l’état interne du membre.</p>
          </div>

          <label class="text-sm text-gray-300">Nom *
            <input [(ngModel)]="draft.name" name="name" maxlength="160" required
              class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none ring-jacquier-gold focus:ring-1" />
          </label>
          <label class="text-sm text-gray-300">Fonction *
            <input [(ngModel)]="draft.role" name="role" maxlength="120" required
              class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white outline-none ring-jacquier-gold focus:ring-1" />
          </label>

          <label class="text-sm text-gray-300">Département
            <select [(ngModel)]="draft.department" name="department"
              class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white">
              @for (department of departments; track department.value) {
                <option [value]="department.value">{{ department.label }}</option>
              }
            </select>
          </label>
          <label class="text-sm text-gray-300">Ordre d’affichage
            <input [(ngModel)]="draft.displayOrder" name="displayOrder" type="number" min="0" max="10000" step="1"
              class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white" />
            <span class="mt-1 block text-xs text-gray-500">Les plus petits numéros apparaissent en premier.</span>
          </label>

          <label class="text-sm text-gray-300 md:col-span-2">Photo depuis la Médiathèque
            <select [(ngModel)]="draft.photoUrl" name="photoUrl"
              class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white">
              <option value="">Aucune photo</option>
              @for (asset of teamImages(); track asset.id) {
                <option [value]="asset.publicUrl">{{ asset.title || asset.originalName }}</option>
              }
            </select>
            <span class="mt-1 block text-xs text-gray-500">Importez les portraits dans Médiathèque → zone “Équipe”.</span>
          </label>

          @if (draft.photoUrl) {
            <div class="md:col-span-2">
              <img [src]="draft.photoUrl" alt="Aperçu du portrait sélectionné" class="h-32 w-32 rounded-2xl object-cover ring-1 ring-gray-700" />
            </div>
          }

          <label class="text-sm text-gray-300 md:col-span-2">Courte biographie
            <textarea [(ngModel)]="draft.bio" name="bio" maxlength="600" rows="4"
              placeholder="Présentation courte destinée au site public…"
              class="mt-2 w-full resize-y rounded-xl bg-gray-900 px-3 py-3 text-white"></textarea>
            <span class="mt-1 block text-xs text-gray-500">{{ draft.bio.length }}/600 caractères</span>
          </label>

          <div class="grid gap-3 rounded-xl border border-gray-800 bg-black/20 p-4 md:col-span-2 sm:grid-cols-2">
            <label class="flex cursor-pointer items-start gap-3 text-sm text-gray-300">
              <input type="checkbox" [(ngModel)]="draft.active" name="active" class="mt-1 h-4 w-4 accent-yellow-500" />
              <span><strong class="block text-white">Membre actif</strong><span class="text-xs text-gray-500">Présent dans l’organisation actuelle.</span></span>
            </label>
            <label class="flex cursor-pointer items-start gap-3 text-sm text-gray-300">
              <input type="checkbox" [(ngModel)]="draft.publicVisible" name="publicVisible" class="mt-1 h-4 w-4 accent-yellow-500" />
              <span><strong class="block text-white">Afficher publiquement</strong><span class="text-xs text-gray-500">Visible sur la page À propos uniquement si le membre est aussi actif.</span></span>
            </label>
          </div>

          @if (draft.publicVisible && !draft.active) {
            <p class="rounded-xl border border-amber-700/40 bg-amber-500/10 px-4 py-3 text-xs text-amber-200 md:col-span-2">
              Ce membre est marqué public mais restera masqué du site tant qu’il est inactif.
            </p>
          }

          <div class="flex justify-end gap-3 md:col-span-2">
            <button type="button" (click)="cancelEdit()" class="rounded-xl border border-gray-700 px-4 py-3 text-sm text-gray-300">Annuler</button>
            <button type="submit" [disabled]="saving() || !draft.name.trim() || !draft.role.trim() || draft.displayOrder < 0"
              class="rounded-xl bg-jacquier-gold px-5 py-3 text-sm font-bold text-jacquier-dark disabled:opacity-60">
              {{ saving() ? 'Enregistrement…' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      }

      <section class="grid gap-4 rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5 lg:grid-cols-[2fr_1fr_1fr]">
        <label class="text-sm text-gray-300">Recherche
          <input type="search" [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="Nom, fonction, bio…"
            class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white" />
        </label>
        <label class="text-sm text-gray-300">Département
          <select [ngModel]="departmentFilter()" (ngModelChange)="departmentFilter.set($event)"
            class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white">
            <option value="all">Tous les départements</option>
            @for (department of departments; track department.value) {
              <option [value]="department.value">{{ department.label }}</option>
            }
          </select>
        </label>
        <label class="text-sm text-gray-300">État
          <select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)"
            class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-3 text-white">
            <option value="all">Tous</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
            <option value="public">Publics</option>
            <option value="private">Non publics</option>
          </select>
        </label>
      </section>

      @if (loading()) {
        <p class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-sm text-gray-400" role="status">Chargement de l’équipe…</p>
      } @else if (!filteredMembers().length) {
        <div class="rounded-2xl border border-dashed border-gray-700 bg-[#1a1a1a] p-12 text-center">
          <p class="font-bold text-white">Aucun membre ne correspond à ces filtres.</p>
          <p class="mt-2 text-sm text-gray-500">Ajoutez un membre ou modifiez les filtres.</p>
        </div>
      } @else {
        <section class="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          @for (member of filteredMembers(); track member.id) {
            <article class="overflow-hidden rounded-2xl border border-gray-800 bg-[#1a1a1a]">
              <div class="relative h-56 bg-gray-900">
                @if (member.photoUrl) {
                  <img [src]="member.photoUrl" [alt]="'Photo de ' + member.name" class="h-full w-full object-cover" />
                } @else {
                  <div class="flex h-full items-center justify-center text-5xl font-serif font-bold text-jacquier-gold/60">{{ initials(member.name) }}</div>
                }
                <div class="absolute left-3 top-3 flex flex-wrap gap-2">
                  <span [class]="member.active ? 'rounded-full bg-emerald-600/90 px-3 py-1 text-[11px] font-bold text-white' : 'rounded-full bg-gray-700/90 px-3 py-1 text-[11px] font-bold text-gray-200'">
                    {{ member.active ? 'Actif' : 'Inactif' }}
                  </span>
                  @if (member.publicVisible) {
                    <span class="rounded-full bg-jacquier-gold px-3 py-1 text-[11px] font-bold text-jacquier-dark">Public</span>
                  }
                </div>
                <span class="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] text-gray-300">#{{ member.displayOrder }}</span>
              </div>

              <div class="space-y-4 p-5">
                <div>
                  <p class="font-serif text-xl font-bold text-white">{{ member.name }}</p>
                  <p class="mt-1 text-sm font-bold text-jacquier-gold">{{ member.role }}</p>
                  <p class="mt-1 text-xs uppercase tracking-wider text-gray-500">{{ departmentLabel(member.department) }}</p>
                </div>
                @if (member.bio) {
                  <p class="line-clamp-3 text-sm leading-relaxed text-gray-400">{{ member.bio }}</p>
                } @else {
                  <p class="text-xs italic text-gray-600">Aucune biographie renseignée.</p>
                }

                <div class="flex flex-wrap gap-2 border-t border-gray-800 pt-4">
                  <button type="button" (click)="move(member, -1)" [disabled]="isFirst(member) || saving()"
                    class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-gray-300 disabled:opacity-30">↑ Monter</button>
                  <button type="button" (click)="move(member, 1)" [disabled]="isLast(member) || saving()"
                    class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-gray-300 disabled:opacity-30">↓ Descendre</button>
                  <button type="button" (click)="togglePublic(member)" [disabled]="saving()"
                    class="rounded-lg border border-emerald-800 px-3 py-2 text-xs font-bold text-emerald-300 disabled:opacity-50">
                    {{ member.publicVisible ? 'Retirer du public' : 'Publier' }}
                  </button>
                  <button type="button" (click)="edit(member)"
                    class="rounded-lg border border-jacquier-gold/50 px-3 py-2 text-xs font-bold text-jacquier-gold">Modifier</button>
                </div>

                @if (pendingDeleteId() === member.id) {
                  <div class="rounded-xl border border-red-900/60 bg-red-950/20 p-3">
                    <p class="text-xs text-red-200">Supprimer définitivement {{ member.name }} de l’annuaire ?</p>
                    <div class="mt-3 flex justify-end gap-2">
                      <button type="button" (click)="pendingDeleteId.set(null)" class="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300">Annuler</button>
                      <button type="button" (click)="delete(member)" [disabled]="saving()" class="rounded-lg bg-red-900 px-3 py-2 text-xs font-bold text-white">Confirmer</button>
                    </div>
                  </div>
                } @else {
                  <button type="button" (click)="pendingDeleteId.set(member.id)" [attr.aria-label]="'Supprimer ' + member.name"
                    class="text-xs font-bold text-red-300 hover:text-red-200">Supprimer</button>
                }
              </div>
            </article>
          }
        </section>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn .35s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminEquipeComponent {
  private readonly adminData = inject(AdminDataService);

  readonly members = signal<AdminTeamMember[]>([]);
  readonly mediaAssets = signal<MediaAsset[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly showForm = signal(false);
  readonly previewOpen = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly pendingDeleteId = signal<string | null>(null);
  readonly query = signal('');
  readonly departmentFilter = signal('all');
  readonly statusFilter = signal('all');
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly departments = DEPARTMENTS;

  draft = emptyDraft();

  readonly sortedMembers = computed(() =>
    [...this.members()].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, 'fr'))
  );
  readonly activeCount = computed(() => this.members().filter(member => member.active).length);
  readonly publicMembers = computed(() => this.sortedMembers().filter(member => member.active && member.publicVisible));
  readonly publicCount = computed(() => this.publicMembers().length);
  readonly departmentCount = computed(() => new Set(this.members().map(member => member.department)).size);

  readonly filteredMembers = computed(() => {
    const query = this.normalize(this.query());
    const department = this.departmentFilter();
    const status = this.statusFilter();
    return this.sortedMembers().filter(member => {
      const searchable = this.normalize(`${member.name} ${member.role} ${member.bio ?? ''} ${this.departmentLabel(member.department)}`);
      const matchesStatus =
        status === 'all' ||
        (status === 'active' && member.active) ||
        (status === 'inactive' && !member.active) ||
        (status === 'public' && member.publicVisible) ||
        (status === 'private' && !member.publicVisible);
      return (!query || searchable.includes(query))
        && (department === 'all' || member.department === department)
        && matchesStatus;
    });
  });

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      const [members, assets] = await Promise.all([
        this.adminData.getTeamMembers(),
        this.adminData.getMediaAssets()
      ]);
      this.members.set(members);
      this.mediaAssets.set(assets);
    } catch {
      this.errorMessage.set('Impossible de charger l’équipe ou la Médiathèque. Réessayez dans un instant.');
    } finally {
      this.loading.set(false);
    }
  }

  startCreate(): void {
    this.draft = { ...emptyDraft(), displayOrder: this.nextOrder() };
    this.editingId.set(null);
    this.showForm.set(true);
    this.pendingDeleteId.set(null);
    this.clearMessages();
  }

  edit(member: AdminTeamMember): void {
    this.draft = {
      name: member.name,
      role: member.role,
      department: member.department,
      photoUrl: member.photoUrl ?? '',
      bio: member.bio ?? '',
      active: member.active,
      publicVisible: member.publicVisible,
      displayOrder: Number(member.displayOrder ?? 0),
    };
    this.editingId.set(member.id);
    this.showForm.set(true);
    this.pendingDeleteId.set(null);
    this.clearMessages();
  }

  cancelEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.draft = emptyDraft();
  }

  async save(): Promise<void> {
    if (!this.draft.name.trim() || !this.draft.role.trim() || this.saving()) return;
    this.saving.set(true);
    this.clearMessages();
    const payload = {
      ...this.draft,
      name: this.draft.name.trim(),
      role: this.draft.role.trim(),
      photoUrl: this.draft.photoUrl.trim() || null,
      bio: this.draft.bio.trim() || null,
      displayOrder: Number(this.draft.displayOrder),
    };

    try {
      const id = this.editingId();
      if (id) {
        const updated = await this.adminData.updateTeamMember(id, payload);
        this.members.update(members => members.map(member => member.id === id ? updated : member));
        this.successMessage.set('Membre mis à jour.');
      } else {
        const created = await this.adminData.createTeamMember(payload);
        this.members.update(members => [...members, created]);
        this.successMessage.set('Membre ajouté à l’équipe.');
      }
      this.cancelEdit();
    } catch {
      this.errorMessage.set('Impossible d’enregistrer ce membre. Vérifiez les valeurs saisies.');
    } finally {
      this.saving.set(false);
    }
  }

  async togglePublic(member: AdminTeamMember): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    this.clearMessages();
    try {
      const updated = await this.adminData.updateTeamMember(member.id, { publicVisible: !member.publicVisible });
      this.members.update(members => members.map(candidate => candidate.id === member.id ? updated : candidate));
      this.successMessage.set(updated.publicVisible
        ? (updated.active ? 'Membre ajouté à l’équipe publique.' : 'Visibilité publique activée, mais le membre reste masqué tant qu’il est inactif.')
        : 'Membre retiré de l’équipe publique.');
    } catch {
      this.errorMessage.set('Impossible de modifier la visibilité publique.');
    } finally {
      this.saving.set(false);
    }
  }

  async move(member: AdminTeamMember, direction: -1 | 1): Promise<void> {
    if (this.saving()) return;
    const items = this.sortedMembers();
    const index = items.findIndex(candidate => candidate.id === member.id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;

    this.saving.set(true);
    this.clearMessages();
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    try {
      const normalized = reordered.map((item, position) => ({ ...item, displayOrder: position * 10 }));
      for (const item of normalized) {
        await this.adminData.updateTeamMember(item.id, { displayOrder: item.displayOrder });
      }
      this.members.set(normalized);
      this.successMessage.set('Ordre de l’équipe enregistré.');
    } catch {
      this.errorMessage.set('L’ordre n’a pas pu être enregistré complètement. Rechargez la page avant de recommencer.');
      await this.load();
    } finally {
      this.saving.set(false);
    }
  }

  async delete(member: AdminTeamMember): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    this.clearMessages();
    try {
      await this.adminData.deleteTeamMember(member.id);
      this.members.update(members => members.filter(candidate => candidate.id !== member.id));
      this.pendingDeleteId.set(null);
      this.successMessage.set('Membre supprimé de l’annuaire.');
    } catch {
      this.errorMessage.set('Impossible de supprimer ce membre.');
    } finally {
      this.saving.set(false);
    }
  }

  isFirst(member: AdminTeamMember): boolean {
    return this.sortedMembers()[0]?.id === member.id;
  }

  isLast(member: AdminTeamMember): boolean {
    const items = this.sortedMembers();
    return items[items.length - 1]?.id === member.id;
  }

  teamImages(): MediaAsset[] {
    return this.mediaAssets().filter(asset => asset.category === 'team');
  }

  departmentLabel(value: string): string {
    return DEPARTMENTS.find(department => department.value === value)?.label ?? value;
  }

  initials(name: string): string {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }

  private nextOrder(): number {
    return this.members().reduce((max, member) => Math.max(max, Number(member.displayOrder ?? 0)), -10) + 10;
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  private normalize(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').trim();
  }
}
