import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-restaurant',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="p-6 space-y-6">
      <h2 class="text-3xl font-serif font-bold text-jacquier-gold">Gestion de la Salle</h2>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        @for (table of tables; track table.id) {
          <div 
            class="aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all cursor-pointer group"
            [ngClass]="table.status === 'occupied' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-green-500/10 border-green-500 text-green-500'"
            (click)="toggleTable(table)"
          >
            <mat-icon class="text-4xl h-auto w-auto mb-2 group-hover:scale-110 transition-transform">
              {{ table.status === 'occupied' ? 'person' : 'table_bar' }}
            </mat-icon>
            <span class="font-bold text-lg">Table {{ table.id }}</span>
            <span class="text-[10px] uppercase font-bold tracking-widest opacity-70">{{ table.capacity }} pers.</span>
            <span class="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-current text-white">
              {{ table.status === 'occupied' ? 'Occupée' : 'Libre' }}
            </span>
          </div>
        }
      </div>

      <div class="mt-10 p-6 bg-[#1a1a1a] border border-gray-800 rounded-2xl">
        <h3 class="text-xl font-serif text-jacquier-gold mb-4">Légende & Actions</h3>
        <div class="flex flex-wrap gap-6">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-green-500"></div>
            <span class="text-sm text-gray-400">Table Libre</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-red-500"></div>
            <span class="text-sm text-gray-400">Table Occupée</span>
          </div>
          <button mat-stroked-button color="primary" class="ml-auto">
            <mat-icon>add</mat-icon> Ajouter une Table
          </button>
        </div>
      </div>
    </div>
  `
})
export class AdminRestaurantComponent implements OnInit {
  tables = [
    { id: 1, capacity: 2, status: 'free' },
    { id: 2, capacity: 2, status: 'occupied' },
    { id: 3, capacity: 4, status: 'free' },
    { id: 4, capacity: 4, status: 'free' },
    { id: 5, capacity: 6, status: 'occupied' },
    { id: 6, capacity: 2, status: 'free' },
    { id: 7, capacity: 4, status: 'free' },
    { id: 8, capacity: 8, status: 'free' },
    { id: 9, capacity: 2, status: 'free' },
    { id: 10, capacity: 4, status: 'occupied' },
    { id: 11, capacity: 4, status: 'free' },
    { id: 12, capacity: 2, status: 'free' },
  ];

  ngOnInit() {}

  toggleTable(table: any) {
    table.status = table.status === 'free' ? 'occupied' : 'free';
  }
}
