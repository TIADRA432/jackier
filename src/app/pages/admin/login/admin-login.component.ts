import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../../../core/services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-[#121212] px-4 py-12 flex items-center justify-center">
      <section class="w-full max-w-md rounded-2xl border border-gray-800 bg-[#1a1a1a] p-8 shadow-2xl">
        <a routerLink="/" class="mb-8 inline-flex items-center gap-3 text-jacquier-gold font-serif text-xl font-bold tracking-widest uppercase">
          <span class="w-8 h-8 rounded-full bg-jacquier-gold text-[#1a1a1a] flex items-center justify-center font-sans">J</span>
          Le Jacquier
        </a>
        <h1 class="text-3xl font-serif font-bold text-white">Administration</h1>
        <p class="mt-2 text-sm leading-6 text-gray-400">Connectez-vous avec un compte administrateur autorisé.</p>

        <form class="mt-8 space-y-5" [formGroup]="form" (ngSubmit)="submit()">
          <div>
            <label for="admin-email" class="mb-2 block text-sm font-medium text-gray-200">Adresse e-mail</label>
            <input id="admin-email" type="email" autocomplete="email" formControlName="email"
              class="w-full rounded-xl border border-gray-700 bg-[#121212] px-4 py-3 text-white outline-none transition focus:border-jacquier-gold focus:ring-1 focus:ring-jacquier-gold" />
          </div>
          <div>
            <label for="admin-password" class="mb-2 block text-sm font-medium text-gray-200">Mot de passe</label>
            <input id="admin-password" type="password" autocomplete="current-password" formControlName="password"
              class="w-full rounded-xl border border-gray-700 bg-[#121212] px-4 py-3 text-white outline-none transition focus:border-jacquier-gold focus:ring-1 focus:ring-jacquier-gold" />
          </div>

          @if (errorMessage()) {
            <p class="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200" role="alert">{{ errorMessage() }}</p>
          }

          <button type="submit" [disabled]="form.invalid || isSubmitting()"
            class="w-full rounded-xl bg-jacquier-gold px-4 py-3 font-bold text-[#1a1a1a] transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60">
            {{ isSubmitting() ? 'Vérification…' : 'Se connecter' }}
          </button>
        </form>
      </section>
    </main>
  `
})
export class AdminLoginComponent {
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] })
  });
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  async submit(): Promise<void> {
    if (this.form.invalid || this.isSubmitting()) return;

    this.errorMessage.set('');
    this.isSubmitting.set(true);
    try {
      const { email, password } = this.form.getRawValue();
      const signedIn = await this.auth.signInAsAdmin(email, password);
      if (!signedIn) {
        this.errorMessage.set('Connexion refusée. Vérifiez vos identifiants et vos droits administrateur.');
        return;
      }

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      await this.router.navigateByUrl(returnUrl?.startsWith('/admin/') ? returnUrl : '/admin/dashboard');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
