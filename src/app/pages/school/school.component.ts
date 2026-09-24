import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RestaurantService } from '../../core/services/restaurant.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { SchoolSession } from '../../core/models';

@Component({
  selector: 'app-school',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative h-[52vh] flex items-center justify-center text-center px-4 overflow-hidden bg-jacquier-dark">
      <img [ngSrc]="siteSettings.image('schoolHero', '/og-image.png').url" fill priority
        class="object-cover opacity-40"
        [alt]="siteSettings.image('schoolHero', '').altText || 'École de Gastronomie du Jacquier'"
        referrerPolicy="no-referrer">
      <div class="relative z-10 max-w-4xl mx-auto text-white">
        <span class="block text-jacquier-gold font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base">Formation & transmission</span>
        <h1 class="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">École de Gastronomie</h1>
        <p class="text-lg md:text-xl text-jacquier-light max-w-2xl mx-auto font-light leading-relaxed">
          Ateliers, masterclass et sessions publiés par Le Jacquier, avec inscription en ligne sur les créneaux disponibles.
        </p>
      </div>
    </div>

    <section class="bg-white px-4 py-20">
      <div class="mx-auto max-w-5xl text-center">
        <span class="text-jacquier-gold font-bold tracking-widest uppercase text-sm">Catalogue officiel</span>
        <h2 class="mt-3 text-4xl md:text-5xl font-serif font-bold text-jacquier-primary">Formations actuellement disponibles</h2>
        <p class="mx-auto mt-5 max-w-2xl font-light leading-relaxed text-jacquier-text">
          Les niveaux, tarifs, capacités et prochaines sessions ci-dessous proviennent directement de l’administration du restaurant.
        </p>
      </div>
    </section>

    <section class="py-20 bg-jacquier-cream px-4">
      <div class="max-w-7xl mx-auto">
        @if (isLoading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="status" aria-live="polite" aria-label="Chargement des programmes">
            @for (i of skeletonPlaceholders; track i) {
              <div class="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 animate-pulse space-y-4">
                <div class="h-6 bg-gray-200 rounded w-2/3"></div>
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                <div class="h-16 bg-gray-200 rounded"></div>
              </div>
            }
          </div>
        } @else if (loadError()) {
          <div class="text-center py-20 bg-white rounded-3xl shadow-lg border border-red-100">
            <p class="text-red-600 text-xl mb-6 font-light">{{ loadError() }}</p>
            <button (click)="retry()" class="px-8 py-3 bg-jacquier-primary text-white rounded-xl font-bold uppercase tracking-wide hover:bg-jacquier-burgundy transition-colors min-h-[44px]">Réessayer</button>
          </div>
        } @else if (programs().length === 0) {
          <div class="text-center py-20 bg-white rounded-3xl shadow-lg border border-gray-100">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-jacquier-gold">Prochaines formations</p>
            <h2 class="mt-3 font-serif text-2xl font-bold text-jacquier-dark">Le prochain programme sera annoncé ici</h2>
            <p class="mx-auto mt-3 max-w-xl text-jacquier-text/70">Pour connaître les prochaines sessions ou manifester votre intérêt, contactez directement Le Jacquier.</p>
            <a routerLink="/contact" class="mt-6 inline-flex rounded-xl bg-jacquier-primary px-6 py-3 text-sm font-bold text-white">Nous contacter</a>
          </div>
        } @else {
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
            @for (program of programs(); track program.id) {
              <article class="flex flex-col rounded-3xl border border-gray-100 bg-white p-7 shadow-lg md:p-9">
                <div class="flex flex-wrap items-center gap-2">
                  @if (program.level) {
                    <span class="rounded-full bg-jacquier-cream px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-jacquier-primary">{{ program.level }}</span>
                  }
                  @if (program.price !== null && program.price !== undefined) {
                    <span class="rounded-full bg-jacquier-primary/10 px-3 py-1.5 text-xs font-bold text-jacquier-primary">{{ formatPrice(program.price) }}</span>
                  }
                </div>

                <h3 class="mt-5 text-2xl font-serif font-bold text-jacquier-dark">{{ program.title }}</h3>
                @if (program.description) {
                  <p class="mt-4 text-gray-600 font-light leading-relaxed">{{ program.description }}</p>
                }

                <dl class="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div class="rounded-2xl bg-jacquier-cream/70 p-4">
                    <dt class="text-xs uppercase tracking-wider text-jacquier-text/60">Durée</dt>
                    <dd class="mt-1 font-bold text-jacquier-dark">{{ program.duration || 'À préciser' }}</dd>
                  </div>
                  <div class="rounded-2xl bg-jacquier-cream/70 p-4">
                    <dt class="text-xs uppercase tracking-wider text-jacquier-text/60">Capacité</dt>
                    <dd class="mt-1 font-bold text-jacquier-dark">{{ program.capacity ? program.capacity + ' places max.' : 'Selon session' }}</dd>
                  </div>
                  @if (program.instructor) {
                    <div class="col-span-2 rounded-2xl bg-jacquier-cream/70 p-4">
                      <dt class="text-xs uppercase tracking-wider text-jacquier-text/60">Chef / formateur</dt>
                      <dd class="mt-1 font-bold text-jacquier-dark">{{ program.instructor }}</dd>
                    </div>
                  }
                </dl>

                @if (program.prerequisites) {
                  <div class="mt-5">
                    <p class="text-xs font-bold uppercase tracking-wider text-jacquier-gold">Prérequis</p>
                    <p class="mt-1 text-sm leading-relaxed text-jacquier-text">{{ program.prerequisites }}</p>
                  </div>
                }

                @if (program.materialsIncluded?.length) {
                  <div class="mt-5">
                    <p class="text-xs font-bold uppercase tracking-wider text-jacquier-gold">Matériel inclus</p>
                    <p class="mt-1 text-sm leading-relaxed text-jacquier-text">{{ program.materialsIncluded?.join(' · ') }}</p>
                  </div>
                }

                <div class="mt-7 border-t border-gray-100 pt-6">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="text-xs font-bold uppercase tracking-[0.14em] text-jacquier-gold">Prochaines sessions</p>
                      <p class="mt-1 text-sm text-jacquier-text/70">Choisissez un créneau encore disponible.</p>
                    </div>
                  </div>

                  @if (sessionsLoading()) {
                    <p class="mt-4 text-sm text-jacquier-text/60">Chargement des créneaux…</p>
                  } @else if (sessionsFor(program.id).length === 0) {
                    <p class="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-jacquier-text/70">Aucune date n’est encore ouverte pour ce programme.</p>
                  } @else {
                    <div class="mt-4 space-y-3">
                      @for (session of sessionsFor(program.id); track session.id) {
                        <div class="rounded-2xl border border-gray-200 p-4">
                          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p class="font-bold text-jacquier-dark">{{ formatSessionDate(session) }}</p>
                              <p class="mt-1 text-sm text-jacquier-text/70">{{ formatSessionTime(session) }}@if (session.location) { · {{ session.location }} }</p>
                              <p class="mt-2 text-xs font-bold" [class.text-red-600]="session.remainingPlaces === 0" [class.text-emerald-700]="session.remainingPlaces > 0">
                                {{ session.remainingPlaces === 0 ? 'Complet' : session.remainingPlaces + ' place(s) restante(s)' }}
                              </p>
                            </div>
                            <button type="button" (click)="openRegistration(session)" [disabled]="session.remainingPlaces === 0"
                              class="min-h-[44px] rounded-xl bg-jacquier-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-jacquier-burgundy disabled:cursor-not-allowed disabled:bg-gray-300">
                              S’inscrire
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              </article>
            }
          </div>
        }
      </div>
    </section>

    @if (selectedSession(); as session) {
      <section id="school-registration" class="bg-white px-4 py-20">
        <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-jacquier-gold">Inscription</p>
            <h2 class="mt-3 font-serif text-3xl font-bold text-jacquier-primary">Demander une place</h2>
            <p class="mt-4 leading-relaxed text-jacquier-text/80">
              {{ programTitle(session.programId) }} · {{ formatSessionDate(session) }} · {{ formatSessionTime(session) }}
            </p>
            <p class="mt-4 rounded-2xl bg-jacquier-cream p-4 text-sm leading-relaxed text-jacquier-text">
              L’inscription est enregistrée avec le statut <strong>En attente</strong>. Le restaurant doit ensuite confirmer la place. Aucun paiement en ligne ni e-mail automatique n’est activé pour le moment.
            </p>
          </div>

          <form [formGroup]="registrationForm" (ngSubmit)="submitRegistration()" class="grid gap-4 rounded-3xl border border-gray-100 bg-jacquier-cream/50 p-6 shadow-lg md:grid-cols-2 md:p-8">
            <label class="grid gap-2 text-sm font-semibold text-jacquier-dark md:col-span-2">Nom complet
              <input formControlName="fullName" autocomplete="name" maxlength="160"
                class="min-h-[46px] rounded-xl border border-gray-300 bg-white px-4 outline-none focus:border-jacquier-gold" />
            </label>
            <label class="grid gap-2 text-sm font-semibold text-jacquier-dark">E-mail
              <input type="email" formControlName="email" autocomplete="email" maxlength="254"
                class="min-h-[46px] rounded-xl border border-gray-300 bg-white px-4 outline-none focus:border-jacquier-gold" />
            </label>
            <label class="grid gap-2 text-sm font-semibold text-jacquier-dark">Téléphone
              <input formControlName="phone" autocomplete="tel" maxlength="32"
                class="min-h-[46px] rounded-xl border border-gray-300 bg-white px-4 outline-none focus:border-jacquier-gold" />
            </label>
            <label class="grid gap-2 text-sm font-semibold text-jacquier-dark md:col-span-2">Remarque <span class="font-normal text-jacquier-text/60">(facultatif)</span>
              <textarea formControlName="notes" maxlength="1200" rows="4"
                class="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-jacquier-gold"></textarea>
            </label>

            @if (registrationError()) {
              <p role="alert" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">{{ registrationError() }}</p>
            }
            @if (registrationSuccess()) {
              <p role="status" class="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 md:col-span-2">
                Demande d’inscription reçue. Référence : <strong>{{ registrationSuccess() }}</strong>. Statut : En attente.
              </p>
            }

            <div class="flex flex-wrap gap-3 md:col-span-2">
              <button type="submit" [disabled]="registrationForm.invalid || submitting()"
                class="min-h-[46px] rounded-xl bg-jacquier-primary px-6 py-3 text-sm font-bold text-white disabled:opacity-50">
                {{ submitting() ? 'Envoi…' : 'Envoyer ma demande' }}
              </button>
              <button type="button" (click)="closeRegistration()" class="min-h-[46px] rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-jacquier-dark">
                Fermer
              </button>
            </div>
          </form>
        </div>
      </section>
    }

    <section class="bg-jacquier-primary px-4 py-16 text-center text-white">
      <h2 class="font-serif text-3xl font-bold">Une question sur une formation ?</h2>
      <p class="mx-auto mt-4 max-w-xl text-jacquier-light">Le restaurant peut vous renseigner sur les prochaines dates, le contenu des ateliers ou votre demande d’inscription.</p>
      <a routerLink="/contact" class="mt-7 inline-flex rounded-xl bg-white px-6 py-3 font-bold text-jacquier-primary">Contacter Le Jacquier</a>
    </section>
  `
})
export class SchoolComponent {
  private readonly formBuilder = inject(FormBuilder);
  readonly restaurantService = inject(RestaurantService);
  readonly siteSettings = inject(SiteSettingsService);

  readonly programs = this.restaurantService.getSchoolPrograms();
  readonly sessions = this.restaurantService.getSchoolSessions();
  readonly isLoading = this.restaurantService.isLoadingSchool();
  readonly sessionsLoading = this.restaurantService.isLoadingSchoolSessions();
  readonly loadError = this.restaurantService.getSchoolError();
  readonly selectedSessionId = signal<string | null>(null);
  readonly submitting = signal(false);
  readonly registrationError = signal('');
  readonly registrationSuccess = signal('');
  readonly skeletonPlaceholders = Array.from({ length: 3 }, (_, i) => i);

  readonly selectedSession = computed(() =>
    this.sessions().find(session => session.id === this.selectedSessionId()) ?? null
  );

  readonly registrationForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(160)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    phone: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
    notes: ['', [Validators.maxLength(1200)]]
  });

  sessionsFor(programId: string): SchoolSession[] {
    return this.sessions().filter(session => session.programId === programId && session.status === 'scheduled');
  }

  programTitle(programId: string): string {
    return this.programs().find(program => program.id === programId)?.title || 'Formation';
  }

  formatPrice(price: number): string {
    return `${new Intl.NumberFormat('fr-FR').format(price)} GNF`;
  }

  formatSessionDate(session: SchoolSession): string {
    return new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Africa/Conakry',
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(session.startsAt));
  }

  formatSessionTime(session: SchoolSession): string {
    const formatter = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Africa/Conakry',
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${formatter.format(new Date(session.startsAt))} – ${formatter.format(new Date(session.endsAt))}`;
  }

  openRegistration(session: SchoolSession): void {
    if (session.remainingPlaces <= 0) return;
    this.selectedSessionId.set(session.id);
    this.registrationError.set('');
    this.registrationSuccess.set('');
    queueMicrotask(() => document.getElementById('school-registration')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  closeRegistration(): void {
    this.selectedSessionId.set(null);
    this.registrationError.set('');
    this.registrationSuccess.set('');
  }

  async submitRegistration(): Promise<void> {
    const session = this.selectedSession();
    if (!session || this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.registrationError.set('');
    this.registrationSuccess.set('');
    try {
      const receipt = await this.restaurantService.submitSchoolRegistration({
        sessionId: session.id,
        ...this.registrationForm.getRawValue()
      });
      this.registrationSuccess.set(receipt.id.slice(0, 8).toUpperCase());
      this.registrationForm.reset({ fullName: '', email: '', phone: '', notes: '' });
      await this.restaurantService.retryLoadSchoolSessions();
    } catch (error) {
      const message = error instanceof HttpErrorResponse && typeof error.error?.error === 'string'
        ? error.error.error
        : 'La demande d’inscription n’a pas pu être envoyée. Merci de réessayer.';
      this.registrationError.set(message);
    } finally {
      this.submitting.set(false);
    }
  }

  retry(): void {
    void Promise.all([
      this.restaurantService.retryLoadSchoolPrograms(),
      this.restaurantService.retryLoadSchoolSessions()
    ]);
  }
}
