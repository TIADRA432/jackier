import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GalleryService } from '../../core/services/gallery.service';
import { GalleryItem } from '../../core/models/models';

@Component({
  selector: 'app-gallery-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Galerie Photos</h1>
      </div>

      <div class="upload-section">
        <h2>Ajouter une image</h2>
        <form [formGroup]="uploadForm" (ngSubmit)="upload()">
          <mat-form-field appearance="outline">
            <mat-label>Titre</mat-label>
            <input matInput formControlName="title">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Catégorie</mat-label>
            <mat-select formControlName="category">
              <mat-option value="restaurant">Restaurant</mat-option>
              <mat-option value="plats">Plats</mat-option>
              <mat-option value="ecole">École</mat-option>
              <mat-option value="events">Événements</mat-option>
            </mat-select>
          </mat-form-field>

          <div class="file-input">
            <input type="file" (change)="onFileSelected($event)" accept="image/*">
          </div>

          <button mat-raised-button color="primary" type="submit" [disabled]="uploadForm.invalid || !selectedFile || isUploading">
            <mat-icon>cloud_upload</mat-icon> {{ isUploading ? 'Envoi...' : 'Uploader' }}
          </button>
        </form>
      </div>

      <div class="gallery-grid">
        <mat-grid-list cols="4" rowHeight="200px" gutterSize="10px">
          <mat-grid-tile *ngFor="let item of galleryItems" [colspan]="1" [rowspan]="1">
            <div class="tile-content">
              <img [src]="item.imageUrl" [alt]="item.title">
              <div class="tile-footer">
                <span>{{item.title}}</span>
                <button mat-icon-button color="warn" (click)="deleteImage(item)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </mat-grid-tile>
        </mat-grid-list>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .upload-section { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .upload-section form { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; }
    .tile-content { position: relative; width: 100%; height: 100%; overflow: hidden; }
    .tile-content img { width: 100%; height: 100%; object-fit: cover; }
    .tile-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,0.6);
      color: white;
      padding: 5px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class GalleryAdminComponent implements OnInit {
  galleryItems: GalleryItem[] = [];
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isUploading = false;

  private galleryService = inject(GalleryService);
  private fb = inject(FormBuilder);

  constructor() {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      category: ['restaurant', Validators.required]
    });
  }

  ngOnInit() {
    this.loadGallery();
  }

  loadGallery() {
    this.galleryService.getGalleryItems().subscribe(data => {
      this.galleryItems = data;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async upload() {
    if (this.uploadForm.invalid || !this.selectedFile) return;

    this.isUploading = true;
    const { title, category } = this.uploadForm.value;

    try {
      await this.galleryService.uploadImage(this.selectedFile, title, category);
      this.uploadForm.reset({ category: 'restaurant' });
      this.selectedFile = null;
      // Toast success
    } catch (error) {
      console.error('Upload failed', error);
      // Toast error
    } finally {
      this.isUploading = false;
    }
  }

  async deleteImage(item: GalleryItem) {
    if (confirm(`Supprimer l'image ${item.title} ?`)) {
      try {
        await this.galleryService.deleteImage(item.id!, item.imageUrl);
        // Toast success
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  }
}
