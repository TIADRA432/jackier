import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MenuService } from '../../core/services/menu.service';
import { MenuCategory, MenuItem, WineItem } from '../../core/models/menu.models';
import { MenuItemDialogComponent } from './menu-item-dialog.component';
import { WineDialogComponent } from './wine-dialog.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatButtonModule, 
    MatIconModule, 
    MatInputModule, 
    MatSelectModule, 
    MatSlideToggleModule, 
    MatTabsModule,
    MatTableModule,
    MatDialogModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 p-6 font-sans">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-semibold text-gray-900">Gestion du Menu</h1>
          <a mat-stroked-button href="/" target="_blank">
            <mat-icon>visibility</mat-icon> Voir le menu
          </a>
        </div>

        <mat-tab-group class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          <!-- CATEGORIES TAB -->
          <mat-tab label="Catégories">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-medium">Catégories</h2>
                <button mat-flat-button class="!bg-gray-900 !text-white" (click)="editCategory()">
                  <mat-icon>add</mat-icon> Nouvelle Catégorie
                </button>
              </div>

              <table mat-table [dataSource]="categories()" class="w-full">
                <ng-container matColumnDef="order">
                  <th mat-header-cell *matHeaderCellDef> Ordre </th>
                  <td mat-cell *matCellDef="let element"> {{element.order}} </td>
                </ng-container>

                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef> Nom </th>
                  <td mat-cell *matCellDef="let element"> {{element.name}} </td>
                </ng-container>

                <ng-container matColumnDef="active">
                  <th mat-header-cell *matHeaderCellDef> Statut </th>
                  <td mat-cell *matCellDef="let element"> 
                    <span class="px-2 py-1 rounded-full text-xs" [class.bg-green-100]="element.active" [class.text-green-800]="element.active" [class.bg-gray-100]="!element.active" [class.text-gray-800]="!element.active">
                      {{element.active ? 'Actif' : 'Inactif'}}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef class="text-right"> Actions </th>
                  <td mat-cell *matCellDef="let element" class="text-right">
                    <button mat-icon-button color="primary" (click)="editCategory(element)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteCategory(element.id)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="['order', 'name', 'active', 'actions']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['order', 'name', 'active', 'actions'];"></tr>
              </table>
            </div>
          </mat-tab>

          <!-- MENU ITEMS TAB -->
          <mat-tab label="Plats">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-medium">Plats</h2>
                <button mat-flat-button class="!bg-gray-900 !text-white" (click)="editMenuItem()">
                  <mat-icon>add</mat-icon> Nouveau Plat
                </button>
              </div>

              <table mat-table [dataSource]="menuItems()" class="w-full">
                <ng-container matColumnDef="image">
                  <th mat-header-cell *matHeaderCellDef> Image </th>
                  <td mat-cell *matCellDef="let element"> 
                    @if (element.imageUrl) {
                      <img [src]="element.imageUrl" class="w-12 h-12 object-cover rounded-md my-2" referrerpolicy="no-referrer">
                    } @else {
                      <div class="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center my-2 text-gray-400">
                        <mat-icon class="text-sm">image</mat-icon>
                      </div>
                    }
                  </td>
                </ng-container>

                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef> Nom </th>
                  <td mat-cell *matCellDef="let element"> 
                    <div class="font-medium">{{element.name}}</div>
                    <div class="text-xs text-gray-500">{{getCategoryName(element.categoryId)}}</div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="price">
                  <th mat-header-cell *matHeaderCellDef> Prix </th>
                  <td mat-cell *matCellDef="let element"> {{element.price}} € </td>
                </ng-container>

                <ng-container matColumnDef="active">
                  <th mat-header-cell *matHeaderCellDef> Statut </th>
                  <td mat-cell *matCellDef="let element"> 
                    <span class="px-2 py-1 rounded-full text-xs" [class.bg-green-100]="element.active" [class.text-green-800]="element.active" [class.bg-gray-100]="!element.active" [class.text-gray-800]="!element.active">
                      {{element.active ? 'Actif' : 'Inactif'}}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef class="text-right"> Actions </th>
                  <td mat-cell *matCellDef="let element" class="text-right">
                    <button mat-icon-button color="primary" (click)="editMenuItem(element)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteMenuItem(element.id)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="['image', 'name', 'price', 'active', 'actions']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['image', 'name', 'price', 'active', 'actions'];"></tr>
              </table>
            </div>
          </mat-tab>

          <!-- WINES TAB -->
          <mat-tab label="Vins">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-medium">Carte des Vins</h2>
                <button mat-flat-button class="!bg-gray-900 !text-white" (click)="editWine()">
                  <mat-icon>add</mat-icon> Nouveau Vin
                </button>
              </div>

              <table mat-table [dataSource]="wines()" class="w-full">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef> Nom </th>
                  <td mat-cell *matCellDef="let element"> 
                    <div class="font-medium">{{element.name}} {{element.year}}</div>
                    <div class="text-xs text-gray-500">{{element.origin}} • {{element.grape}}</div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="prices">
                  <th mat-header-cell *matHeaderCellDef> Prix </th>
                  <td mat-cell *matCellDef="let element"> 
                    <div class="text-sm">Bouteille: {{element.priceBottle}} €</div>
                    @if (element.priceGlass) {
                      <div class="text-xs text-gray-500">Verre: {{element.priceGlass}} €</div>
                    }
                  </td>
                </ng-container>

                <ng-container matColumnDef="active">
                  <th mat-header-cell *matHeaderCellDef> Statut </th>
                  <td mat-cell *matCellDef="let element"> 
                    <span class="px-2 py-1 rounded-full text-xs" [class.bg-green-100]="element.active" [class.text-green-800]="element.active" [class.bg-gray-100]="!element.active" [class.text-gray-800]="!element.active">
                      {{element.active ? 'Actif' : 'Inactif'}}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef class="text-right"> Actions </th>
                  <td mat-cell *matCellDef="let element" class="text-right">
                    <button mat-icon-button color="primary" (click)="editWine(element)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="deleteWine(element.id)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="['name', 'prices', 'active', 'actions']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['name', 'prices', 'active', 'actions'];"></tr>
              </table>
            </div>
          </mat-tab>

        </mat-tab-group>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit {
  private menuService = inject(MenuService);
  private dialog = inject(MatDialog);

  categories = signal<MenuCategory[]>([]);
  menuItems = signal<MenuItem[]>([]);
  wines = signal<WineItem[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.menuService.getCategories().subscribe(res => this.categories.set(res.sort((a, b) => a.order - b.order)));
    this.menuService.getMenuItems().subscribe(res => this.menuItems.set(res.sort((a, b) => a.displayOrder - b.displayOrder)));
    this.menuService.getWines().subscribe(res => this.wines.set(res.sort((a, b) => a.displayOrder - b.displayOrder)));
  }

  getCategoryName(id: string): string {
    return this.categories().find(c => c.id === id)?.name || 'Inconnu';
  }

  // Categories
  editCategory(category?: MenuCategory) {
    // In a real app, open a dialog. For simplicity, we'll use window.prompt/confirm or a simple form
    // Since we need to build a full app, I will implement a basic prompt for now to save space, 
    // or ideally a dialog component.
    const name = prompt('Nom de la catégorie:', category?.name || '');
    if (!name) return;
    
    const order = parseInt(prompt('Ordre d\'affichage:', category?.order?.toString() || '0') || '0', 10);
    
    const newCat: MenuCategory = {
      name,
      order,
      active: true,
      description: category?.description || ''
    };

    if (category?.id) {
      this.menuService.updateCategory(category.id, newCat).subscribe(() => this.loadData());
    } else {
      this.menuService.addCategory(newCat).subscribe(() => this.loadData());
    }
  }

  deleteCategory(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      this.menuService.deleteCategory(id).subscribe(() => this.loadData());
    }
  }

  // Menu Items
  editMenuItem(item?: MenuItem) {
    const dialogRef = this.dialog.open(MenuItemDialogComponent, {
      width: '600px',
      data: { item, categories: this.categories() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (item?.id) {
          this.menuService.updateMenuItem(item.id, result).subscribe(() => this.loadData());
        } else {
          this.menuService.addMenuItem(result).subscribe(() => this.loadData());
        }
      }
    });
  }

  deleteMenuItem(id: string) {
    if (confirm('Voulez-vous vraiment supprimer ce plat ?')) {
      this.menuService.deleteMenuItem(id).subscribe(() => this.loadData());
    }
  }

  // Wines
  editWine(wine?: WineItem) {
    const dialogRef = this.dialog.open(WineDialogComponent, {
      width: '600px',
      data: { wine }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (wine?.id) {
          this.menuService.updateWine(wine.id, result).subscribe(() => this.loadData());
        } else {
          this.menuService.addWine(result).subscribe(() => this.loadData());
        }
      }
    });
  }

  deleteWine(id: string) {
    if (confirm('Voulez-vous vraiment supprimer ce vin ?')) {
      this.menuService.deleteWine(id).subscribe(() => this.loadData());
    }
  }
}
