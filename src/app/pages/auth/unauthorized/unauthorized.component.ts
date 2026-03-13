import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-sans">
      <div class="text-center max-w-md">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 text-red-500 mb-8 border border-red-500/20">
          <mat-icon class="text-6xl h-auto w-auto">lock</mat-icon>
        </div>
        <h1 class="text-4xl font-serif font-bold text-white mb-4">Accès Refusé</h1>
        <p class="text-gray-400 mb-8">
          Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette section. 
          Veuillez contacter votre administrateur si vous pensez qu'il s'agit d'une erreur.
        </p>
        <div class="flex flex-col gap-4">
          <a mat-raised-button color="primary" routerLink="/admin/dashboard" class="py-6 rounded-2xl font-bold uppercase tracking-widest">
            Retour au Tableau de Bord
          </a>
          <a mat-button routerLink="/" class="text-gray-500 hover:text-white transition-colors">
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {}
