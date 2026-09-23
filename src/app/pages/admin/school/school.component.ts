import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, SchoolProgram } from '../../../core/services/admin-data.service';

type SchoolDraft = Omit<SchoolProgram, 'id'>;

@Component({
  selector: 'app-admin-school',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">École Gastronomique</h1>
          <p class="mt-1 text-sm text-gray-400">Créez les programmes visibles sur le site et préparez les prochaines sessions.</p>
        </div>
        <button type="button" (click)="load()" [disabled]="loading() || saving()"
          class="self-start rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-50">
          {{ loading() ? 'Actualisation…' : 'Actualiser' }}
        </button>
      </header>

      @if (errorMessage()) {
        <div role="alert" class="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">{{ errorMessage() }}</div>
      }

      <section class="grid gap-4 sm:grid-cols-3">
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs uppercase tracking-wider text-gray-500">Programmes</p>
          <p class="mt-2 text-3xl font-serif font-bold text-white">{{ programs().length }}</p>
        </article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs uppercase tracking-wider text-gray-500">Publics</p>
          <p class="mt-2 text-3xl font-serif font-bold text-emerald-300">{{ publicPrograms() }}</p>
        </article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs uppercase tracking-wider text-gray-500">Masqués</p>
          <p class="mt-2 text-3xl font-serif font-bold text-gray-300">{{ programs().length - publicPrograms() }}</p>
        </article>
      </section>

      <section class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-jacquier-gold">{{ editingId() ? 'Modification' : 'Nouveau programme' }}</p>
          <h2 class="mt-1 font-serif text-xl font-bold text-white">{{ editingId() ? 'Modifier le programme' : 'Créer un programme' }}</h2>
        </div>

        <form class="mt-6 grid gap-4 md:grid-cols-2" (ngSubmit)="save()">
          <label class="grid gap-1 text-sm text-gray-300 md:col-span-2">Titre
            <input required maxlength="160" [ngModel]="draft().title ?? ''" (ngModelChange)="patchDraft({ title: $event })" name="schoolTitle"
              class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white outline-none focus:border-jacquier-gold" />
          </label>

          <label class="grid gap-1 text-sm text-gray-300">Niveau
            <input maxlength="120" [ngModel]="draft().level ?? ''" (ngModelChange)="patchDraft({ level: $event })" name="schoolLevel"
              placeholder="Débutant, professionnel…"
              class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white outline-none focus:border-jacquier-gold" />
          </label>

          <label class="grid gap-1 text-sm text-gray-300">Durée
            <input maxlength="120" [ngModel]="draft().duration ?? ''" (ngModelChange)="patchDraft({ duration: $event })" name="schoolDuration"
              placeholder="6 semaines, 3 mois…"
              class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white outline-none focus:border-jacquier-gold" />
          </label>

          <label class="grid gap-1 text-sm text-gray-300">Ordre
            <input type="number" min="0" max="10000" [ngModel]="draft().displayOrder ?? 0" (ngModelChange)="patchDraft({ displayOrder: numberValue($event) })" name="schoolOrder"
              class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white outline-none focus:border-jacquier-gold" />
          </label>

          <label class="flex items-center gap-3 rounded-lg border border-gray-700 bg-[#121212] px-3 py-3 text-sm text-gray-300">
            <input type="checkbox" [ngModel]="draft().active !== false" (ngModelChange)="patchDraft({ active: $event })" name="schoolActive"
              class="h-4 w-4 accent-yellow-500" />
            Visible sur le site public
          </label>

          <label class="grid gap-1 text-sm text-gray-300 md:col-span-2">Description
            <textarea maxlength="2000" rows="5" [ngModel]="draft().description ?? ''" (ngModelChange)="patchDraft({ description: $event })" name="schoolDescription"
              class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white outline-none focus:border-jacquier-gold"></textarea>
          </label>

          <div class="flex gap-2 md:col-span-2">
            <button type="submit" [disabled]="saving()"
              class="rounded-lg bg-jacquier-gold px-5 py-2.5 text-sm font-bold text-jacquier-dark disabled:opacity-50">
              {{ saving() ? 'Enregistrement…' : (editingId() ? 'Enregistrer' : 'Créer le programme') }}
            </button>
            @if (editingId()) {
              <button type="button" (click)="resetDraft()" class="rounded-lg border border-gray-700 px-4 py-2.5 text-sm text-gray-300">Annuler</button>
            }
          </div>
        </form>
      </section>

      @if (loading()) {
        <div class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-gray-400" role="status">Chargement des programmes…</div>
      } @else if (!programs().length) {
        <div class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center">
          <p class="font-serif text-xl font-bold text-white">Aucun programme enregistré</p>
          <p class="mt-2 text-sm text-gray-400">Créez le premier programme ci-dessus. Il peut rester masqué jusqu’à validation du restaurant.</p>
        </div>
      } @else {
        <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          @for (program of sortedPrograms(); track program.id) {
            <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6">
              <div class="flex items-start justify-between gap-4">
                <p class="text-[10px] font-bold uppercase tracking-widest text-jacquier-gold">{{ program.level || 'Niveau à préciser' }}</p>
                <span [class]="program.active !== false ? 'rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-300' : 'rounded-full bg-gray-700 px-2 py-1 text-[10px] font-bold text-gray-300'">
                  {{ program.active !== false ? 'Public' : 'Masqué' }}
                </span>
              </div>
              <h2 class="mt-3 text-xl font-serif font-bold text-white">{{ program.title || 'Programme sans titre' }}</h2>
              <p class="mt-3 line-clamp-4 text-sm leading-6 text-gray-400">{{ program.description || 'Aucune description disponible.' }}</p>
              <div class="mt-5 flex items-center justify-between border-t border-gray-800 pt-4 text-xs text-gray-400">
                <span>{{ program.duration || 'Durée à préciser' }}</span>
                <span>Ordre {{ program.displayOrder ?? 0 }}</span>
              </div>
              <div class="mt-5 flex flex-wrap gap-2">
                <button type="button" (click)="edit(program)" class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold">Modifier</button>
                <button type="button" (click)="toggleActive(program)" [disabled]="saving()"
                  class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-gray-200 disabled:opacity-50">
                  {{ program.active !== false ? 'Masquer' : 'Publier' }}
                </button>
                @if (pendingDeleteId() === program.id) {
                  <button type="button" (click)="deleteProgram(program)" [disabled]="saving()" class="rounded-lg bg-red-900 px-3 py-2 text-xs font-bold text-white">Confirmer suppression</button>
                  <button type="button" (click)="pendingDeleteId.set(null)" class="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300">Annuler</button>
                } @else {
                  <button type="button" (click)="pendingDeleteId.set(program.id)" class="rounded-lg border border-red-900/70 px-3 py-2 text-xs font-bold text-red-200">Supprimer</button>
                }
              </div>
            </article>
          }
        </section>
      }

      <p class="text-xs text-gray-500">Ce module gère les programmes publiés. Les étudiants, inscriptions et paiements ne sont pas encore modélisés.</p>
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn .6s ease-out forwards; } @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`]
})
export class AdminSchoolComponent {
  private readonly adminData = inject(AdminDataService);

  readonly programs = signal<SchoolProgram[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly editingId = signal<string | null>(null);
  readonly pendingDeleteId = signal<string | null>(null);
  readonly draft = signal<SchoolDraft>({ title: '', description: '', duration: '', level: '', active: true, displayOrder: 0 });

  readonly sortedPrograms = computed(() => [...this.programs()].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));
  readonly publicPrograms = computed(() => this.programs().filter(program => program.active !== false).length);

  constructor() { void this.load(); }

  numberValue(value: string | number): number { return Number(value); }
  patchDraft(patch: Partial<SchoolDraft>): void { this.draft.update(draft => ({ ...draft, ...patch })); }

  resetDraft(): void {
    this.editingId.set(null);
    this.pendingDeleteId.set(null);
    const nextOrder = this.programs().length ? Math.max(...this.programs().map(program => program.displayOrder ?? 0)) + 10 : 0;
    this.draft.set({ title: '', description: '', duration: '', level: '', active: true, displayOrder: nextOrder });
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      this.programs.set(await this.adminData.getSchoolPrograms());
      if (!this.editingId()) this.resetDraft();
    } catch {
      this.errorMessage.set('Impossible de charger les programmes. Vérifiez votre session administrateur puis réessayez.');
    } finally {
      this.loading.set(false);
    }
  }

  edit(program: SchoolProgram): void {
    this.pendingDeleteId.set(null);
    this.editingId.set(program.id);
    this.draft.set({
      title: program.title ?? '',
      description: program.description ?? '',
      duration: program.duration ?? '',
      level: program.level ?? '',
      active: program.active !== false,
      displayOrder: program.displayOrder ?? 0
    });
  }

  async save(): Promise<void> {
    const raw = this.draft();
    const payload: SchoolDraft = {
      title: raw.title?.trim(),
      description: raw.description?.trim(),
      duration: raw.duration?.trim(),
      level: raw.level?.trim(),
      active: raw.active !== false,
      displayOrder: Number(raw.displayOrder ?? 0)
    };
    if (!payload.title || !Number.isInteger(payload.displayOrder) || Number(payload.displayOrder) < 0) {
      this.errorMessage.set('Vérifiez le titre et l’ordre du programme.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    try {
      const id = this.editingId();
      const saved = id
        ? await this.adminData.updateSchoolProgram(id, payload)
        : await this.adminData.createSchoolProgram(payload);
      this.programs.update(items => id ? items.map(item => item.id === saved.id ? saved : item) : [...items, saved]);
      this.resetDraft();
    } catch {
      this.errorMessage.set('Le programme n’a pas pu être enregistré.');
    } finally {
      this.saving.set(false);
    }
  }

  async toggleActive(program: SchoolProgram): Promise<void> {
    this.saving.set(true);
    this.errorMessage.set('');
    try {
      const saved = await this.adminData.updateSchoolProgram(program.id, { active: program.active === false });
      this.programs.update(items => items.map(item => item.id === saved.id ? saved : item));
    } catch {
      this.errorMessage.set('Le statut du programme n’a pas pu être modifié.');
    } finally {
      this.saving.set(false);
    }
  }

  async deleteProgram(program: SchoolProgram): Promise<void> {
    this.saving.set(true);
    this.errorMessage.set('');
    try {
      await this.adminData.deleteSchoolProgram(program.id);
      this.programs.update(items => items.filter(item => item.id !== program.id));
      this.resetDraft();
    } catch {
      this.errorMessage.set(`Le programme « ${program.title || 'sans titre'} » n’a pas pu être supprimé.`);
    } finally {
      this.saving.set(false);
    }
  }
}
