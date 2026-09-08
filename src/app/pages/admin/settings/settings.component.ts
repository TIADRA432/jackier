import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, PublicSettings } from '../../../core/services/admin-data.service';

const EMPTY_SETTINGS: Required<Omit<PublicSettings, 'socialMedia'>> = {
  restaurantName: '',
  address: '',
  phone: '',
  email: '',
  openingHours: '',
  currency: 'FG',
};

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">Paramètres</h1>
          <p class="mt-1 text-sm text-gray-400">Informations publiques de l’établissement</p>
        </div>
        <button type="button" (click)="save()" [disabled]="loading() || saving()" class="rounded-xl bg-jacquier-gold px-6 py-2 text-sm font-bold text-jacquier-dark shadow-lg shadow-jacquier-gold/20 transition-colors hover:bg-white disabled:opacity-60">
          {{ saving() ? 'Sauvegarde…' : 'Sauvegarder' }}
        </button>
      </div>

      @if (errorMessage()) {
        <p class="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">{{ errorMessage() }}</p>
      }
      @if (successMessage()) {
        <p class="rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200" role="status">{{ successMessage() }}</p>
      }

      <section class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6 md:p-8">
        <h2 class="border-b border-gray-800 pb-4 text-lg font-serif font-bold text-white">Informations de l’établissement</h2>
        @if (loading()) {
          <p class="py-8 text-sm text-gray-400" role="status">Chargement des paramètres…</p>
        } @else {
          <form (ngSubmit)="save()" class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <label class="text-sm text-gray-300">Nom de l’enseigne
              <input [(ngModel)]="settings.restaurantName" name="restaurantName" maxlength="120" required class="mt-2 w-full rounded-xl bg-gray-800 px-4 py-3 text-white outline-none ring-jacquier-gold focus:ring-1" />
            </label>
            <label class="text-sm text-gray-300">Devise
              <input [(ngModel)]="settings.currency" name="currency" maxlength="16" required class="mt-2 w-full rounded-xl bg-gray-800 px-4 py-3 text-white outline-none ring-jacquier-gold focus:ring-1" />
            </label>
            <label class="text-sm text-gray-300 md:col-span-2">Adresse
              <input [(ngModel)]="settings.address" name="address" maxlength="300" required class="mt-2 w-full rounded-xl bg-gray-800 px-4 py-3 text-white outline-none ring-jacquier-gold focus:ring-1" />
            </label>
            <label class="text-sm text-gray-300">E-mail de contact
              <input type="email" [(ngModel)]="settings.email" name="email" maxlength="254" required class="mt-2 w-full rounded-xl bg-gray-800 px-4 py-3 text-white outline-none ring-jacquier-gold focus:ring-1" />
            </label>
            <label class="text-sm text-gray-300">Téléphone
              <input type="tel" [(ngModel)]="settings.phone" name="phone" maxlength="64" required class="mt-2 w-full rounded-xl bg-gray-800 px-4 py-3 text-white outline-none ring-jacquier-gold focus:ring-1" />
            </label>
            <label class="text-sm text-gray-300 md:col-span-2">Horaires d’ouverture
              <input [(ngModel)]="settings.openingHours" name="openingHours" maxlength="300" required class="mt-2 w-full rounded-xl bg-gray-800 px-4 py-3 text-white outline-none ring-jacquier-gold focus:ring-1" />
            </label>
            <div class="md:col-span-2 flex justify-end"><button type="submit" [disabled]="saving()" class="rounded-xl border border-jacquier-gold/50 px-5 py-2 text-sm font-bold text-jacquier-gold hover:bg-jacquier-gold/10 disabled:opacity-60">Enregistrer les informations</button></div>
          </form>
        }
      </section>

      <section class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6 text-sm text-gray-400">
        Les réglages de sécurité, facturation et intégrations n’ont pas encore de modèle serveur. Ils ne sont donc pas affichés ici afin d’éviter des commandes sans effet ou ambiguës.
      </section>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminSettingsComponent {
  private readonly adminData = inject(AdminDataService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  settings = { ...EMPTY_SETTINGS };

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      this.settings = { ...EMPTY_SETTINGS, ...(await this.adminData.getSettings()) };
    } catch {
      this.errorMessage.set('Impossible de charger les paramètres. Réessayez dans un instant.');
    } finally {
      this.loading.set(false);
    }
  }

  async save(): Promise<void> {
    if (this.loading() || !this.settings.restaurantName.trim() || !this.settings.email.trim()) return;
    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    try {
      await this.adminData.updateSettings({
        restaurantName: this.settings.restaurantName.trim(),
        address: this.settings.address.trim(),
        phone: this.settings.phone.trim(),
        email: this.settings.email.trim(),
        openingHours: this.settings.openingHours.trim(),
        currency: this.settings.currency.trim(),
      });
      this.successMessage.set('Les informations publiques ont été enregistrées.');
    } catch {
      this.errorMessage.set('Impossible d’enregistrer les paramètres. Vérifiez les valeurs saisies.');
    } finally {
      this.saving.set(false);
    }
  }
}
