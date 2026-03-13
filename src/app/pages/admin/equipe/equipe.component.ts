import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-equipe',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-serif font-bold text-jacquier-gold">Gestion de l'Équipe</h2>
        <button mat-raised-button color="primary">
          <mat-icon class="mr-2">person_add</mat-icon> Ajouter un Membre
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @for (member of team; track member.id) {
          <mat-card class="bg-[#1a1a1a] border border-gray-800 text-white overflow-hidden group">
            <div class="h-48 bg-gray-800 relative overflow-hidden">
              <img [src]="member.photo" [alt]="member.name" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
              <div class="absolute bottom-4 left-4">
                <h3 class="text-lg font-bold text-white">{{ member.name }}</h3>
                <p class="text-jacquier-gold text-xs uppercase tracking-widest">{{ member.role }}</p>
              </div>
            </div>
            <mat-card-content class="p-4 space-y-4">
              <div class="flex items-center gap-3 text-sm text-gray-400">
                <mat-icon class="text-xs h-4 w-4">email</mat-icon>
                <span>{{ member.email }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-400">
                <mat-icon class="text-xs h-4 w-4">phone</mat-icon>
                <span>{{ member.phone }}</span>
              </div>
              <div class="pt-4 border-t border-gray-800 flex justify-between items-center">
                <span class="text-[10px] uppercase font-bold text-gray-500">Statut: <span class="text-green-500">Actif</span></span>
                <div class="flex gap-1">
                  <button mat-icon-button class="text-gray-500 hover:text-jacquier-gold"><mat-icon>edit</mat-icon></button>
                  <button mat-icon-button class="text-gray-500 hover:text-red-500"><mat-icon>delete</mat-icon></button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `
})
export class AdminEquipeComponent implements OnInit {
  team = [
    { id: 1, name: 'Amadou Diallo', role: 'Chef de Cuisine', email: 'amadou@lejacquier.com', phone: '+224 621 00 00 01', photo: 'https://picsum.photos/seed/chef/400/300' },
    { id: 2, name: 'Mariama Camara', role: 'Maître d\'Hôtel', email: 'mariama@lejacquier.com', phone: '+224 621 00 00 02', photo: 'https://picsum.photos/seed/manager/400/300' },
    { id: 3, name: 'Ibrahima Sory', role: 'Sommelier', email: 'ibrahima@lejacquier.com', phone: '+224 621 00 00 03', photo: 'https://picsum.photos/seed/wine/400/300' },
    { id: 4, name: 'Fatoumata Sylla', role: 'Chef Pâtissière', email: 'fatou@lejacquier.com', phone: '+224 621 00 00 04', photo: 'https://picsum.photos/seed/pastry/400/300' },
    { id: 5, name: 'Ousmane Bangoura', role: 'Directeur Financier', email: 'ousmane@lejacquier.com', phone: '+224 621 00 00 05', photo: 'https://picsum.photos/seed/finance/400/300' },
    { id: 6, name: 'Aissatou Barry', role: 'Réceptionniste', email: 'aissatou@lejacquier.com', phone: '+224 621 00 00 06', photo: 'https://picsum.photos/seed/reception/400/300' },
  ];

  ngOnInit() {}
}
