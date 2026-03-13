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
import { SchoolService } from '../../core/services/school.service';
import { SchoolProgram } from '../../core/models/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-school-management',
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
    <div class="school-container">
      <div class="header">
        <h1>School Programs Management</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon> New Program
        </button>
      </div>

      <table mat-table [dataSource]="programs$ | async" class="mat-elevation-z8">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef> Title </th>
          <td mat-cell *matCellDef="let element"> {{element.title}} </td>
        </ng-container>

        <ng-container matColumnDef="duration">
          <th mat-header-cell *matHeaderCellDef> Duration </th>
          <td mat-cell *matCellDef="let element"> {{element.duration}} </td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef> Price </th>
          <td mat-cell *matCellDef="let element"> {{element.price | currency}} </td>
        </ng-container>

        <ng-container matColumnDef="active">
          <th mat-header-cell *matHeaderCellDef> Active </th>
          <td mat-cell *matCellDef="let element">
            <mat-icon [color]="element.active ? 'primary' : 'warn'">
              {{element.active ? 'check_circle' : 'cancel'}}
            </mat-icon>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="primary" (click)="openDialog(element)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteProgram(element.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .school-container {
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
  `]
})
export class SchoolManagementComponent implements OnInit {
  displayedColumns: string[] = ['title', 'duration', 'price', 'active', 'actions'];
  programs$: Observable<SchoolProgram[]>;

  constructor(
    private schoolService: SchoolService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.programs$ = this.schoolService.getSchoolPrograms();
  }

  openDialog(program?: SchoolProgram) {
    const dialogRef = this.dialog.open(SchoolProgramDialogComponent, {
      width: '400px',
      data: program || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (program) {
          this.schoolService.updateSchoolProgram({ ...program, ...result }).then(() => {
            this.snackBar.open('Program updated', 'Close', { duration: 3000 });
          });
        } else {
          this.schoolService.addSchoolProgram(result).then(() => {
            this.snackBar.open('Program added', 'Close', { duration: 3000 });
          });
        }
      }
    });
  }

  deleteProgram(id: string) {
    if (confirm('Are you sure you want to delete this program?')) {
      this.schoolService.deleteSchoolProgram(id).then(() => {
        this.snackBar.open('Program deleted', 'Close', { duration: 3000 });
      });
    }
  }
}

@Component({
  selector: 'app-school-program-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.id ? 'Edit' : 'Add'}} School Program</h2>
    <mat-dialog-content [formGroup]="form">
      <mat-form-field appearance="fill">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description"></textarea>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Duration</mat-label>
        <input matInput formControlName="duration">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Price</mat-label>
        <input matInput type="number" formControlName="price">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Active</mat-label>
        <mat-select formControlName="active">
          <mat-option [value]="true">Yes</mat-option>
          <mat-option [value]="false">No</mat-option>
        </mat-select>
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
export class SchoolProgramDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: SchoolProgram
  ) {
    this.form = this.fb.group({
      title: [data.title || '', Validators.required],
      description: [data.description || ''],
      duration: [data.duration || '', Validators.required],
      price: [data.price || 0, [Validators.required, Validators.min(0)]],
      active: [data.active !== undefined ? data.active : true]
    });
  }
}
import { Inject, MAT_DIALOG_DATA } from '@angular/material/dialog';
