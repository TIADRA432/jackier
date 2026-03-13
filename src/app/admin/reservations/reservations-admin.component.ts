import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { ReservationService } from '../../core/services/reservation.service';
import { ReservationDto } from '../../core/dto/reservation.dto';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reservations-admin',
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
    MatSelectModule,
    MatMenuModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Gestion des Réservations</h1>
        <button mat-raised-button color="accent" (click)="exportPDF()">
          <mat-icon>picture_as_pdf</mat-icon> Exporter PDF
        </button>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Filtrer</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Ex. Nom" #input>
      </mat-form-field>

      <div class="mat-elevation-z8">
        <table mat-table [dataSource]="dataSource" matSort>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Date </th>
            <td mat-cell *matCellDef="let row"> {{row.date | date:'short'}} </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Nom </th>
            <td mat-cell *matCellDef="let row"> {{row.name}} </td>
          </ng-container>

          <ng-container matColumnDef="guests">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Pers. </th>
            <td mat-cell *matCellDef="let row"> {{row.guests}} </td>
          </ng-container>

          <ng-container matColumnDef="contact">
            <th mat-header-cell *matHeaderCellDef> Contact </th>
            <td mat-cell *matCellDef="let row">
              <div>{{row.phone}}</div>
              <div class="email">{{row.email}}</div>
            </td>
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
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="updateStatus(row, 'approved')">
                  <mat-icon color="primary">check</mat-icon> Approuver
                </button>
                <button mat-menu-item (click)="updateStatus(row, 'rejected')">
                  <mat-icon color="warn">block</mat-icon> Rejeter
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
            <td class="mat-cell" colspan="6">Aucune donnée correspondant au filtre "{{input.value}}"</td>
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
    .email { font-size: 0.8em; color: #666; }
    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8em;
      font-weight: bold;
    }
    .status-badge.pending { background-color: #fff3cd; color: #856404; }
    .status-badge.approved { background-color: #d4edda; color: #155724; }
    .status-badge.rejected { background-color: #f8d7da; color: #721c24; }
    .status-badge.completed { background-color: #d1ecf1; color: #0c5460; }
  `]
})
export class ReservationsAdminComponent implements OnInit {
  displayedColumns: string[] = ['date', 'name', 'guests', 'contact', 'status', 'actions'];
  dataSource: MatTableDataSource<ReservationDto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private reservationService = inject(ReservationService);

  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.reservationService.getReservations().subscribe(data => {
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

  updateStatus(reservation: ReservationDto, status: 'approved' | 'rejected' | 'completed') {
    if (!reservation.id) return;
    this.reservationService.updateReservationStatus(reservation.id, status).then(() => {
      this.loadReservations();
    });
  }

  exportPDF() {
    const doc = new jsPDF();
    doc.text('Liste des Réservations', 14, 20);
    
    const data = this.dataSource.data.map(row => [
      new Date(row.date).toLocaleString(),
      row.name,
      row.guests,
      row.phone,
      row.status
    ]);

    autoTable(doc, {
      head: [['Date', 'Nom', 'Pers.', 'Téléphone', 'Statut']],
      body: data,
      startY: 30
    });

    doc.save('reservations.pdf');
  }
}
