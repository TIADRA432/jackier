import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FinanceService } from '../../../core/services/finance.service';

@Component({
  selector: 'app-admin-finance',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule
  ],
  template: `
    <div class="p-6 space-y-6">
      <h2 class="text-3xl font-serif font-bold text-jacquier-gold">Gestion Financière</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Daily Close Form -->
        <mat-card class="bg-[#1a1a1a] border border-gray-800 text-white md:col-span-1">
          <mat-card-header>
            <mat-card-title class="text-jacquier-gold">Clôture Journalière</mat-card-title>
          </mat-card-header>
          <mat-card-content class="pt-4">
            <form [formGroup]="closeForm" (ngSubmit)="onDailyClose()" class="space-y-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Revenu Manuel (GNF)</mat-label>
                <input matInput type="number" formControlName="manualRevenue">
              </mat-form-field>
              <button mat-raised-button color="primary" class="w-full py-6" [disabled]="closeForm.invalid">
                Effectuer la Clôture
              </button>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Add Expense Form -->
        <mat-card class="bg-[#1a1a1a] border border-gray-800 text-white md:col-span-2">
          <mat-card-header>
            <mat-card-title class="text-jacquier-gold">Ajouter une Dépense</mat-card-title>
          </mat-card-header>
          <mat-card-content class="pt-4">
            <form [formGroup]="expenseForm" (ngSubmit)="onAddExpense()" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Description</mat-label>
                <input matInput formControlName="description">
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Montant (GNF)</mat-label>
                <input matInput type="number" formControlName="amount">
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Catégorie</mat-label>
                <input matInput formControlName="category" placeholder="ex: Ingrédients, Loyer, Salaires">
              </mat-form-field>
              <div class="flex items-end">
                <button mat-raised-button color="accent" class="w-full py-4" [disabled]="expenseForm.invalid">
                  Ajouter Dépense
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Reports Table -->
      <mat-card class="bg-[#1a1a1a] border border-gray-800 text-white">
        <mat-card-header>
          <mat-card-title class="text-jacquier-gold">Rapports de Clôture</mat-card-title>
        </mat-card-header>
        <mat-card-content class="pt-4">
          <table mat-table [dataSource]="reports" class="w-full bg-transparent">
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef class="text-gray-400"> Date </th>
              <td mat-cell *matCellDef="let element" class="text-white"> {{element.date | date:'shortDate'}} </td>
            </ng-container>

            <ng-container matColumnDef="revenue">
              <th mat-header-cell *matHeaderCellDef class="text-gray-400"> Revenu </th>
              <td mat-cell *matCellDef="let element" class="text-green-400 font-bold"> {{element.totalRevenue | number}} GNF </td>
            </ng-container>

            <ng-container matColumnDef="expenses">
              <th mat-header-cell *matHeaderCellDef class="text-gray-400"> Dépenses </th>
              <td mat-cell *matCellDef="let element" class="text-red-400"> {{element.totalExpenses | number}} GNF </td>
            </ng-container>

            <ng-container matColumnDef="net">
              <th mat-header-cell *matHeaderCellDef class="text-gray-400"> Net </th>
              <td mat-cell *matCellDef="let element" [ngClass]="element.netIncome >= 0 ? 'text-green-500' : 'text-red-500'" class="font-bold"> 
                {{element.netIncome | number}} GNF 
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="reportColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: reportColumns;" class="hover:bg-gray-800/50 transition-colors"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <!-- Expenses Table -->
      <mat-card class="bg-[#1a1a1a] border border-gray-800 text-white">
        <mat-card-header>
          <mat-card-title class="text-jacquier-gold">Dépenses Récentes</mat-card-title>
        </mat-card-header>
        <mat-card-content class="pt-4">
          <table mat-table [dataSource]="expenses" class="w-full bg-transparent">
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef class="text-gray-400"> Date </th>
              <td mat-cell *matCellDef="let element" class="text-white"> {{element.date | date:'short'}} </td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef class="text-gray-400"> Description </th>
              <td mat-cell *matCellDef="let element" class="text-white"> {{element.description}} </td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef class="text-gray-400"> Catégorie </th>
              <td mat-cell *matCellDef="let element" class="text-gray-400"> {{element.category}} </td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef class="text-gray-400"> Montant </th>
              <td mat-cell *matCellDef="let element" class="text-red-400 font-bold"> {{element.amount | number}} GNF </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="expenseColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: expenseColumns;" class="hover:bg-gray-800/50 transition-colors"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    :host ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    table { border-collapse: separate; border-spacing: 0 8px; }
    th { border-bottom: none !important; }
    td { border-bottom: none !important; }
  `]
})
export class AdminFinanceComponent implements OnInit {
  private financeService = inject(FinanceService);
  private fb = inject(FormBuilder);

  reports: any[] = [];
  expenses: any[] = [];
  reportColumns = ['date', 'revenue', 'expenses', 'net'];
  expenseColumns = ['date', 'description', 'category', 'amount'];

  closeForm = this.fb.group({
    manualRevenue: [0, [Validators.required, Validators.min(0)]]
  });

  expenseForm = this.fb.group({
    description: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    category: ['', Validators.required]
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.financeService.getReports().subscribe(data => this.reports = data);
    this.financeService.getExpenses().subscribe(data => this.expenses = data);
  }

  onDailyClose() {
    if (this.closeForm.valid) {
      this.financeService.dailyClose(this.closeForm.value).subscribe(() => {
        this.loadData();
        this.closeForm.reset({ manualRevenue: 0 });
      });
    }
  }

  onAddExpense() {
    if (this.expenseForm.valid) {
      this.financeService.addExpense(this.expenseForm.value).subscribe(() => {
        this.loadData();
        this.expenseForm.reset({ amount: 0 });
      });
    }
  }
}
