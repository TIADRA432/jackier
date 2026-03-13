import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReservationService } from '../../../core/services/reservation.service';
import { ReservationDto } from '../../../core/dto/reservation.dto';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">Gestion des Réservations</h2>
      <table mat-table [dataSource]="reservations" class="mat-elevation-z8 w-full">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef> Nom </th>
          <td mat-cell *matCellDef="let element"> {{element.name}} </td>
        </ng-container>

        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef> Date </th>
          <td mat-cell *matCellDef="let element"> {{element.date | date}} </td>
        </ng-container>

        <ng-container matColumnDef="time">
          <th mat-header-cell *matHeaderCellDef> Heure </th>
          <td mat-cell *matCellDef="let element"> {{element.time}} </td>
        </ng-container>

        <ng-container matColumnDef="guests">
          <th mat-header-cell *matHeaderCellDef> Invités </th>
          <td mat-cell *matCellDef="let element"> {{element.guests}} </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef> Statut </th>
          <td mat-cell *matCellDef="let element"> {{element.status}} </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="primary" (click)="updateStatus(element.id, 'confirmed')">
              <mat-icon>check</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="updateStatus(element.id, 'cancelled')">
              <mat-icon>close</mat-icon>
            </button>
            <button mat-icon-button color="accent" (click)="deleteReservation(element.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `
})
export class ReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  reservations: ReservationDto[] = [];
  displayedColumns: string[] = ['name', 'date', 'time', 'guests', 'status', 'actions'];

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.reservationService.getReservations().subscribe(data => {
      this.reservations = data;
    });
  }

  async updateStatus(id: string, status: string) {
    try {
      await this.reservationService.updateReservationStatus(id, status);
      this.loadReservations();
    } catch (error) {
      console.error('Error updating status', error);
    }
  }

  async deleteReservation(id: string) {
    if (confirm('Are you sure?')) {
      try {
        await this.reservationService.deleteReservation(id);
        this.loadReservations();
      } catch (error) {
        console.error('Error deleting reservation', error);
      }
    }
  }
}
