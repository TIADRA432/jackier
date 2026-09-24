import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AdminDataService, AdminReservation, ReservationWorkflowStatus } from '../../../core/services/admin-data.service';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

const STATUS_LABELS: Record<ReservationWorkflowStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
  completed: 'Terminée'
};

const STATUS_CLASSES: Record<ReservationWorkflowStatus, string> = {
  pending: 'bg-orange-500/10 text-orange-500',
  confirmed: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-red-500/10 text-red-500',
  completed: 'bg-blue-500/10 text-blue-500'
};

@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">Réservations</h1>
          <p class="text-gray-400 text-sm mt-1">Demandes réelles reçues depuis le site.</p>
        </div>
        <button type="button" (click)="load()" [disabled]="loading()" class="self-start rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold text-gray-200 transition hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-50">
          {{ loading() ? 'Actualisation…' : 'Actualiser' }}
        </button>
      </div>

      @if (errorMessage()) {
        <div role="alert" class="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          {{ errorMessage() }} <button type="button" (click)="load()" class="ml-2 font-bold underline">Réessayer</button>
        </div>
      }

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <section class="lg:col-span-3 overflow-hidden rounded-2xl border border-gray-800 bg-[#1a1a1a]">
          <div class="flex items-center justify-between border-b border-gray-800 p-6">
            <h2 class="text-lg font-serif font-bold text-white">Liste des demandes</h2>
            <span class="text-sm text-gray-400">{{ reservations().length }} au total</span>
          </div>
          @if (loading()) {
            <div class="p-12 text-center text-gray-400" role="status">Chargement des réservations…</div>
          } @else if (!reservations().length) {
            <div class="p-12 text-center text-gray-400">Aucune réservation pour le moment.</div>
          } @else {
            <div class="overflow-x-auto p-6">
              <table class="w-full border-collapse text-left text-sm">
                <thead><tr class="border-b border-gray-800 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <th class="pb-4">Client</th><th class="pb-4">Contact</th><th class="pb-4">Date</th><th class="pb-4">Heure</th><th class="pb-4">Couverts</th><th class="pb-4">Statut</th><th class="pb-4">Communication</th><th class="pb-4 text-right">Modifier</th>
                </tr></thead>
                <tbody>
                  @for (reservation of reservations(); track reservation.id) {
                    <tr class="border-b border-gray-800/50 transition-colors hover:bg-gray-800/20">
                      <td class="py-4">
                        <p class="font-medium text-white">{{ reservation.name }}</p>
                        <p class="mt-1 font-mono text-[10px] text-gray-600">#{{ shortReference(reservation.id) }}</p>
                      </td>
                      <td class="py-4 text-xs text-gray-300">
                        @if (reservation.phone) { <a [href]="'tel:' + reservation.phone" class="block hover:text-jacquier-gold">{{ reservation.phone }}</a> }
                        @if (reservation.email) { <a [href]="'mailto:' + reservation.email" class="mt-1 block hover:text-jacquier-gold">{{ reservation.email }}</a> }
                      </td>
                      <td class="py-4 text-gray-300">{{ reservation.date }}</td>
                      <td class="py-4 text-gray-300">{{ reservation.time }}</td>
                      <td class="py-4 text-gray-300">{{ reservation.guests }} pers.</td>
                      <td class="py-4"><span [class]="'rounded-md px-2 py-1 text-[10px] font-bold uppercase ' + statusClass(reservation.status)">{{ statusLabel(reservation.status) }}</span></td>
                      <td class="py-4">
                        <div class="flex flex-wrap gap-2">
                          @if (reservation.phone) {
                            <a [href]="whatsappHref(reservation)" target="_blank" rel="noopener noreferrer"
                              class="rounded-lg border border-emerald-800/70 px-2 py-1 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/10">
                              WhatsApp
                            </a>
                          }
                          @if (reservation.email) {
                            <a [href]="emailHref(reservation)"
                              class="rounded-lg border border-gray-700 px-2 py-1 text-[10px] font-bold text-gray-300 hover:border-jacquier-gold hover:text-jacquier-gold">
                              E-mail
                            </a>
                          }
                          <button type="button" (click)="copyCustomerMessage(reservation)"
                            class="rounded-lg border border-gray-700 px-2 py-1 text-[10px] font-bold text-gray-300 hover:border-jacquier-gold hover:text-jacquier-gold">
                            Copier
                          </button>
                        </div>
                      </td>
                      <td class="py-4 text-right">
                        <label class="sr-only" [for]="'status-' + reservation.id">Statut de {{ reservation.name }}</label>
                        <select [id]="'status-' + reservation.id" [value]="reservation.status" (change)="updateStatus(reservation, $any($event.target).value)" [disabled]="updatingId() === reservation.id" class="rounded-lg border border-gray-700 bg-[#121212] px-2 py-1 text-xs text-white outline-none focus:border-jacquier-gold disabled:opacity-50">
                          @for (status of availableStatuses(reservation); track status) { <option [value]="status">{{ statusLabel(status) }}</option> }
                        </select>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>

        <aside class="space-y-6">
          <section class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6">
            <h2 class="mb-4 text-lg font-serif font-bold text-white">À traiter</h2>
            <p class="text-4xl font-serif font-bold text-jacquier-gold">{{ pendingCount() }}</p>
            <p class="mt-1 text-[10px] font-bold uppercase text-gray-500">réservation(s) en attente</p>
          </section>
          <section class="rounded-2xl border border-amber-700/40 bg-amber-500/5 p-6">
            <h2 class="text-lg font-serif font-bold text-white">Communication client</h2>
            <p class="mt-2 text-xs leading-relaxed text-gray-400">Aucune notification automatique n’est envoyée actuellement. Après changement de statut, utilisez WhatsApp, e-mail ou « Copier » pour informer le client avec un message cohérent.</p>
            @if (copyFeedback()) {
              <p class="mt-3 text-xs font-bold text-emerald-300" role="status">{{ copyFeedback() }}</p>
            }
          </section>
          <section class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6">
            <h2 class="mb-4 text-lg font-serif font-bold text-white">Notes clients</h2>
            @for (reservation of reservationsWithNotes(); track reservation.id) {
              <div class="mb-4 border-l-4 border-jacquier-gold bg-jacquier-gold/5 p-3 text-xs text-gray-300 last:mb-0">
                <p class="mb-1 font-bold text-jacquier-gold">{{ reservation.name }}</p><p>{{ reservation.notes }}</p>
              </div>
            } @empty { <p class="text-sm text-gray-400">Aucune note client.</p> }
          </section>
        </aside>
      </div>
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`]
})
export class ReservationsComponent {
  private readonly adminData = inject(AdminDataService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly siteSettings = inject(SiteSettingsService);

  readonly reservations = signal<AdminReservation[]>([]);
  readonly loading = signal(true);
  readonly updatingId = signal<string | null>(null);
  readonly errorMessage = signal('');
  readonly copyFeedback = signal('');
  readonly statuses: ReservationWorkflowStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];
  private readonly transitions: Record<ReservationWorkflowStatus, ReservationWorkflowStatus[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    completed: [],
    cancelled: []
  };
  readonly pendingCount = computed(() => this.reservations().filter(({ status }) => status === 'pending').length);
  readonly reservationsWithNotes = computed(() => this.reservations().filter(({ notes }) => Boolean(notes?.trim())).slice(0, 4));

  constructor() { void this.load(); }

  async load(): Promise<void> {
    this.loading.set(true); this.errorMessage.set('');
    try {
      this.reservations.set(await this.adminData.getReservations());
    } catch {
      this.errorMessage.set('Impossible de charger les réservations. Vérifiez votre session administrateur puis réessayez.');
    } finally { this.loading.set(false); }
  }

  async updateStatus(reservation: AdminReservation, value: string): Promise<void> {
    if (!this.statuses.includes(value as ReservationWorkflowStatus) || value === reservation.status) return;
    this.updatingId.set(reservation.id); this.errorMessage.set('');
    try {
      const updated = await this.adminData.updateReservationStatus(reservation.id, value as ReservationWorkflowStatus);
      this.reservations.update(items => items.map(item => item.id === updated.id ? updated : item));
    } catch {
      this.errorMessage.set('La mise à jour du statut a échoué. Aucune modification locale n’a été conservée.');
    } finally { this.updatingId.set(null); }
  }

  shortReference(id: string): string { return id.split('-')[0]?.toUpperCase() || id; }

  customerMessage(reservation: AdminReservation): string {
    const restaurant = this.siteSettings.publicInfo().restaurantName;
    const reference = this.shortReference(reservation.id);
    const intro = `Bonjour ${reservation.name},`;
    const detail = `votre demande #${reference} pour le ${reservation.date} à ${reservation.time} (${reservation.guests} personne${reservation.guests > 1 ? 's' : ''})`;
    const messages: Record<ReservationWorkflowStatus, string> = {
      pending: `${intro} ${detail} a bien été reçue par ${restaurant} et reste en attente de confirmation.`,
      confirmed: `${intro} ${detail} est confirmée par ${restaurant}. Nous serons heureux de vous accueillir.`,
      cancelled: `${intro} ${detail} a été annulée. Pour une autre date, vous pouvez nous contacter ou effectuer une nouvelle demande.`,
      completed: `${intro} merci d’avoir choisi ${restaurant}. Votre réservation #${reference} est maintenant terminée. Au plaisir de vous revoir.`
    };
    return messages[reservation.status];
  }

  whatsappHref(reservation: AdminReservation): string {
    const phone = (reservation.phone ?? '').replace(/\D/g, '');
    return `https://wa.me/${phone}?text=${encodeURIComponent(this.customerMessage(reservation))}`;
  }

  emailHref(reservation: AdminReservation): string {
    const subject = encodeURIComponent(`Réservation #${this.shortReference(reservation.id)} — ${this.siteSettings.publicInfo().restaurantName}`);
    const body = encodeURIComponent(this.customerMessage(reservation));
    return `mailto:${reservation.email ?? ''}?subject=${subject}&body=${body}`;
  }

  async copyCustomerMessage(reservation: AdminReservation): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !navigator.clipboard) {
      this.copyFeedback.set('Copie indisponible sur cet appareil.');
      return;
    }
    try {
      await navigator.clipboard.writeText(this.customerMessage(reservation));
      this.copyFeedback.set(`Message #${this.shortReference(reservation.id)} copié.`);
      window.setTimeout(() => this.copyFeedback.set(''), 2500);
    } catch {
      this.copyFeedback.set('Copie impossible. Réessayez.');
    }
  }

  availableStatuses(reservation: AdminReservation): ReservationWorkflowStatus[] {
    return [reservation.status, ...this.transitions[reservation.status]];
  }

  statusLabel(status: ReservationWorkflowStatus): string { return STATUS_LABELS[status]; }
  statusClass(status: ReservationWorkflowStatus): string { return STATUS_CLASSES[status]; }
}
