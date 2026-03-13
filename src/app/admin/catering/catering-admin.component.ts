import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CateringService } from '../../core/services/catering.service';
import { CateringOrder } from '../../core/models/models';
import { CateringOrderDialogComponent } from './catering-dialog.component';

@Component({
  selector: 'app-catering-admin',
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
    MatMenuModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Gestion Traiteur</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon> Créer une commande
        </button>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Filtrer</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Ex. Mariage" #input>
      </mat-form-field>

      <div class="mat-elevation-z8">
        <table mat-table [dataSource]="dataSource" matSort>

          <ng-container matColumnDef="eventDate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Date Événement </th>
            <td mat-cell *matCellDef="let row"> {{row.eventDate.toDate() | date:'shortDate'}} </td>
          </ng-container>

          <ng-container matColumnDef="clientName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Client </th>
            <td mat-cell *matCellDef="let row"> {{row.clientName}} </td>
          </ng-container>

          <ng-container matColumnDef="eventType">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Type </th>
            <td mat-cell *matCellDef="let row"> {{row.eventType}} </td>
          </ng-container>

          <ng-container matColumnDef="guests">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Invités </th>
            <td mat-cell *matCellDef="let row"> {{row.guests}} </td>
          </ng-container>

          <ng-container matColumnDef="budget">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Budget </th>
            <td mat-cell *matCellDef="let row"> {{row.budget | currency:'EUR'}} </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Statut </th>
            <td mat-cell *matCellDef="let row">
              <span class="status-badge" [ngClass]="row.status">
                {{row.status | titlecase}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button (click)="openDialog(row)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="updateStatus(row, 'approved')">
                  <mat-icon color="primary">check</mat-icon> Valider
                </button>
                <button mat-menu-item (click)="updateStatus(row, 'in-progress')">
                  <mat-icon color="accent">timelapse</mat-icon> En cours
                </button>
                <button mat-menu-item (click)="updateStatus(row, 'completed')">
                  <mat-icon>done_all</mat-icon> Terminé
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="7">Aucune donnée correspondant au filtre "{{input.value}}"</td>
          </tr>
        </table>

        <mat-paginator [pageSizeOptions]="[10, 25, 100]" aria-label="Select page of users"></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    table { width: 100%; }
    .full-width { width: 100%; }
    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8em;
      font-weight: bold;
    }
    .status-badge.pending { background-color: #fff3cd; color: #856404; }
    .status-badge.approved { background-color: #d4edda; color: #155724; }
    .status-badge.in-progress { background-color: #cce5ff; color: #004085; }
    .status-badge.completed { background-color: #d1ecf1; color: #0c5460; }
  `]
})
export class CateringAdminComponent implements OnInit {
  displayedColumns: string[] = ['eventDate', 'clientName', 'eventType', 'guests', 'budget', 'status', 'actions'];
  dataSource: MatTableDataSource<CateringOrder>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private cateringService = inject(CateringService);
  private dialog = inject(MatDialog);

  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.cateringService.getCateringOrders().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(order?: CateringOrder) {
    const dialogRef = this.dialog.open(CateringOrderDialogComponent, {
      width: '600px',
      data: { order }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadOrders();
      }
    });
  }

  updateStatus(order: CateringOrder, status: 'approved' | 'in-progress' | 'completed') {
    this.cateringService.updateOrderStatus(order.id!, status).then(() => {
      // Toast success
    });
  }
}
