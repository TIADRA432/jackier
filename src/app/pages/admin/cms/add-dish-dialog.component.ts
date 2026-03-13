import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-dish-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>Ajouter un Plat</h2>
    <mat-dialog-content>
      <form [formGroup]="dishForm">
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="name">
        </mat-form-field>

        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description"></textarea>
        </mat-form-field>

        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Prix</mat-label>
          <input matInput type="number" formControlName="price">
        </mat-form-field>

        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Catégorie</mat-label>
          <mat-select formControlName="category">
            <mat-option value="Entrée">Entrée</mat-option>
            <mat-option value="Plat">Plat</mat-option>
            <mat-option value="Dessert">Dessert</mat-option>
            <mat-option value="Boisson">Boisson</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-raised-button color="primary" [disabled]="dishForm.invalid" (click)="save()">Ajouter</button>
    </mat-dialog-actions>
  `
})
export class AddDishDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddDishDialogComponent>);

  dishForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
    active: [true]
  });

  save() {
    if (this.dishForm.valid) {
      this.dialogRef.close(this.dishForm.value);
    }
  }
}
