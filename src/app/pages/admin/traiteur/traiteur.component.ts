import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService, CateringEvent, ReservationStatus } from '../../../core/services/admin-data.service';

const STATUSES: ReservationStatus[] = ['pending', 'confirmed', 'completed', 'cancelled', 'approved', 'rejected'];
const LABELS: Record<ReservationStatus, string> = { pending: 'En attente', confirmed: 'Confirmé', completed: 'Terminé', cancelled: 'Annulé', approved: 'Approuvé', rejected: 'Refusé' };

@Component({
  selector: 'app-admin-traiteur', standalone: true, imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 class="text-2xl font-serif font-bold text-white">Service Traiteur</h1><p class="mt-1 text-sm text-gray-400">Demandes de devis reçues depuis le site.</p></div>
        <button type="button" (click)="load()" [disabled]="loading()" class="self-start rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-50">{{ loading() ? 'Actualisation…' : 'Actualiser' }}</button>
      </header>
      @if (errorMessage()) { <div role="alert" class="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">{{ errorMessage() }} <button type="button" (click)="load()" class="ml-2 font-bold underline">Réessayer</button></div> }
      <section class="grid gap-6 md:grid-cols-3">
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6"><p class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Devis en attente</p><p class="mt-2 text-3xl font-serif font-bold text-jacquier-gold">{{ pendingCount() }}</p></article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6"><p class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Demandes reçues</p><p class="mt-2 text-3xl font-serif font-bold text-white">{{ events().length }}</p></article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6"><p class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Conv. confirmées</p><p class="mt-2 text-3xl font-serif font-bold text-white">{{ confirmedCount() }}</p></article>
      </section>
      <section class="overflow-hidden rounded-2xl border border-gray-800 bg-[#1a1a1a]">
        <div class="border-b border-gray-800 p-6"><h2 class="text-lg font-serif font-bold text-white">Demandes et événements</h2></div>
        @if (loading()) { <div class="p-12 text-center text-gray-400" role="status">Chargement des devis…</div> }
        @else if (!events().length) { <div class="p-12 text-center text-gray-400">Aucune demande de devis pour le moment.</div> }
        @else { <div class="divide-y divide-gray-800 p-2">
          @for (event of events(); track event.id) {
            <article class="flex flex-col gap-4 rounded-xl p-4 transition hover:bg-gray-800/30 lg:flex-row lg:items-center lg:justify-between">
              <div><h3 class="font-bold text-white">{{ event.name || 'Client non renseigné' }}</h3><p class="mt-1 text-sm text-gray-400">{{ event.eventType || 'Type non précisé' }} · {{ event.date || 'Date à confirmer' }} · {{ event.guests || '?' }} pers.</p>@if (event.message) { <p class="mt-2 text-xs text-gray-500">{{ event.message }}</p> }</div>
              <div class="flex items-center gap-3"><span class="text-sm font-bold text-gray-200">{{ event.budget || 'Budget non précisé' }}{{ event.budget ? ' FG' : '' }}</span><label class="sr-only" [for]="'catering-' + event.id">Statut de {{ event.name || 'la demande' }}</label><select [id]="'catering-' + event.id" [value]="event.status" (change)="updateStatus(event, $any($event.target).value)" [disabled]="updatingId() === event.id" class="rounded-lg border border-gray-700 bg-[#121212] px-2 py-1 text-xs text-white outline-none focus:border-jacquier-gold disabled:opacity-50">@for (status of statuses; track status) { <option [value]="status">{{ label(status) }}</option> }</select></div>
            </article>
          }
        </div> }
      </section>
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn .6s ease-out forwards; } @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`]
})
export class AdminTraiteurComponent {
  private readonly adminData = inject(AdminDataService);
  readonly events = signal<CateringEvent[]>([]); readonly loading = signal(true); readonly updatingId = signal<string | null>(null); readonly errorMessage = signal(''); readonly statuses = STATUSES;
  readonly pendingCount = computed(() => this.events().filter(event => event.status === 'pending').length);
  readonly confirmedCount = computed(() => this.events().filter(event => event.status === 'confirmed' || event.status === 'approved').length);
  constructor() { void this.load(); }
  async load(): Promise<void> { this.loading.set(true); this.errorMessage.set(''); try { this.events.set(await this.adminData.getCateringEvents()); } catch { this.errorMessage.set('Impossible de charger les demandes traiteur. Vérifiez votre session administrateur puis réessayez.'); } finally { this.loading.set(false); } }
  async updateStatus(event: CateringEvent, value: string): Promise<void> { if (!STATUSES.includes(value as ReservationStatus) || value === event.status) return; this.updatingId.set(event.id); this.errorMessage.set(''); try { const updated = await this.adminData.updateCateringStatus(event.id, value as ReservationStatus); this.events.update(items => items.map(item => item.id === updated.id ? updated : item)); } catch { this.errorMessage.set('La mise à jour du devis a échoué. Aucune modification locale n’a été conservée.'); } finally { this.updatingId.set(null); } }
  label(status: ReservationStatus): string { return LABELS[status]; }
}
