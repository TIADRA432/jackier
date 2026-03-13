import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private snackBar: MatSnackBar, private zone: NgZone) {}

  handleError(error: any) {
    console.error('An error occurred:', error);
    
    this.zone.run(() => {
      this.snackBar.open(
        'Une erreur est survenue. Veuillez réessayer.', 
        'Fermer', 
        { duration: 5000, panelClass: ['error-snackbar'] }
      );
    });
  }
}
