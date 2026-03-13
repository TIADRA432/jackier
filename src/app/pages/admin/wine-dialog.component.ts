import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { WineItem } from '../../core/models/menu.models';
import { MenuService } from '../../core/services/menu.service';

@Component({
  selector: 'app-wine-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSlideToggleModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.wine ? 'Modifier le vin' : 'Nouveau vin' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4 pt-4">
        
        <div class="flex gap-4">
          <mat-form-field appearance="outline" class="flex-[2]">
            <mat-label>Nom du vin</mat-label>
            <input matInput formControlName="name">
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Millésime</mat-label>
            <input matInput type="number" formControlName="year">
          </mat-form-field>
        </div>

        <div class="flex gap-4">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Origine / Région</mat-label>
            <input matInput formControlName="origin">
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Cépage</mat-label>
            <input matInput formControlName="grape">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="2"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Suggestion d'accord (optionnel)</mat-label>
          <input matInput formControlName="pairingSuggestion">
        </mat-form-field>

        <div class="flex gap-4">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Prix Bouteille (€)</mat-label>
            <input matInput type="number" formControlName="priceBottle">
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Prix Verre (€) (optionnel)</mat-label>
            <input matInput type="number" formControlName="priceGlass">
          </mat-form-field>
        </div>

        <div class="flex flex-col gap-2 border border-gray-200 p-4 rounded-md">
          <span class="text-sm text-gray-600 font-medium">Image de la bouteille (optionnelle)</span>
          @if (imageUrl()) {
            <div class="relative w-24 h-32">
              <img [src]="imageUrl()" class="w-full h-full object-contain rounded-md" referrerpolicy="no-referrer">
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
          <mat-form-field appearance="outline" class="flex-1 ml-4">
            <mat-label>Ordre d'affichage</mat-label>
            <input matInput type="number" formControlName="displayOrder">
          </mat-form-field>
        </div>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-flat-button class="!bg-gray-900 !text-white" [disabled]="form.invalid || uploading()" (click)="save()">Enregistrer</button>
    </mat-dialog-actions>
  `
})
export class WineDialogComponent {
  private fb = inject(FormBuilder);
  private menuService = inject(MenuService);
  
  form: FormGroup;
  imageUrl = signal<string>('');
  uploading = signal<boolean>(false);

  constructor(
    public dialogRef: MatDialogRef<WineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { wine?: WineItem }
  ) {
    this.imageUrl.set(data.wine?.imageUrl || '');
    
    this.form = this.fb.group({
      name: [data.wine?.name || '', Validators.required],
      origin: [data.wine?.origin || '', Validators.required],
      grape: [data.wine?.grape || '', Validators.required],
      year: [data.wine?.year || new Date().getFullYear()],
      description: [data.wine?.description || '', Validators.required],
      pairingSuggestion: [data.wine?.pairingSuggestion || ''],
      priceBottle: [data.wine?.priceBottle || 0, [Validators.required, Validators.min(0)]],
      priceGlass: [data.wine?.priceGlass || null],
      displayOrder: [data.wine?.displayOrder || 0],
      active: [data.wine?.active ?? true]
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.uploading.set(true);
      this.menuService.uploadWineImage(file).subscribe({
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
      const result: WineItem = {
        ...this.data.wine,
        ...this.form.value,
        imageUrl: this.imageUrl()
      };
      this.dialogRef.close(result);
    }
  }
}
