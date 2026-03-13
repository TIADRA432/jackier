import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MenuService } from '../../../core/services/menu.service';
import { MenuItemDto } from '../../../core/dto/menu.dto';
import { AddDishDialogComponent } from './add-dish-dialog.component';

@Component({
  selector: 'app-cms',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Gestion du Menu</h2>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon> Ajouter un Plat
        </button>
      </div>
      
      <table mat-table [dataSource]="menu" class="mat-elevation-z8 w-full">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef> Nom </th>
          <td mat-cell *matCellDef="let element"> {{element.name}} </td>
        </ng-container>

        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef> Catégorie </th>
          <td mat-cell *matCellDef="let element"> {{element.category}} </td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef> Prix </th>
          <td mat-cell *matCellDef="let element"> {{element.price | currency:'EUR'}} </td>
        </ng-container>

        <ng-container matColumnDef="active">
          <th mat-header-cell *matHeaderCellDef> Actif </th>
          <td mat-cell *matCellDef="let element">
            <mat-icon [color]="element.active ? 'primary' : 'warn'">
              {{element.active ? 'check_circle' : 'cancel'}}
            </mat-icon>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="accent" (click)="toggleActive(element)">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteDish(element.id)">
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
export class CMSComponent implements OnInit {
  private menuService = inject(MenuService);
  private dialog = inject(MatDialog);
  
  menu: MenuItemDto[] = [];
  displayedColumns: string[] = ['name', 'category', 'price', 'active', 'actions'];

  ngOnInit() {
    this.loadMenu();
  }

  loadMenu() {
    this.menuService.getMenu().subscribe(data => {
      this.menu = data;
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddDishDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.menuService.addDish(result).subscribe({
          next: () => this.loadMenu(),
          error: (error) => console.error('Error adding dish', error)
        });
      }
    });
  }

  toggleActive(dish: MenuItemDto) {
    if (!dish.id) return;
    this.menuService.updateDish(dish.id, { active: !dish.active }).subscribe({
      next: () => this.loadMenu(),
      error: (error) => console.error('Error updating dish', error)
    });
  }

  deleteDish(id: string) {
    if (confirm('Are you sure?')) {
      this.menuService.deleteDish(id).subscribe({
        next: () => this.loadMenu(),
        error: (error) => console.error('Error deleting dish', error)
      });
    }
  }
}
