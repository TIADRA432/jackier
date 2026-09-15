import { Component, ChangeDetectionStrategy, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AdminDataService, FinanceExpense, FinanceReport } from "../../../core/services/admin-data.service";

@Component({
  selector: "app-admin-finance",
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-white">Finance & BI</h1>
          <p class="text-gray-400 text-sm mt-1">Suivi des revenus, dépenses et rentabilité</p>
        </div>
        <div class="flex gap-3">
          <button type="button" (click)="load()" [disabled]="loading()" class="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium border border-gray-700 hover:bg-gray-700 transition-colors disabled:opacity-60">
            Actualiser
          </button>
          <button type="button" (click)="showCloseForm.set(!showCloseForm())" class="px-4 py-2 bg-jacquier-gold text-jacquier-dark rounded-xl text-sm font-bold hover:bg-white transition-colors shadow-lg shadow-jacquier-gold/20">
            Clôture journalière
          </button>
        </div>
      </div>

      @if (errorMessage()) {
        <p class="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">{{ errorMessage() }}</p>
      }

      @if (showCloseForm()) {
        <form (ngSubmit)="closeDay()" class="rounded-2xl border border-jacquier-gold/40 bg-jacquier-gold/5 p-5">
          <div class="flex flex-col gap-4 md:flex-row md:items-end">
            <label class="block flex-1 text-sm text-gray-300">Recettes du jour (FG)
              <input type="number" min="0" max="100000000" step="1" [(ngModel)]="manualRevenue" name="manualRevenue" required class="mt-2 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-white" />
            </label>
            <button type="submit" [disabled]="saving()" class="rounded-xl bg-jacquier-gold px-4 py-2 font-bold text-jacquier-dark disabled:opacity-60">{{ saving() ? 'Enregistrement…' : 'Confirmer la clôture' }}</button>
          </div>
          <p class="mt-3 text-xs text-gray-400">Cette opération crée un rapport avec les dépenses enregistrées aujourd’hui.</p>
        </form>
      }

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Revenu Brut (Mois)</p>
          <h3 class="text-2xl font-serif font-bold text-white">{{ formatAmount(monthlyRevenue()) }} FG</h3>
          <p class="text-xs text-gray-500 mt-2">Rapports de clôture du mois</p>
        </div>
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Dépenses (Mois)</p>
          <h3 class="text-2xl font-serif font-bold text-white">{{ formatAmount(monthlyExpenses()) }} FG</h3>
          <p class="text-xs text-gray-500 mt-2">Rapports de clôture du mois</p>
        </div>
        <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Marge Nette</p>
          <h3 class="text-2xl font-serif font-bold text-jacquier-gold">{{ formatAmount(monthlyNetIncome()) }} FG</h3>
          <p class="text-xs text-gray-500 mt-2">Après dépenses enregistrées</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800">
          <h3 class="text-lg font-serif font-bold text-white mb-6">Ajouter une dépense</h3>
          <form (ngSubmit)="addExpense()" class="space-y-4">
            <label class="block text-sm text-gray-300">Libellé
              <input [(ngModel)]="expenseLabel" name="expenseLabel" maxlength="160" required class="mt-2 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-white" />
            </label>
            <label class="block text-sm text-gray-300">Catégorie <span class="text-gray-500">(facultatif)</span>
              <input [(ngModel)]="expenseCategory" name="expenseCategory" maxlength="80" class="mt-2 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-white" />
            </label>
            <label class="block text-sm text-gray-300">Montant (FG)
              <input type="number" min="1" max="100000000" step="1" [(ngModel)]="expenseAmount" name="expenseAmount" required class="mt-2 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-white" />
            </label>
            <button type="submit" [disabled]="saving()" class="w-full rounded-xl border border-jacquier-gold/50 py-3 text-sm font-bold text-jacquier-gold hover:bg-jacquier-gold/10 disabled:opacity-60">{{ saving() ? 'Enregistrement…' : 'Enregistrer la dépense' }}</button>
          </form>
        </div>

        <div class="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800">
          <h3 class="text-lg font-serif font-bold text-white mb-6">Dernières dépenses</h3>
          @if (loading()) {
            <p class="text-sm text-gray-400">Chargement des données financières…</p>
          } @else if (!expenses().length) {
            <p class="text-sm text-gray-400">Aucune dépense enregistrée.</p>
          } @else {
            <div class="space-y-3">
              @for (expense of expenses().slice(0, 6); track expense.id) {
                <div class="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-800/30 p-3">
                  <div>
                    <p class="text-sm font-bold text-white">{{ expense.label }}</p>
                    <p class="text-xs text-gray-500">{{ expense.category || 'Sans catégorie' }} · {{ formatDate(expense.date) }}</p>
                  </div>
                  <p class="text-sm font-bold text-red-400">− {{ formatAmount(expense.amount) }} FG</p>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <div class="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800">
        <h3 class="text-lg font-serif font-bold text-white mb-6">Rapports de clôture</h3>
        @if (!loading() && !reports().length) {
          <p class="text-sm text-gray-400">Aucun rapport de clôture enregistré.</p>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500"><tr><th class="pb-3">Date</th><th class="pb-3">Recettes</th><th class="pb-3">Dépenses</th><th class="pb-3">Net</th></tr></thead>
              <tbody>
                @for (report of reports().slice(0, 10); track report.id) {
                  <tr class="border-b border-gray-800/70 text-gray-300"><td class="py-3">{{ formatDate(report.date) }}</td><td class="py-3">{{ formatAmount(report.totalRevenue) }} FG</td><td class="py-3">{{ formatAmount(report.totalExpenses) }} FG</td><td class="py-3 font-bold" [class.text-green-400]="report.netIncome >= 0" [class.text-red-400]="report.netIncome < 0">{{ formatAmount(report.netIncome) }} FG</td></tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.6s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AdminFinanceComponent {
  private readonly adminData = inject(AdminDataService);

  readonly expenses = signal<FinanceExpense[]>([]);
  readonly reports = signal<FinanceReport[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly showCloseForm = signal(false);
  readonly errorMessage = signal('');
  expenseLabel = '';
  expenseCategory = '';
  expenseAmount: number | null = null;
  manualRevenue: number | null = null;

  readonly monthlyReports = computed(() => {
    const now = new Date();
    return this.reports().filter(report => {
      const date = new Date(report.date);
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    });
  });
  readonly monthlyRevenue = computed(() => this.monthlyReports().reduce((sum, report) => sum + Number(report.totalRevenue || 0), 0));
  readonly monthlyExpenses = computed(() => this.monthlyReports().reduce((sum, report) => sum + Number(report.totalExpenses || 0), 0));
  readonly monthlyNetIncome = computed(() => this.monthlyReports().reduce((sum, report) => sum + Number(report.netIncome || 0), 0));

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      const [expenses, reports] = await Promise.all([this.adminData.getExpenses(), this.adminData.getFinanceReports()]);
      this.expenses.set(expenses);
      this.reports.set(reports);
    } catch {
      this.errorMessage.set('Impossible de charger les données financières. Réessayez dans un instant.');
    } finally {
      this.loading.set(false);
    }
  }

  async addExpense(): Promise<void> {
    if (!this.expenseLabel.trim() || this.expenseAmount === null) return;
    this.saving.set(true);
    this.errorMessage.set('');
    try {
      const expense = await this.adminData.addExpense({
        label: this.expenseLabel.trim(),
        category: this.expenseCategory.trim() || undefined,
        amount: Number(this.expenseAmount)
      });
      this.expenses.update(expenses => [expense, ...expenses]);
      this.expenseLabel = '';
      this.expenseCategory = '';
      this.expenseAmount = null;
    } catch {
      this.errorMessage.set('Impossible d’enregistrer cette dépense. Vérifiez les valeurs saisies.');
    } finally {
      this.saving.set(false);
    }
  }

  async closeDay(): Promise<void> {
    if (this.manualRevenue === null) return;
    this.saving.set(true);
    this.errorMessage.set('');
    try {
      const report = await this.adminData.closeDay(Number(this.manualRevenue));
      this.reports.update(reports => [report, ...reports]);
      this.manualRevenue = null;
      this.showCloseForm.set(false);
    } catch {
      this.errorMessage.set('Impossible de clôturer la journée. Vérifiez le montant puis réessayez.');
    } finally {
      this.saving.set(false);
    }
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(amount || 0);
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value));
  }
}
