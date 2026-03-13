import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../../core/services/finance.service';
import { FinanceReport } from '../../core/models/models';
import { Observable } from 'rxjs';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-finance-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="finance-container">
      <div class="header">
        <h1>Finance Management</h1>
        <button mat-raised-button color="primary" (click)="generateDailyReport()">
          <mat-icon>assessment</mat-icon> Generate Daily Report
        </button>
      </div>

      <div class="chart-container">
        <canvas id="financeChart"></canvas>
      </div>

      <table mat-table [dataSource]="reports$ | async" class="mat-elevation-z8">
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef> Date </th>
          <td mat-cell *matCellDef="let element"> {{element.date}} </td>
        </ng-container>

        <ng-container matColumnDef="revenue">
          <th mat-header-cell *matHeaderCellDef> Revenue </th>
          <td mat-cell *matCellDef="let element"> {{element.totalRevenue | currency}} </td>
        </ng-container>

        <ng-container matColumnDef="expenses">
          <th mat-header-cell *matHeaderCellDef> Expenses </th>
          <td mat-cell *matCellDef="let element"> {{element.expenses | currency}} </td>
        </ng-container>

        <ng-container matColumnDef="profit">
          <th mat-header-cell *matHeaderCellDef> Net Profit </th>
          <td mat-cell *matCellDef="let element" [class.negative]="element.netProfit < 0">
            {{element.netProfit | currency}}
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .finance-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .chart-container {
      height: 300px;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
    .negative {
      color: red;
    }
  `]
})
export class FinanceManagementComponent implements OnInit {
  displayedColumns: string[] = ['date', 'revenue', 'expenses', 'profit'];
  reports$: Observable<FinanceReport[]>;

  constructor(
    private financeService: FinanceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.reports$ = this.financeService.getFinanceReports();
    this.reports$.subscribe(reports => {
      this.initChart(reports);
    });
  }

  generateDailyReport() {
    // Logic to generate daily report
    // This would typically involve aggregating data from orders/reservations
    // For now, we'll open a dialog to manually enter data
    const dialogRef = this.dialog.open(FinanceReportDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.financeService.addFinanceReport({
          ...result,
          date: new Date().toISOString().split('T')[0],
          closedAt: new Date() as any,
          closedBy: 'current-user-id' // Should get from AuthService
        }).then(() => {
          this.snackBar.open('Daily report generated', 'Close', { duration: 3000 });
        });
      }
    });
  }

  initChart(reports: FinanceReport[]) {
    const ctx = document.getElementById('financeChart') as HTMLCanvasElement;
    // Destroy existing chart if any
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: reports.map(r => r.date).reverse(),
        datasets: [
          {
            label: 'Revenue',
            data: reports.map(r => r.totalRevenue).reverse(),
            borderColor: 'green',
            fill: false
          },
          {
            label: 'Expenses',
            data: reports.map(r => r.expenses).reverse(),
            borderColor: 'red',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}

@Component({
  selector: 'app-finance-report-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Daily Report</h2>
    <mat-dialog-content [formGroup]="form">
      <mat-form-field appearance="fill">
        <mat-label>Total Revenue</mat-label>
        <input matInput type="number" formControlName="totalRevenue">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Expenses</mat-label>
        <input matInput type="number" formControlName="expenses">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Net Profit</mat-label>
        <input matInput type="number" formControlName="netProfit" readonly>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="form.value" [disabled]="form.invalid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 10px;
    }
  `]
})
export class FinanceReportDialogComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      totalRevenue: [0, [Validators.required, Validators.min(0)]],
      expenses: [0, [Validators.required, Validators.min(0)]],
      netProfit: [0]
    });

    this.form.valueChanges.subscribe(val => {
      this.form.patchValue({
        netProfit: (val.totalRevenue || 0) - (val.expenses || 0)
      }, { emitEvent: false });
    });
  }
}
import { Inject } from '@angular/core';
