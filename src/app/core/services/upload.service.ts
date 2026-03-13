import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  uploadFile(file: File): Observable<{ url: string, message: string }> {
    // Mock upload for demo
    const mockUrl = `https://picsum.photos/seed/${Math.random()}/800/600`;
    return of({ 
      url: mockUrl, 
      message: 'Fichier téléchargé avec succès (Simulation)' 
    }).pipe(delay(1000));
  }

  deleteFile(filename: string): Observable<{ message: string }> {
    return of({ message: 'Fichier supprimé avec succès (Simulation)' }).pipe(delay(500));
  }
}
