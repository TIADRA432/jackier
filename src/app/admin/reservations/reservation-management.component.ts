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
import { ReservationService } from '../../core/services/reservation.service';
import { Reservation } from '../../core/models/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reservation-management',
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
    <div class="reservation-container">
      <div class="header">
        <h1>Reservation Management</h1>
      </div>

      <table mat-table [dataSource]="reservations$ | async" class="mat-elevation-z8">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef> Name </th>
          <td mat-cell *matCellDef="let element"> {{element.name}} </td>
        </ng-container>

        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef> Date </th>
          <td mat-cell *matCellDef="let element"> {{element.date.toDate() | date:'medium'}} </td>
        </ng-container>

        <ng-container matColumnDef="guests">
          <th mat-header-cell *matHeaderCellDef> Guests </th>
          <td mat-cell *matCellDef="let element"> {{element.guests}} </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef> Status </th>
          <td mat-cell *matCellDef="let element">
            <span [class]="'status-badge ' + element.status">{{element.status}}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="primary" (click)="updateStatus(element, 'approved')" *ngIf="element.status === 'pending'">
              <mat-icon>check_circle</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="updateStatus(element, 'rejected')" *ngIf="element.status === 'pending'">
              <mat-icon>cancel</mat-icon>
            </button>
            <button mat-icon-button color="accent" (click)="updateStatus(element, 'completed')" *ngIf="element.status === 'approved'">
              <mat-icon>done_all</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .reservation-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
    .status-badge {
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 0.8em;
      text-transform: uppercase;
    }
    .status-badge.pending {
      background-color: #ffcc00;
      color: #000;
    }
    .status-badge.approved {
      background-color: #4caf50;
      color: #fff;
    }
    .status-badge.rejected {
      background-color: #f44336;
      color: #fff;
    }
    .status-badge.completed {
      background-color: #2196f3;
      color: #fff;
    }
  `]
})
export class ReservationManagementComponent implements OnInit {
  displayedColumns: string[] = ['name', 'date', 'guests', 'status', 'actions'];
  reservations$: Observable<Reservation[]>;

  constructor(
    private reservationService: ReservationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.reservations$ = this.reservationService.getReservations();
  }

  updateStatus(reservation: Reservation, status: 'approved' | 'rejected' | 'completed') {
    this.reservationService.updateReservation({ ...reservation, status }).then(() => {
      this.snackBar.open(`Reservation ${status}`, 'Close', { duration: 3000 });
    });
  }
}
