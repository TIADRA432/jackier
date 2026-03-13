import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-sans">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-jacquier-gold text-[#0a0a0a] font-bold text-3xl mb-4 shadow-lg shadow-jacquier-gold/20">
            J
          </div>
          <h1 class="text-3xl font-serif font-bold text-white tracking-widest uppercase">Le Jacquier</h1>
          <p class="text-gray-500 text-sm mt-2 uppercase tracking-[0.3em]">Administration</p>
        </div>

        <!-- Login Card -->
        <div class="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Email Professionnel</mat-label>
              <input matInput type="email" formControlName="email" placeholder="admin@lejacquier.com">
              <mat-icon matPrefix class="mr-2 text-gray-500">email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Mot de passe</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
              <mat-icon matPrefix class="mr-2 text-gray-500">lock</mat-icon>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <button 
              mat-raised-button 
              color="primary" 
              class="w-full py-7 rounded-2xl text-lg font-bold uppercase tracking-widest shadow-lg shadow-jacquier-gold/20"
              [disabled]="loginForm.invalid || loading"
            >
              @if (loading) {
                <span class="animate-pulse">Connexion...</span>
              } @else {
                Se Connecter
              }
            </button>
          </form>

          <div class="mt-8 pt-6 border-t border-gray-800 text-center">
            <p class="text-gray-500 text-xs mb-4">
              Accès réservé au personnel autorisé.<br>
              En cas de problème, contactez le support IT.
            </p>
            <button 
              mat-stroked-button 
              color="accent" 
              class="w-full"
              (click)="setupDemoAdmin()"
              [disabled]="loading"
            >
              Créer un compte Admin (Démo)
            </button>
          </div>
        </div>

        <!-- Back to site -->
        <div class="text-center mt-8">
          <a routerLink="/" class="text-gray-500 hover:text-white transition-colors text-sm flex items-center justify-center gap-2">
            <mat-icon class="text-sm h-4 w-4">arrow_back</mat-icon>
            Retour au site public
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    :host ::ng-deep .mat-mdc-text-field-wrapper { background-color: rgba(255,255,255,0.03) !important; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private http = inject(HttpClient);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = false;
  hidePassword = true;

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;
      if (email && password) {
        this.authService.login(email, password).subscribe({
          next: () => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
            this.router.navigateByUrl(returnUrl);
          },
          error: (err) => {
            this.loading = false;
            this.snackBar.open('Erreur de connexion : Identifiants invalides', 'Fermer', { duration: 5000 });
          }
        });
      }
    }
  }

  setupDemoAdmin() {
    this.loading = true;
    const email = 'admin@lejacquier.com';
    const password = 'password123';
    
    this.http.post(`${environment.apiUrl}/setup-admin`, { email, password }).subscribe({
      next: () => {
        this.loading = false;
        this.loginForm.patchValue({ email, password });
        this.snackBar.open('Compte Admin créé avec succès. Vous pouvez vous connecter.', 'Fermer', { duration: 5000 });
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur lors de la création du compte admin', err);
        this.snackBar.open('Erreur lors de la création du compte admin', 'Fermer', { duration: 5000 });
      }
    });
  }
}
