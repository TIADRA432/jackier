import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CateringService } from '../../core/services/catering.service';
import { CateringOrder } from '../../core/models/models';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-catering-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.order ? 'Modifier' : 'Créer' }} une commande</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Nom du Client</mat-label>
          <input matInput formControlName="clientName">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Date de l'événement</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="eventDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Type d'événement</mat-label>
          <input matInput formControlName="eventType" placeholder="Ex. Mariage, Anniversaire">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Nombre d'invités</mat-label>
          <input matInput type="number" formControlName="guests">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Budget (€)</mat-label>
          <input matInput type="number" formControlName="budget">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="status">
            <mat-option value="pending">En attente</mat-option>
            <mat-option value="approved">Validé</mat-option>
            <mat-option value="in-progress">En cours</mat-option>
            <mat-option value="completed">Terminé</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="save()">Enregistrer</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 10px; }
  `]
})
export class CateringOrderDialogComponent {
  private fb = inject(FormBuilder);
  private cateringService = inject(CateringService);
  private dialogRef = inject(MatDialogRef<CateringOrderDialogComponent>);
  
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { order?: CateringOrder }) {
    this.form = this.fb.group({
      clientName: [data.order?.clientName || '', Validators.required],
      eventDate: [data.order?.eventDate ? data.order.eventDate.toDate() : new Date(), Validators.required],
      eventType: [data.order?.eventType || '', Validators.required],
      guests: [data.order?.guests || 0, [Validators.required, Validators.min(1)]],
      budget: [data.order?.budget || 0, [Validators.required, Validators.min(0)]],
      status: [data.order?.status || 'pending', Validators.required]
    });
  }

  save() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const orderData: CateringOrder = {
      ...formValue,
      eventDate: Timestamp.fromDate(formValue.eventDate),
      createdAt: this.data.order?.createdAt || Timestamp.now()
    };

    if (this.data.order?.id) {
      this.cateringService.updateOrderStatus(this.data.order.id, formValue.status).then(() => {
        // Ideally update full object but service only has status update currently.
        // Let's assume we might want to update full object later.
        this.dialogRef.close(true);
      });
    } else {
      this.cateringService.addOrder(orderData).then(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
