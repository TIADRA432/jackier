import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService, AdminReservation, ReservationStatus } from '../../../core/services/admin-data.service';

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: 'En attente', confirmed: 'Confirmée', cancelled: 'Annulée',
  completed: 'Terminée', approved: 'Approuvée', rejected: 'Refusée'
};

const STATUS_CLASSES: Record<ReservationStatus, string> = {
  pending: 'bg-orange-500/10 text-orange-500', confirmed: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-red-500/10 text-red-500', completed: 'bg-blue-500/10 text-blue-500',
  approved: 'bg-green-500/10 text-green-500', rejected: 'bg-red-500/10 text-red-500'
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
                  <th class="pb-4">Client</th><th class="pb-4">Date</th><th class="pb-4">Heure</th><th class="pb-4">Couverts</th><th class="pb-4">Statut</th><th class="pb-4 text-right">Modifier</th>
                </tr></thead>
                <tbody>
                  @for (reservation of reservations(); track reservation.id) {
                    <tr class="border-b border-gray-800/50 transition-colors hover:bg-gray-800/20">
                      <td class="py-4 font-medium text-white">{{ reservation.name }}</td>
                      <td class="py-4 text-gray-300">{{ reservation.date }}</td>
                      <td class="py-4 text-gray-300">{{ reservation.time }}</td>
                      <td class="py-4 text-gray-300">{{ reservation.guests }} pers.</td>
                      <td class="py-4"><span [class]="'rounded-md px-2 py-1 text-[10px] font-bold uppercase ' + statusClass(reservation.status)">{{ statusLabel(reservation.status) }}</span></td>
                      <td class="py-4 text-right">
                        <label class="sr-only" [for]="'status-' + reservation.id">Statut de {{ reservation.name }}</label>
                        <select [id]="'status-' + reservation.id" [value]="reservation.status" (change)="updateStatus(reservation, $any($event.target).value)" [disabled]="updatingId() === reservation.id" class="rounded-lg border border-gray-700 bg-[#121212] px-2 py-1 text-xs text-white outline-none focus:border-jacquier-gold disabled:opacity-50">
                          @for (status of statuses; track status) { <option [value]="status">{{ statusLabel(status) }}</option> }
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

  readonly reservations = signal<AdminReservation[]>([]);
  readonly loading = signal(true);
  readonly updatingId = signal<string | null>(null);
  readonly errorMessage = signal('');
  readonly statuses: ReservationStatus[] = ['pending', 'confirmed', 'completed', 'cancelled', 'approved', 'rejected'];
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
    if (!this.statuses.includes(value as ReservationStatus) || value === reservation.status) return;
    this.updatingId.set(reservation.id); this.errorMessage.set('');
    try {
      const updated = await this.adminData.updateReservationStatus(reservation.id, value as ReservationStatus);
      this.reservations.update(items => items.map(item => item.id === updated.id ? updated : item));
    } catch {
      this.errorMessage.set('La mise à jour du statut a échoué. Aucune modification locale n’a été conservée.');
    } finally { this.updatingId.set(null); }
  }

  statusLabel(status: ReservationStatus): string { return STATUS_LABELS[status]; }
  statusClass(status: ReservationStatus): string { return STATUS_CLASSES[status]; }
}
