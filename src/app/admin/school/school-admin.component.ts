import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { SchoolService } from '../../core/services/school.service';
import { SchoolProgram } from '../../core/models/models';
import { SchoolProgramDialogComponent } from './school-dialog.component';

@Component({
  selector: 'app-school-admin',
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
    MatSlideToggleModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>École Gastronomique</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon> Ajouter un programme
        </button>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Filtrer</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Ex. Pâtisserie" #input>
      </mat-form-field>

      <div class="mat-elevation-z8">
        <table mat-table [dataSource]="dataSource" matSort>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Titre </th>
            <td mat-cell *matCellDef="let row"> {{row.title}} </td>
          </ng-container>

          <ng-container matColumnDef="duration">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Durée </th>
            <td mat-cell *matCellDef="let row"> {{row.duration}} </td>
          </ng-container>

          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Prix </th>
            <td mat-cell *matCellDef="let row"> {{row.price | currency:'EUR'}} </td>
          </ng-container>

          <ng-container matColumnDef="active">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Actif </th>
            <td mat-cell *matCellDef="let row">
              <mat-slide-toggle [checked]="row.active" (change)="toggleStatus(row, $event.checked)"></mat-slide-toggle>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button color="primary" (click)="openDialog(row)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteProgram(row)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="5">Aucune donnée correspondant au filtre "{{input.value}}"</td>
          </tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 25]" aria-label="Select page of users"></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    table { width: 100%; }
    .full-width { width: 100%; }
  `]
})
export class SchoolAdminComponent implements OnInit {
  displayedColumns: string[] = ['title', 'duration', 'price', 'active', 'actions'];
  dataSource: MatTableDataSource<SchoolProgram>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private schoolService = inject(SchoolService);
  private dialog = inject(MatDialog);

  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadPrograms();
  }

  loadPrograms() {
    this.schoolService.getPrograms().subscribe(data => {
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

  openDialog(program?: SchoolProgram) {
    const dialogRef = this.dialog.open(SchoolProgramDialogComponent, {
      width: '500px',
      data: { program }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPrograms();
      }
    });
  }

  toggleStatus(program: SchoolProgram, active: boolean) {
    this.schoolService.toggleProgramStatus(program.id!, active);
  }

  deleteProgram(program: SchoolProgram) {
    if (confirm(`Supprimer le programme ${program.title} ?`)) {
      this.schoolService.deleteProgram(program.id!);
    }
  }
}
