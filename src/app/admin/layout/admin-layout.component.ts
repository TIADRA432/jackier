import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="h-screen">
      <mat-sidenav #drawer class="w-64 bg-gray-900 border-r border-gray-800" fixedInViewport
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="(isHandset$ | async) === false">
        
        <div class="p-6 border-b border-gray-800">
          <h2 class="text-xl font-serif font-bold text-jacquier-gold uppercase tracking-widest">Le Jacquier</h2>
          <p class="text-xs text-gray-500 mt-1">Panel d'Administration</p>
        </div>

        <mat-nav-list class="admin-nav">
          <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon matListItemIcon class="text-gray-400">dashboard</mat-icon>
            <span matListItemTitle class="text-gray-300">Dashboard</span>
          </a>
          
          <div class="px-4 py-2 mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gestion Restaurant</div>
          
          <a mat-list-item routerLink="/admin/restaurant" routerLinkActive="active-link">
            <mat-icon matListItemIcon class="text-gray-400">table_bar</mat-icon>
            <span matListItemTitle class="text-gray-300">Salles & Tables</span>
          </a>
          <a mat-list-item routerLink="/admin/menu" routerLinkActive="active-link">
            <mat-icon matListItemIcon class="text-gray-400">restaurant_menu</mat-icon>
            <span matListItemTitle class="text-gray-300">Menu (CMS)</span>
          </a>
          <a mat-list-item routerLink="/admin/reservations" routerLinkActive="active-link">
            <mat-icon matListItemIcon class="text-gray-400">event</mat-icon>
            <span matListItemTitle class="text-gray-300">Réservations</span>
          </a>
          <a mat-list-item routerLink="/admin/catering" routerLinkActive="active-link">
            <mat-icon matListItemIcon class="text-gray-400">room_service</mat-icon>
            <span matListItemTitle class="text-gray-300">Traiteur</span>
          </a>
          <a mat-list-item routerLink="/admin/school" routerLinkActive="active-link">
            <mat-icon matListItemIcon class="text-gray-400">school</mat-icon>
            <span matListItemTitle class="text-gray-300">École</span>
          </a>

          <div class="px-4 py-2 mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Opérations</div>

          <a mat-list-item routerLink="/admin/finance" routerLinkActive="active-link">
            <mat-icon matListItemIcon class="text-gray-400">payments</mat-icon>
            <span matListItemTitle class="text-gray-300">Finance</span>
          </a>
          <a mat-list-item routerLink="/admin/stock" routerLinkActive="active-link">
            <mat-icon matListItemIcon class="text-gray-400">inventory_2</mat-icon>
            <span matListItemTitle class="text-gray-300">Stock</span>
          </a>
          <a mat-list-item routerLink="/admin/analytics" routerLinkActive="active-link">
            <mat-icon matListItemIcon class="text-gray-400">analytics</mat-icon>
            <span matListItemTitle class="text-gray-300">Analytique</span>
          </a>

          <div class="px-4 py-2 mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Système</div>

          <a mat-list-item routerLink="/admin/equipe" routerLinkActive="active-link">
            <mat-icon matListItemIcon class="text-gray-400">badge</mat-icon>
            <span matListItemTitle class="text-gray-300">Équipe</span>
          </a>
          <a mat-list-item routerLink="/admin/gallery" routerLinkActive="active-link">
            <mat-icon matListItemIcon class="text-gray-400">photo_library</mat-icon>
            <span matListItemTitle class="text-gray-300">Galerie</span>
          </a>
          <a mat-list-item routerLink="/admin/settings" routerLinkActive="active-link">
            <mat-icon matListItemIcon class="text-gray-400">settings</mat-icon>
            <span matListItemTitle class="text-gray-300">Paramètres</span>
          </a>
        </mat-nav-list>

        <div class="absolute bottom-0 w-full p-4 border-t border-gray-800 bg-gray-900">
          <button mat-button class="w-full text-red-500 hover:bg-red-500/10" (click)="logout()">
            <mat-icon>logout</mat-icon>
            Déconnexion
          </button>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="bg-gray-50">
        <mat-toolbar class="bg-white border-b border-gray-200 flex justify-between items-center px-6">
          <div class="flex items-center">
            <button
              type="button"
              aria-label="Toggle sidenav"
              mat-icon-button
              (click)="drawer.toggle()"
              *ngIf="isHandset$ | async">
              <mat-icon>menu</mat-icon>
            </button>
            <span class="text-gray-400 text-sm font-medium ml-2">Administration / {{ currentRoute() }}</span>
          </div>
          
          <div class="flex items-center space-x-4">
            <button mat-icon-button class="text-gray-400">
              <mat-icon>notifications</mat-icon>
            </button>
            <div class="w-8 h-8 rounded-full bg-jacquier-gold flex items-center justify-center text-jacquier-dark font-bold text-xs">
              AD
            </div>
          </div>
        </mat-toolbar>

        <div class="p-0">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .active-link {
      background-color: rgba(212, 175, 55, 0.1) !important;
      border-right: 4px solid #D4AF37;
    }
    .active-link mat-icon {
      color: #D4AF37 !important;
    }
    .active-link span {
      color: #D4AF37 !important;
      font-weight: bold;
    }
    .admin-nav .mat-mdc-list-item {
      height: 48px !important;
      margin: 4px 8px;
      border-radius: 8px;
    }
  `]
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  
  isHandset$ = of(false);

  currentRoute() {
    // Simple logic to get current page name from URL
    const url = window.location.pathname;
    const parts = url.split('/');
    const last = parts[parts.length - 1];
    return last.charAt(0).toUpperCase() + last.slice(1);
  }

  logout() {
    this.authService.logout();
  }
}
