import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchoolService } from '../../core/services/school.service';
import { SchoolProgramDto } from '../../core/dto/school.dto';

@Component({
  selector: 'app-school-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.program ? 'Modifier' : 'Ajouter' }} un programme</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="title">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Durée</mat-label>
          <input matInput formControlName="duration" placeholder="Ex. 3 mois">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description"></textarea>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Prix</mat-label>
          <input matInput type="number" formControlName="price">
        </mat-form-field>

        <mat-slide-toggle formControlName="active">Actif</mat-slide-toggle>
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
export class SchoolProgramDialogComponent {
  private fb = inject(FormBuilder);
  private schoolService = inject(SchoolService);
  private dialogRef = inject(MatDialogRef<SchoolProgramDialogComponent>);
  
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { program?: SchoolProgramDto }) {
    this.form = this.fb.group({
      title: [data.program?.title || '', Validators.required],
      duration: [data.program?.duration || '', Validators.required],
      description: [data.program?.description || '', Validators.required],
      price: [data.program?.price || 0, [Validators.required, Validators.min(0)]],
      active: [data.program?.active ?? true]
    });
  }

  save() {
    if (this.form.invalid) return;

    const programData: SchoolProgramDto = {
      ...this.form.value
    };

    if (this.data.program?.id) {
      this.schoolService.updateProgram(this.data.program.id, programData).then(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.schoolService.addProgram(programData).then(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
