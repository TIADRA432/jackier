import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AdminDataService, CateringEvent, CateringWorkflowStatus } from '../../../core/services/admin-data.service';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

const STATUSES: CateringWorkflowStatus[] = ['pending', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'];
const LABELS: Record<CateringWorkflowStatus, string> = {
  pending: 'En attente',
  contacted: 'Contacté',
  quoted: 'Devis envoyé',
  confirmed: 'Confirmé',
  completed: 'Terminé',
  cancelled: 'Annulé'
};

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
            <article [class]="isPastPending(event)
              ? 'flex flex-col gap-4 rounded-xl border border-amber-700/40 bg-amber-500/5 p-4 transition lg:flex-row lg:items-center lg:justify-between'
              : 'flex flex-col gap-4 rounded-xl p-4 transition hover:bg-gray-800/30 lg:flex-row lg:items-center lg:justify-between'">
              <div>
                <h3 class="font-bold text-white">{{ event.name || 'Client non renseigné' }}</h3>
                <p class="mt-1 font-mono text-[10px] text-gray-600">#{{ shortReference(event.id) }}</p>
                <p class="mt-2 text-sm text-gray-400">{{ event.eventType || 'Type non précisé' }} · {{ event.date || 'Date à confirmer' }} · {{ event.guests || '?' }} pers.</p>
                @if (isPastPending(event)) {
                  <p class="mt-2 text-xs font-bold text-amber-300">Date dépassée alors que la demande est toujours en attente.</p>
                }
                <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                  @if (event.phone) { <a [href]="'tel:' + event.phone" class="hover:text-jacquier-gold">{{ event.phone }}</a> }
                  @if (event.email) { <a [href]="'mailto:' + event.email" class="hover:text-jacquier-gold">{{ event.email }}</a> }
                </div>
                @if (event.message) { <p class="mt-2 text-xs text-gray-500">{{ event.message }}</p> }
              </div>
              <div class="flex flex-col items-start gap-3 lg:items-end">
                <span class="text-sm font-bold text-gray-200">{{ event.budget || 'Budget non précisé' }}{{ event.budget ? ' FG' : '' }}</span>
                <label class="sr-only" [for]="'catering-' + event.id">Statut de {{ event.name || 'la demande' }}</label>
                <select [id]="'catering-' + event.id" [value]="event.status" (change)="updateStatus(event, $any($event.target).value)" [disabled]="updatingId() === event.id" class="rounded-lg border border-gray-700 bg-[#121212] px-2 py-1 text-xs text-white outline-none focus:border-jacquier-gold disabled:opacity-50">@for (status of availableStatuses(event); track status) { <option [value]="status">{{ label(status) }}</option> }</select>
                <div class="flex flex-wrap gap-2">
                  @if (event.phone) {
                    <a [href]="whatsappHref(event)" target="_blank" rel="noopener noreferrer"
                      class="rounded-lg border border-emerald-800/70 px-2 py-1 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/10">WhatsApp</a>
                  }
                  @if (event.email) {
                    <a [href]="emailHref(event)" class="rounded-lg border border-gray-700 px-2 py-1 text-[10px] font-bold text-gray-300 hover:border-jacquier-gold hover:text-jacquier-gold">E-mail</a>
                  }
                  <button type="button" (click)="copyCustomerMessage(event)" class="rounded-lg border border-gray-700 px-2 py-1 text-[10px] font-bold text-gray-300 hover:border-jacquier-gold hover:text-jacquier-gold">Copier</button>
                </div>
              </div>
            </article>
          }
        </div> }
      </section>
      <section class="rounded-2xl border border-amber-700/40 bg-amber-500/5 p-5">
        <h2 class="font-serif text-lg font-bold text-white">Communication client</h2>
        <p class="mt-2 text-xs leading-relaxed text-gray-400">Aucune notification automatique n’est envoyée. Utilisez les actions WhatsApp, e-mail ou Copier après avoir mis à jour le statut.</p>
        @if (copyFeedback()) { <p class="mt-3 text-xs font-bold text-emerald-300" role="status">{{ copyFeedback() }}</p> }
      </section>
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn .6s ease-out forwards; } @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`]
})
export class AdminTraiteurComponent {
  private readonly adminData = inject(AdminDataService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly siteSettings = inject(SiteSettingsService);
  readonly events = signal<CateringEvent[]>([]);
  readonly loading = signal(true);
  readonly updatingId = signal<string | null>(null);
  readonly errorMessage = signal('');
  readonly copyFeedback = signal('');
  readonly statuses = STATUSES;
  private readonly transitions: Record<CateringWorkflowStatus, CateringWorkflowStatus[]> = {
    pending: ['contacted', 'cancelled'],
    contacted: ['quoted', 'cancelled'],
    quoted: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    completed: [],
    cancelled: []
  };
  readonly pendingCount = computed(() => this.events().filter(event => event.status === 'pending').length);
  readonly confirmedCount = computed(() => this.events().filter(event => event.status === 'confirmed').length);
  constructor() { void this.load(); }
  async load(): Promise<void> { this.loading.set(true); this.errorMessage.set(''); try { this.events.set(await this.adminData.getCateringEvents()); } catch { this.errorMessage.set('Impossible de charger les demandes traiteur. Vérifiez votre session administrateur puis réessayez.'); } finally { this.loading.set(false); } }
  async updateStatus(event: CateringEvent, value: string): Promise<void> {
    if (!STATUSES.includes(value as CateringWorkflowStatus) || value === event.status) return;
    this.updatingId.set(event.id); this.errorMessage.set('');
    try {
      const updated = await this.adminData.updateCateringStatus(event.id, value as CateringWorkflowStatus);
      this.events.update(items => items.map(item => item.id === updated.id ? updated : item));
    } catch {
      this.errorMessage.set('La mise à jour du devis a échoué. Aucune modification locale n’a été conservée.');
    } finally { this.updatingId.set(null); }
  }

  shortReference(id: string): string { return id.split('-')[0]?.toUpperCase() || id; }

  isPastPending(event: CateringEvent): boolean {
    return event.status === 'pending' && Boolean(event.date && event.date < this.conakryDateString());
  }

  customerMessage(event: CateringEvent): string {
    const restaurant = this.siteSettings.publicInfo().restaurantName;
    const reference = this.shortReference(event.id);
    const date = event.date || 'date à confirmer';
    const intro = `Bonjour ${event.name || ''},`;
    const messages: Record<CateringWorkflowStatus, string> = {
      pending: `${intro} votre demande traiteur #${reference} pour le ${date} a bien été reçue par ${restaurant} et reste en attente de traitement.`,
      contacted: `${intro} nous avons pris en charge votre demande traiteur #${reference}. Notre équipe poursuit l’échange avec vous pour préciser votre événement.`,
      quoted: `${intro} votre demande traiteur #${reference} est passée à l’étape devis. Merci de vérifier les conditions transmises par notre équipe avant confirmation.`,
      confirmed: `${intro} votre événement traiteur #${reference} prévu le ${date} est confirmé par ${restaurant}. Nous vous remercions pour votre confiance.`,
      completed: `${intro} merci d’avoir confié votre événement à ${restaurant}. La demande traiteur #${reference} est maintenant terminée. Au plaisir de vous accompagner à nouveau.`,
      cancelled: `${intro} votre demande traiteur #${reference} prévue le ${date} a été annulée. Vous pouvez nous recontacter pour une nouvelle date ou un nouveau projet.`
    };
    return messages[event.status];
  }

  whatsappHref(event: CateringEvent): string {
    let phone = (event.phone ?? '').replace(/\D/g, '');
    if (phone.startsWith('00')) phone = phone.slice(2);
    if (phone.length === 9) phone = `224${phone}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(this.customerMessage(event))}`;
  }

  emailHref(event: CateringEvent): string {
    const subject = encodeURIComponent(`Traiteur #${this.shortReference(event.id)} — ${this.siteSettings.publicInfo().restaurantName}`);
    const body = encodeURIComponent(this.customerMessage(event));
    return `mailto:${event.email ?? ''}?subject=${subject}&body=${body}`;
  }

  async copyCustomerMessage(event: CateringEvent): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !navigator.clipboard) {
      this.copyFeedback.set('Copie indisponible sur cet appareil.');
      return;
    }
    try {
      await navigator.clipboard.writeText(this.customerMessage(event));
      this.copyFeedback.set(`Message #${this.shortReference(event.id)} copié.`);
      window.setTimeout(() => this.copyFeedback.set(''), 2500);
    } catch {
      this.copyFeedback.set('Copie impossible. Réessayez.');
    }
  }

  private conakryDateString(): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Africa/Conakry', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const part = (type: string) => parts.find(entry => entry.type === type)?.value ?? '';
    return `${part('year')}-${part('month')}-${part('day')}`;
  }

  availableStatuses(event: CateringEvent): CateringWorkflowStatus[] {
    return [event.status, ...this.transitions[event.status]];
  }

  label(status: CateringWorkflowStatus): string { return LABELS[status]; }
}
