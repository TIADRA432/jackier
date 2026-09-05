import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GalleryItem {
  id?: string;
  imageUrl: string;
  title: string;
  category: string;
  uploadedAt: any;
}
export type GalleryImage = GalleryItem;

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  getGalleryItems(): Observable<GalleryItem[]> { return this.http.get<GalleryItem[]>(`${this.apiUrl}/gallery`); }
  getGalleryImages(): Observable<GalleryItem[]> { return this.getGalleryItems(); }
  getImages(): Observable<GalleryItem[]> { return this.getGalleryItems(); }
  uploadImage(file: File, title = '', category = 'gallery'): Observable<any> {
    const formData = new FormData(); formData.append('image', file); formData.append('title', title); formData.append('category', category);
    return this.http.post<any>(`${this.apiUrl}/gallery`, formData);
  }
  addGalleryImage(data: any): Observable<any> { return this.http.post<any>(`${this.apiUrl}/gallery`, data); }
  deleteImage(id: string, _imageUrl?: string): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/gallery/${id}`); }
  deleteGalleryImage(id: string): Promise<void> { return this.deleteImage(id).toPromise().then(() => undefined); }
}
