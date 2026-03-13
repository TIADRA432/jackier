import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { GalleryService } from '../../../core/services/gallery.service';

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-serif font-bold text-jacquier-gold">Gestion de la Galerie</h2>
        <button mat-raised-button color="primary" (click)="fileInput.click()" class="px-6 py-2">
          <mat-icon class="mr-2">upload</mat-icon>
          Ajouter une Image
        </button>
        <input type="file" #fileInput hidden accept="image/*" (change)="onFileSelected($event)">
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        @for (image of images; track image.id) {
          <mat-card class="bg-[#1a1a1a] border border-gray-800 overflow-hidden group">
            <div class="relative aspect-square">
              <img [src]="image.url" [alt]="image.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerpolicy="no-referrer">
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button mat-icon-button color="warn" (click)="deleteImage(image.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
            <div class="p-2 text-center text-xs text-gray-400 truncate">
              {{ image.name }}
            </div>
          </mat-card>
        } @empty {
          <div class="col-span-full py-12 text-center text-gray-500">
            <mat-icon class="text-6xl mb-4 opacity-50">photo_library</mat-icon>
            <p>Aucune image dans la galerie.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class AdminGalleryComponent implements OnInit {
  private galleryService = inject(GalleryService);
  private snackBar = inject(MatSnackBar);

  images: any[] = [];

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.galleryService.getImages().subscribe(data => this.images = data);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.galleryService.uploadImage(file).subscribe({
        next: () => {
          this.snackBar.open('Image ajoutée avec succès', 'Fermer', { duration: 3000 });
          this.loadImages();
        },
        error: () => {
          this.snackBar.open('Erreur lors de l\\'ajout de l\\'image', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  deleteImage(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette image ?')) {
      this.galleryService.deleteImage(id).subscribe({
        next: () => {
          this.snackBar.open('Image supprimée', 'Fermer', { duration: 3000 });
          this.loadImages();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
