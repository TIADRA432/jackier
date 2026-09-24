import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AdminDataService,
  SchoolLevel,
  SchoolProgram,
  SchoolProgramStatus,
  SchoolRegistration,
  SchoolRegistrationStatus,
  SchoolSession,
  SchoolSessionStatus
} from '../../../core/services/admin-data.service';

interface ProgramDraft {
  title: string;
  description: string;
  duration: string;
  level: SchoolLevel;
  price: number | null;
  capacity: number;
  prerequisites: string;
  instructor: string;
  materialsText: string;
  status: SchoolProgramStatus;
  displayOrder: number;
}

interface SessionDraft {
  programId: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  location: string;
  status: SchoolSessionStatus;
}

@Component({
  selector: 'app-admin-school',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <header class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-jacquier-gold">Formation</p>
          <h1 class="mt-1 text-3xl font-serif font-bold text-white">École Gastronomique</h1>
          <p class="mt-2 max-w-3xl text-sm text-gray-400">Catalogue, sessions, jauges et inscriptions dans un seul espace.</p>
        </div>
        <button type="button" (click)="load()" [disabled]="loading() || saving()"
          class="self-start rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-50">
          {{ loading() ? 'Actualisation…' : 'Actualiser' }}
        </button>
      </header>

      @if (errorMessage()) {
        <div role="alert" class="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">{{ errorMessage() }}</div>
      }

      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs uppercase tracking-wider text-gray-500">Programmes</p>
          <p class="mt-2 text-3xl font-serif font-bold text-white">{{ programs().length }}</p>
        </article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs uppercase tracking-wider text-gray-500">Publiés</p>
          <p class="mt-2 text-3xl font-serif font-bold text-emerald-300">{{ publishedPrograms() }}</p>
        </article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs uppercase tracking-wider text-gray-500">Sessions à venir</p>
          <p class="mt-2 text-3xl font-serif font-bold text-white">{{ upcomingSessions() }}</p>
        </article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs uppercase tracking-wider text-gray-500">Inscriptions</p>
          <p class="mt-2 text-3xl font-serif font-bold text-white">{{ registrations().length }}</p>
        </article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
          <p class="text-xs uppercase tracking-wider text-gray-500">À traiter</p>
          <p class="mt-2 text-3xl font-serif font-bold text-amber-300">{{ pendingRegistrations() }}</p>
        </article>
      </section>

      <nav class="flex gap-2 overflow-x-auto rounded-2xl border border-gray-800 bg-[#141414] p-2" aria-label="Gestion de l’école">
        @for (tab of tabs; track tab.id) {
          <button type="button" (click)="activeTab.set(tab.id)"
            [class]="activeTab() === tab.id ? 'shrink-0 rounded-xl bg-jacquier-gold px-5 py-3 text-sm font-bold text-jacquier-dark' : 'shrink-0 rounded-xl px-5 py-3 text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white'">
            {{ tab.label }}
          </button>
        }
      </nav>

      @if (activeTab() === 'programs') {
        <section class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <form class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6" (ngSubmit)="saveProgram()">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-jacquier-gold">{{ editingProgramId() ? 'Modification' : 'Nouveau programme' }}</p>
            <h2 class="mt-1 font-serif text-xl font-bold text-white">{{ editingProgramId() ? 'Modifier le programme' : 'Créer un atelier ou masterclass' }}</h2>

            <div class="mt-6 grid gap-4 md:grid-cols-2">
              <label class="grid gap-1 text-sm text-gray-300 md:col-span-2">Titre
                <input required maxlength="160" [ngModel]="programDraft().title" (ngModelChange)="patchProgram({ title: $event })" name="programTitle"
                  class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white outline-none focus:border-jacquier-gold" />
              </label>
              <label class="grid gap-1 text-sm text-gray-300">Niveau
                <select [ngModel]="programDraft().level" (ngModelChange)="patchProgram({ level: $event })" name="programLevel"
                  class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white">
                  @for (level of levels; track level) { <option [value]="level">{{ level }}</option> }
                </select>
              </label>
              <label class="grid gap-1 text-sm text-gray-300">Durée
                <input maxlength="120" [ngModel]="programDraft().duration" (ngModelChange)="patchProgram({ duration: $event })" name="programDuration"
                  placeholder="3 heures, 2 jours…"
                  class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white" />
              </label>
              <label class="grid gap-1 text-sm text-gray-300">Prix (GNF)
                <input type="number" min="0" max="100000000" [ngModel]="programDraft().price" (ngModelChange)="patchProgram({ price: nullableNumber($event) })" name="programPrice"
                  class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white" />
              </label>
              <label class="grid gap-1 text-sm text-gray-300">Capacité par défaut
                <input type="number" min="1" max="500" [ngModel]="programDraft().capacity" (ngModelChange)="patchProgram({ capacity: numberValue($event) })" name="programCapacity"
                  class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white" />
              </label>
              <label class="grid gap-1 text-sm text-gray-300">Chef / formateur
                <input maxlength="160" [ngModel]="programDraft().instructor" (ngModelChange)="patchProgram({ instructor: $event })" name="programInstructor"
                  class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white" />
              </label>
              <label class="grid gap-1 text-sm text-gray-300">Statut
                <select [ngModel]="programDraft().status" (ngModelChange)="patchProgram({ status: $event })" name="programStatus"
                  class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white">
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                  <option value="archived">Archivé</option>
                </select>
              </label>
              <label class="grid gap-1 text-sm text-gray-300">Ordre
                <input type="number" min="0" max="10000" [ngModel]="programDraft().displayOrder" (ngModelChange)="patchProgram({ displayOrder: numberValue($event) })" name="programOrder"
                  class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white" />
              </label>
              <label class="grid gap-1 text-sm text-gray-300 md:col-span-2">Description
                <textarea maxlength="2000" rows="4" [ngModel]="programDraft().description" (ngModelChange)="patchProgram({ description: $event })" name="programDescription"
                  class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white"></textarea>
              </label>
              <label class="grid gap-1 text-sm text-gray-300 md:col-span-2">Prérequis
                <textarea maxlength="1000" rows="3" [ngModel]="programDraft().prerequisites" (ngModelChange)="patchProgram({ prerequisites: $event })" name="programPrerequisites"
                  placeholder="Aucun, bases de cuisine…"
                  class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white"></textarea>
              </label>
              <label class="grid gap-1 text-sm text-gray-300 md:col-span-2">Matériel inclus
                <input maxlength="1200" [ngModel]="programDraft().materialsText" (ngModelChange)="patchProgram({ materialsText: $event })" name="programMaterials"
                  placeholder="Tablier, ingrédients, fiche recette"
                  class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white" />
                <span class="text-xs text-gray-500">Séparez les éléments par des virgules.</span>
              </label>
            </div>

            <div class="mt-5 flex flex-wrap gap-2">
              <button type="submit" [disabled]="saving()" class="rounded-lg bg-jacquier-gold px-5 py-2.5 text-sm font-bold text-jacquier-dark disabled:opacity-50">
                {{ saving() ? 'Enregistrement…' : (editingProgramId() ? 'Enregistrer' : 'Créer le programme') }}
              </button>
              @if (editingProgramId()) {
                <button type="button" (click)="resetProgramDraft()" class="rounded-lg border border-gray-700 px-4 py-2.5 text-sm text-gray-300">Annuler</button>
              }
            </div>
          </form>

          <div class="space-y-4">
            @if (!programs().length) {
              <div class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-10 text-center text-gray-400">Aucun programme enregistré.</div>
            }
            @for (program of sortedPrograms(); track program.id) {
              <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div class="flex flex-wrap gap-2">
                      <span class="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-300">{{ program.level || 'Niveau à préciser' }}</span>
                      <span [class]="programStatusClass(program)">{{ programStatusLabel(program) }}</span>
                    </div>
                    <h3 class="mt-3 font-serif text-xl font-bold text-white">{{ program.title }}</h3>
                    <p class="mt-2 text-sm text-gray-400">{{ program.duration || 'Durée à préciser' }} · {{ formatPrice(program.price) }} · {{ program.capacity || '—' }} places</p>
                    @if (program.instructor) { <p class="mt-1 text-xs text-gray-500">Formateur : {{ program.instructor }}</p> }
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button type="button" (click)="editProgram(program)" class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-gray-200">Modifier</button>
                    @if (program.status !== 'archived') {
                      <button type="button" (click)="archiveProgram(program)" [disabled]="saving()" class="rounded-lg border border-amber-900/70 px-3 py-2 text-xs font-bold text-amber-200">Archiver</button>
                    }
                    <button type="button" (click)="deleteProgram(program)" [disabled]="saving()" class="rounded-lg border border-red-900/70 px-3 py-2 text-xs font-bold text-red-200">Supprimer</button>
                  </div>
                </div>
              </article>
            }
          </div>
        </section>
      }

      @if (activeTab() === 'sessions') {
        <section class="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <form class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6" (ngSubmit)="saveSession()">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-jacquier-gold">{{ editingSessionId() ? 'Modification' : 'Nouvelle session' }}</p>
            <h2 class="mt-1 font-serif text-xl font-bold text-white">Planifier un créneau</h2>
            <div class="mt-6 grid gap-4">
              <label class="grid gap-1 text-sm text-gray-300">Programme
                <select required [ngModel]="sessionDraft().programId" (ngModelChange)="patchSession({ programId: $event }); syncSessionCapacity($event)" name="sessionProgram"
                  class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white">
                  <option value="">Choisir…</option>
                  @for (program of schedulablePrograms(); track program.id) { <option [value]="program.id">{{ program.title }}</option> }
                </select>
              </label>
              <div class="grid gap-4 sm:grid-cols-2">
                <label class="grid gap-1 text-sm text-gray-300">Début
                  <input type="datetime-local" required [ngModel]="sessionDraft().startsAt" (ngModelChange)="patchSession({ startsAt: $event })" name="sessionStart"
                    class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white" />
                </label>
                <label class="grid gap-1 text-sm text-gray-300">Fin
                  <input type="datetime-local" required [ngModel]="sessionDraft().endsAt" (ngModelChange)="patchSession({ endsAt: $event })" name="sessionEnd"
                    class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white" />
                </label>
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <label class="grid gap-1 text-sm text-gray-300">Capacité
                  <input type="number" min="1" max="500" [ngModel]="sessionDraft().capacity" (ngModelChange)="patchSession({ capacity: numberValue($event) })" name="sessionCapacity"
                    class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white" />
                </label>
                <label class="grid gap-1 text-sm text-gray-300">Statut
                  <select [ngModel]="sessionDraft().status" (ngModelChange)="patchSession({ status: $event })" name="sessionStatus"
                    class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white">
                    <option value="scheduled">Planifiée</option>
                    <option value="cancelled">Annulée</option>
                    <option value="completed">Terminée</option>
                  </select>
                </label>
              </div>
              <label class="grid gap-1 text-sm text-gray-300">Lieu
                <input maxlength="180" [ngModel]="sessionDraft().location" (ngModelChange)="patchSession({ location: $event })" name="sessionLocation"
                  placeholder="Le Jacquier, Kipé"
                  class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-white" />
              </label>
            </div>
            <div class="mt-5 flex gap-2">
              <button type="submit" [disabled]="saving()" class="rounded-lg bg-jacquier-gold px-5 py-2.5 text-sm font-bold text-jacquier-dark disabled:opacity-50">
                {{ editingSessionId() ? 'Enregistrer' : 'Planifier' }}
              </button>
              @if (editingSessionId()) {
                <button type="button" (click)="resetSessionDraft()" class="rounded-lg border border-gray-700 px-4 py-2.5 text-sm text-gray-300">Annuler</button>
              }
            </div>
          </form>

          <div class="space-y-4">
            @if (!sessions().length) {
              <div class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-10 text-center text-gray-400">Aucune session planifiée.</div>
            }
            @for (session of sortedSessions(); track session.id) {
              <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div class="flex flex-wrap gap-2">
                      <span [class]="sessionStatusClass(session.status)">{{ sessionStatusLabel(session.status) }}</span>
                      <span class="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold text-gray-300">
                        {{ session.remainingPlaces }}/{{ session.capacity }} places restantes
                      </span>
                    </div>
                    <h3 class="mt-3 font-serif text-lg font-bold text-white">{{ programName(session.programId) }}</h3>
                    <p class="mt-2 text-sm text-gray-300">{{ formatDateTime(session.startsAt) }} → {{ formatDateTime(session.endsAt) }}</p>
                    <p class="mt-1 text-xs text-gray-500">{{ session.location || 'Lieu à préciser' }} · {{ session.registeredCount }} inscription(s)</p>
                  </div>
                  <div class="flex gap-2">
                    <button type="button" (click)="editSession(session)" class="rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-gray-200">Modifier</button>
                    <button type="button" (click)="removeSession(session)" [disabled]="saving()" class="rounded-lg border border-red-900/70 px-3 py-2 text-xs font-bold text-red-200">
                      {{ session.registeredCount ? 'Annuler' : 'Supprimer' }}
                    </button>
                  </div>
                </div>
              </article>
            }
          </div>
        </section>
      }

      @if (activeTab() === 'registrations') {
        <section class="space-y-5">
          <div class="flex flex-col gap-3 rounded-2xl border border-gray-800 bg-[#1a1a1a] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="font-serif text-xl font-bold text-white">Inscriptions reçues</h2>
              <p class="mt-1 text-xs text-gray-500">Une place reste occupée tant que l’inscription n’est pas annulée.</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <select [ngModel]="registrationFilter()" (ngModelChange)="registrationFilter.set($event)"
                class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-sm text-white">
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmé</option>
                <option value="paid">Payé</option>
                <option value="cancelled">Annulé</option>
              </select>
              <select [ngModel]="registrationPeriod()" (ngModelChange)="registrationPeriod.set($event)"
                class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-sm text-white">
                <option value="all">Toutes les dates</option>
                <option value="upcoming">Sessions à venir</option>
                <option value="past">Sessions passées</option>
              </select>
            </div>
          </div>

          @if (!filteredRegistrations().length) {
            <div class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-10 text-center text-gray-400">Aucune inscription pour ce filtre.</div>
          }

          <div class="grid gap-4 xl:grid-cols-2">
            @for (registration of filteredRegistrations(); track registration.id) {
              <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-5">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div class="flex items-center gap-2">
                      <span [class]="registrationStatusClass(registration.status)">{{ registrationStatusLabel(registration.status) }}</span>
                      @if (needsFollowUp(registration)) {
                        <span class="rounded-full bg-orange-500/10 px-2.5 py-1 text-[10px] font-bold text-orange-300">À relancer</span>
                      }
                      <span class="text-xs text-gray-500">#{{ registration.id.slice(0, 8).toUpperCase() }}</span>
                    </div>
                    <h3 class="mt-3 font-serif text-lg font-bold text-white">{{ registration.fullName }}</h3>
                    <p class="mt-1 text-sm text-gray-400">{{ programNameForRegistration(registration) }}</p>
                    <p class="mt-1 text-xs text-gray-500">{{ sessionDateForRegistration(registration) }}</p>
                  </div>
                  <select [ngModel]="registration.status" (ngModelChange)="changeRegistrationStatus(registration, $event)" [disabled]="saving()"
                    class="rounded-lg border border-gray-700 bg-[#121212] px-3 py-2 text-xs text-white">
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="paid">Payé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
                <div class="mt-4 grid gap-2 text-sm text-gray-300 sm:grid-cols-2">
                  <a [href]="'mailto:' + registration.email" class="hover:text-jacquier-gold">{{ registration.email }}</a>
                  <a [href]="'tel:' + phoneHref(registration.phone)" class="hover:text-jacquier-gold">{{ registration.phone }}</a>
                </div>
                @if (registration.notes) {
                  <p class="mt-4 rounded-xl bg-black/20 px-4 py-3 text-sm leading-6 text-gray-400">{{ registration.notes }}</p>
                }
                @if (registration.priceSnapshot !== null && registration.priceSnapshot !== undefined) {
                  <p class="mt-4 text-xs font-bold text-jacquier-gold">Tarif enregistré : {{ formatPrice(registration.priceSnapshot) }}</p>
                }
              </article>
            }
          </div>
        </section>
      }

      <section class="rounded-2xl border border-blue-900/40 bg-blue-950/20 p-5 text-sm leading-6 text-blue-100">
        <strong>Phase suivante :</strong> paiement en ligne, PDF/devis, e-mails transactionnels et WhatsApp automatisé ne sont pas activés. Cette V1 conserve une communication manuelle explicite afin de ne pas prétendre qu’un message a été envoyé lorsqu’aucun fournisseur externe n’est configuré.
      </section>
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn .6s ease-out forwards; } @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`]
})
export class AdminSchoolComponent {
  private readonly adminData = inject(AdminDataService);

  readonly programs = signal<SchoolProgram[]>([]);
  readonly sessions = signal<SchoolSession[]>([]);
  readonly registrations = signal<SchoolRegistration[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly activeTab = signal<'programs' | 'sessions' | 'registrations'>('programs');
  readonly editingProgramId = signal<string | null>(null);
  readonly editingSessionId = signal<string | null>(null);
  readonly registrationFilter = signal<'all' | SchoolRegistrationStatus>('all');
  readonly registrationPeriod = signal<'all' | 'upcoming' | 'past'>('all');

  readonly levels: SchoolLevel[] = ['Débutant', 'Intermédiaire', 'Pro'];
  readonly tabs = [
    { id: 'programs' as const, label: 'Programmes' },
    { id: 'sessions' as const, label: 'Sessions & jauges' },
    { id: 'registrations' as const, label: 'Inscriptions' }
  ];

  readonly programDraft = signal<ProgramDraft>(this.emptyProgramDraft());
  readonly sessionDraft = signal<SessionDraft>(this.emptySessionDraft());

  readonly sortedPrograms = computed(() => [...this.programs()].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));
  readonly sortedSessions = computed(() => [...this.sessions()].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()));
  readonly publishedPrograms = computed(() => this.programs().filter(program => program.status === 'published').length);
  readonly schedulablePrograms = computed(() => this.programs().filter(program => program.status !== 'archived'));
  readonly upcomingSessions = computed(() => this.sessions().filter(session => session.status === 'scheduled' && new Date(session.startsAt) > new Date()).length);
  readonly pendingRegistrations = computed(() => this.registrations().filter(item => item.status === 'pending').length);
  readonly filteredRegistrations = computed(() => {
    const status = this.registrationFilter();
    const period = this.registrationPeriod();
    const now = Date.now();

    return this.registrations().filter(item => {
      if (status !== 'all' && item.status !== status) return false;
      if (period === 'all') return true;

      const session = this.sessions().find(value => value.id === item.sessionId);
      if (!session) return false;
      const isUpcoming = new Date(session.startsAt).getTime() >= now;
      return period === 'upcoming' ? isUpcoming : !isUpcoming;
    });
  });

  constructor() { void this.load(); }

  private emptyProgramDraft(): ProgramDraft {
    return {
      title: '', description: '', duration: '', level: 'Débutant', price: null,
      capacity: 8, prerequisites: '', instructor: '', materialsText: '',
      status: 'draft', displayOrder: 0
    };
  }

  private emptySessionDraft(): SessionDraft {
    return { programId: '', startsAt: '', endsAt: '', capacity: 8, location: 'Le Jacquier, Kipé', status: 'scheduled' };
  }

  numberValue(value: string | number): number { return Number(value); }
  nullableNumber(value: string | number | null): number | null { return value === '' || value === null ? null : Number(value); }
  patchProgram(patch: Partial<ProgramDraft>): void { this.programDraft.update(value => ({ ...value, ...patch })); }
  patchSession(patch: Partial<SessionDraft>): void { this.sessionDraft.update(value => ({ ...value, ...patch })); }

  async load(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      const [programs, sessions, registrations] = await Promise.all([
        this.adminData.getSchoolPrograms(),
        this.adminData.getSchoolSessions(),
        this.adminData.getSchoolRegistrations()
      ]);
      this.programs.set(programs);
      this.sessions.set(sessions);
      this.registrations.set(registrations);
      if (!this.editingProgramId()) this.resetProgramDraft();
      if (!this.editingSessionId()) this.resetSessionDraft();
    } catch {
      this.errorMessage.set('Impossible de charger complètement le module École. Vérifiez votre session puis réessayez.');
    } finally {
      this.loading.set(false);
    }
  }

  resetProgramDraft(): void {
    this.editingProgramId.set(null);
    const nextOrder = this.programs().length ? Math.max(...this.programs().map(program => program.displayOrder ?? 0)) + 10 : 0;
    this.programDraft.set({ ...this.emptyProgramDraft(), displayOrder: nextOrder });
  }

  editProgram(program: SchoolProgram): void {
    this.editingProgramId.set(program.id);
    this.programDraft.set({
      title: program.title ?? '',
      description: program.description ?? '',
      duration: program.duration ?? '',
      level: (program.level as SchoolLevel) || 'Débutant',
      price: program.price ?? null,
      capacity: program.capacity ?? 8,
      prerequisites: program.prerequisites ?? '',
      instructor: program.instructor ?? '',
      materialsText: (program.materialsIncluded ?? []).join(', '),
      status: program.status ?? (program.active !== false ? 'published' : 'draft'),
      displayOrder: program.displayOrder ?? 0
    });
    this.activeTab.set('programs');
  }

  async saveProgram(): Promise<void> {
    const raw = this.programDraft();
    if (!raw.title.trim() || raw.capacity < 1 || raw.capacity > 500) {
      this.errorMessage.set('Vérifiez le titre et la capacité du programme.');
      return;
    }
    const payload = {
      title: raw.title.trim(),
      description: raw.description.trim() || null,
      duration: raw.duration.trim() || null,
      level: raw.level,
      price: raw.price,
      capacity: raw.capacity,
      prerequisites: raw.prerequisites.trim() || null,
      instructor: raw.instructor.trim() || null,
      materialsIncluded: raw.materialsText.split(',').map(item => item.trim()).filter(Boolean),
      status: raw.status,
      active: raw.status === 'published',
      displayOrder: raw.displayOrder
    };

    this.saving.set(true);
    this.errorMessage.set('');
    try {
      const id = this.editingProgramId();
      const saved = id
        ? await this.adminData.updateSchoolProgram(id, payload)
        : await this.adminData.createSchoolProgram(payload);
      this.programs.update(items => id ? items.map(item => item.id === saved.id ? saved : item) : [...items, saved]);
      this.resetProgramDraft();
    } catch {
      this.errorMessage.set('Le programme n’a pas pu être enregistré. Vérifiez les champs saisis.');
    } finally {
      this.saving.set(false);
    }
  }

  async archiveProgram(program: SchoolProgram): Promise<void> {
    this.saving.set(true);
    try {
      const saved = await this.adminData.updateSchoolProgram(program.id, { status: 'archived', active: false });
      this.programs.update(items => items.map(item => item.id === saved.id ? saved : item));
    } catch {
      this.errorMessage.set('Le programme n’a pas pu être archivé.');
    } finally {
      this.saving.set(false);
    }
  }

  async deleteProgram(program: SchoolProgram): Promise<void> {
    if (!window.confirm(`Supprimer définitivement « ${program.title} » ? L’archivage est recommandé.`)) return;
    this.saving.set(true);
    try {
      await this.adminData.deleteSchoolProgram(program.id);
      this.programs.update(items => items.filter(item => item.id !== program.id));
      this.resetProgramDraft();
    } catch {
      this.errorMessage.set('Suppression refusée : archivez le programme s’il possède déjà des sessions.');
    } finally {
      this.saving.set(false);
    }
  }

  resetSessionDraft(): void {
    this.editingSessionId.set(null);
    this.sessionDraft.set(this.emptySessionDraft());
  }

  syncSessionCapacity(programId: string): void {
    const capacity = this.programs().find(program => program.id === programId)?.capacity;
    if (capacity) this.patchSession({ capacity });
  }

  editSession(session: SchoolSession): void {
    this.editingSessionId.set(session.id);
    this.sessionDraft.set({
      programId: session.programId,
      startsAt: this.toLocalInput(session.startsAt),
      endsAt: this.toLocalInput(session.endsAt),
      capacity: session.capacity,
      location: session.location ?? '',
      status: session.status
    });
    this.activeTab.set('sessions');
  }

  async saveSession(): Promise<void> {
    const raw = this.sessionDraft();
    if (!raw.programId || !raw.startsAt || !raw.endsAt || raw.capacity < 1) {
      this.errorMessage.set('Programme, dates et capacité sont obligatoires.');
      return;
    }
    const payload = {
      programId: raw.programId,
      startsAt: new Date(raw.startsAt).toISOString(),
      endsAt: new Date(raw.endsAt).toISOString(),
      capacity: raw.capacity,
      location: raw.location.trim() || null,
      status: raw.status
    };

    this.saving.set(true);
    this.errorMessage.set('');
    try {
      const id = this.editingSessionId();
      const saved = id
        ? await this.adminData.updateSchoolSession(id, payload)
        : await this.adminData.createSchoolSession(payload);
      this.sessions.update(items => id ? items.map(item => item.id === saved.id ? saved : item) : [...items, saved]);
      this.resetSessionDraft();
    } catch {
      this.errorMessage.set('La session n’a pas pu être enregistrée. Vérifiez les dates et la capacité.');
    } finally {
      this.saving.set(false);
    }
  }

  async removeSession(session: SchoolSession): Promise<void> {
    const action = session.registeredCount ? 'annuler' : 'supprimer';
    if (!window.confirm(`Voulez-vous ${action} cette session ?`)) return;
    this.saving.set(true);
    try {
      const result = await this.adminData.deleteSchoolSession(session.id);
      if (result && typeof result === 'object' && 'id' in result) {
        this.sessions.update(items => items.map(item => item.id === session.id ? result as SchoolSession : item));
      } else {
        this.sessions.update(items => items.filter(item => item.id !== session.id));
      }
    } catch {
      this.errorMessage.set('La session n’a pas pu être modifiée.');
    } finally {
      this.saving.set(false);
    }
  }

  async changeRegistrationStatus(registration: SchoolRegistration, status: SchoolRegistrationStatus): Promise<void> {
    this.saving.set(true);
    try {
      const saved = await this.adminData.updateSchoolRegistrationStatus(registration.id, status);
      this.registrations.update(items => items.map(item => item.id === saved.id ? saved : item));
      const sessions = await this.adminData.getSchoolSessions();
      this.sessions.set(sessions);
    } catch {
      this.errorMessage.set('Le statut de l’inscription n’a pas pu être modifié.');
    } finally {
      this.saving.set(false);
    }
  }

  programName(programId: string): string {
    return this.programs().find(program => program.id === programId)?.title || 'Programme';
  }

  programNameForRegistration(registration: SchoolRegistration): string {
    const session = this.sessions().find(item => item.id === registration.sessionId);
    return session ? this.programName(session.programId) : 'Session';
  }

  sessionDateForRegistration(registration: SchoolRegistration): string {
    const session = this.sessions().find(item => item.id === registration.sessionId);
    return session ? this.formatDateTime(session.startsAt) : 'Date indisponible';
  }

  formatDateTime(value: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Africa/Conakry',
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  }

  toLocalInput(value: string): string {
    const date = new Date(value);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  formatPrice(value: number | null | undefined): string {
    return value === null || value === undefined ? 'Prix à préciser' : `${new Intl.NumberFormat('fr-FR').format(value)} GNF`;
  }

  phoneHref(value: string): string {
    return value.replace(/[^+\d]/g, '');
  }

  programStatusLabel(program: SchoolProgram): string {
    const status = program.status ?? (program.active !== false ? 'published' : 'draft');
    return status === 'published' ? 'Publié' : status === 'archived' ? 'Archivé' : 'Brouillon';
  }

  programStatusClass(program: SchoolProgram): string {
    const status = program.status ?? (program.active !== false ? 'published' : 'draft');
    if (status === 'published') return 'rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300';
    if (status === 'archived') return 'rounded-full bg-gray-700 px-2.5 py-1 text-[10px] font-bold text-gray-300';
    return 'rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-300';
  }

  sessionStatusLabel(status: SchoolSessionStatus): string {
    return status === 'scheduled' ? 'Planifiée' : status === 'cancelled' ? 'Annulée' : 'Terminée';
  }

  sessionStatusClass(status: SchoolSessionStatus): string {
    if (status === 'scheduled') return 'rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300';
    if (status === 'cancelled') return 'rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold text-red-300';
    return 'rounded-full bg-gray-700 px-2.5 py-1 text-[10px] font-bold text-gray-300';
  }

  needsFollowUp(registration: SchoolRegistration): boolean {
    if (registration.status !== 'pending' || !registration.createdAt) return false;
    return Date.now() - new Date(registration.createdAt).getTime() >= 24 * 60 * 60 * 1000;
  }

  registrationStatusLabel(status: SchoolRegistrationStatus): string {
    return status === 'pending' ? 'En attente' : status === 'confirmed' ? 'Confirmé' : status === 'paid' ? 'Payé' : 'Annulé';
  }

  registrationStatusClass(status: SchoolRegistrationStatus): string {
    if (status === 'pending') return 'rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-300';
    if (status === 'confirmed') return 'rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold text-blue-300';
    if (status === 'paid') return 'rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300';
    return 'rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold text-red-300';
  }
}
