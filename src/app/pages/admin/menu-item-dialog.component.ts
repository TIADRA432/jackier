import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MenuCategory, MenuItem } from '../../core/models/menu.models';
import { MenuService } from '../../core/services/menu.service';

@Component({
  selector: 'app-menu-item-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatSlideToggleModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.item ? 'Modifier le plat' : 'Nouveau plat' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4 pt-4">
        
        <mat-form-field appearance="outline">
          <mat-label>Catégorie</mat-label>
          <mat-select formControlName="categoryId">
            @for (cat of data.categories; track cat.id) {
              <mat-option [value]="cat.id">{{ cat.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nom du plat</mat-label>
          <input matInput formControlName="name">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description courte</mat-label>
          <input matInput formControlName="shortDescription">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description détaillée (optionnelle)</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <div class="flex gap-4">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Prix (€)</mat-label>
            <input matInput type="number" formControlName="price">
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Ordre d'affichage</mat-label>
            <input matInput type="number" formControlName="displayOrder">
          </mat-form-field>
        </div>

        <div class="flex flex-col gap-2 border border-gray-200 p-4 rounded-md">
          <span class="text-sm text-gray-600 font-medium">Image du plat</span>
          @if (imageUrl()) {
            <div class="relative w-32 h-32">
              <img [src]="imageUrl()" class="w-full h-full object-cover rounded-md" referrerpolicy="no-referrer">
              <button mat-icon-button color="warn" class="absolute -top-2 -right-2 bg-white shadow-sm" (click)="imageUrl.set('')">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          } @else {
            <input type="file" accept="image/*" (change)="onFileSelected($event)" class="text-sm">
            @if (uploading()) {
              <span class="text-xs text-blue-500">Téléchargement en cours...</span>
            }
          }
        </div>

        <div class="flex gap-6 mt-2">
          <mat-slide-toggle formControlName="active">Actif</mat-slide-toggle>
          <mat-slide-toggle formControlName="isFeatured">Mise en avant</mat-slide-toggle>
        </div>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-flat-button class="!bg-gray-900 !text-white" [disabled]="form.invalid || uploading()" (click)="save()">Enregistrer</button>
    </mat-dialog-actions>
  `
})
export class MenuItemDialogComponent {
  private fb = inject(FormBuilder);
  private menuService = inject(MenuService);
  
  form: FormGroup;
  imageUrl = signal<string>('');
  uploading = signal<boolean>(false);

  constructor(
    public dialogRef: MatDialogRef<MenuItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item?: MenuItem, categories: MenuCategory[] }
  ) {
    this.imageUrl.set(data.item?.imageUrl || '');
    
    this.form = this.fb.group({
      categoryId: [data.item?.categoryId || '', Validators.required],
      name: [data.item?.name || '', Validators.required],
      shortDescription: [data.item?.shortDescription || '', Validators.required],
      description: [data.item?.description || ''],
      price: [data.item?.price || 0, [Validators.required, Validators.min(0)]],
      displayOrder: [data.item?.displayOrder || 0],
      active: [data.item?.active ?? true],
      isFeatured: [data.item?.isFeatured ?? false]
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.uploading.set(true);
      this.menuService.uploadMenuImage(file).subscribe({
        next: (res) => {
          this.imageUrl.set(res.url);
          this.uploading.set(false);
        },
        error: () => {
          alert('Erreur lors du téléchargement de l\'image');
          this.uploading.set(false);
        }
      });
    }
  }

  save() {
    if (this.form.valid) {
      const result: MenuItem = {
        ...this.data.item,
        ...this.form.value,
        imageUrl: this.imageUrl()
      };
      this.dialogRef.close(result);
    }
  }
}
