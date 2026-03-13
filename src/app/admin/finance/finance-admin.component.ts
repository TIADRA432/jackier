import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../../core/services/finance.service';
import { FinanceReportDto } from '../../core/dto/finance.dto';

@Component({
  selector: 'app-finance-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Finance & Clôture Journalière</h1>
      </div>

      <div class="closing-section">
        <h2>Clôture du Jour</h2>
        <form [formGroup]="closingForm" (ngSubmit)="closeDay()">
          <mat-form-field appearance="outline">
            <mat-label>Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Revenus Totaux</mat-label>
            <input matInput type="number" formControlName="totalRevenue">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Dépenses</mat-label>
            <input matInput type="number" formControlName="expenses">
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="closingForm.invalid">
            <mat-icon>lock</mat-icon> Clôturer la journée
          </button>
        </form>
      </div>

      <div class="history-section">
        <h2>Historique</h2>
        <div class="mat-elevation-z8">
          <table mat-table [dataSource]="dataSource" matSort>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Date </th>
              <td mat-cell *matCellDef="let row"> {{row.date | date:'mediumDate'}} </td>
            </ng-container>

            <ng-container matColumnDef="revenue">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Revenus </th>
              <td mat-cell *matCellDef="let row"> {{row.totalRevenue | currency:'EUR'}} </td>
            </ng-container>

            <ng-container matColumnDef="expenses">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Dépenses </th>
              <td mat-cell *matCellDef="let row"> {{row.expenses | currency:'EUR'}} </td>
            </ng-container>

            <ng-container matColumnDef="profit">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Profit Net </th>
              <td mat-cell *matCellDef="let row" [class.negative]="row.netProfit < 0" [class.positive]="row.netProfit > 0">
                {{row.netProfit | currency:'EUR'}}
              </td>
            </ng-container>

            <ng-container matColumnDef="closedBy">
              <th mat-header-cell *matHeaderCellDef> Clôturé par </th>
              <td mat-cell *matCellDef="let row"> {{row.closedBy}} </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <mat-paginator [pageSizeOptions]="[10, 30, 90]" aria-label="Select page of reports"></mat-paginator>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .header { margin-bottom: 20px; }
    .closing-section { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .closing-section form { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; }
    table { width: 100%; }
    .negative { color: red; font-weight: bold; }
    .positive { color: green; font-weight: bold; }
  `]
})
export class FinanceAdminComponent implements OnInit {
  displayedColumns: string[] = ['date', 'revenue', 'expenses', 'profit', 'closedBy'];
  dataSource: MatTableDataSource<FinanceReportDto>;
  closingForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private financeService = inject(FinanceService);
  private fb = inject(FormBuilder);

  constructor() {
    this.dataSource = new MatTableDataSource();
    this.closingForm = this.fb.group({
      date: [new Date(), Validators.required],
      totalRevenue: [0, [Validators.required, Validators.min(0)]],
      expenses: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.financeService.getDailyReports().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  closeDay() {
    if (this.closingForm.invalid) return;

    const { date, totalRevenue, expenses } = this.closingForm.value;
    const netProfit = totalRevenue - expenses;

    const report: FinanceReportDto = {
      date: date.toISOString().split('T')[0],
      totalRevenue,
      expenses,
      netProfit,
      closedBy: 'Admin',
      closedAt: new Date().toISOString()
    };

    this.financeService.addDailyReport(report).then(() => {
      this.loadReports();
      this.closingForm.reset({
        date: new Date(),
        totalRevenue: 0,
        expenses: 0
      });
    });
  }
}
