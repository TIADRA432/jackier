import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-admin-stock',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatProgressBarModule],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-serif font-bold text-jacquier-gold">Stock & Inventaire</h2>
        <button mat-raised-button color="primary">
          <mat-icon class="mr-2">add</mat-icon> Ajouter un Article
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (item of inventory; track item.id) {
          <mat-card class="bg-[#1a1a1a] border border-gray-800 text-white">
            <mat-card-header class="flex justify-between items-start">
              <div>
                <mat-card-title class="text-lg font-bold">{{ item.name }}</mat-card-title>
                <mat-card-subtitle class="text-gray-500 uppercase text-[10px]">{{ item.category }}</mat-card-subtitle>
              </div>
              <div class="text-right">
                <span class="text-2xl font-bold" [ngClass]="item.quantity < item.minQuantity ? 'text-red-500' : 'text-jacquier-gold'">
                  {{ item.quantity }}
                </span>
                <span class="text-xs text-gray-500 ml-1">{{ item.unit }}</span>
              </div>
            </mat-card-header>
            <mat-card-content class="pt-4">
              <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                <span class="text-gray-500">Niveau de Stock</span>
                <span [ngClass]="item.quantity < item.minQuantity ? 'text-red-500' : 'text-gray-400'">
                  {{ item.quantity < item.minQuantity ? 'CRITIQUE' : 'NORMAL' }}
                </span>
              </div>
              <mat-progress-bar 
                mode="determinate" 
                [value]="(item.quantity / item.maxQuantity) * 100"
                [color]="item.quantity < item.minQuantity ? 'warn' : 'primary'"
                class="h-2 rounded-full"
              ></mat-progress-bar>
              <div class="mt-4 flex justify-between items-center">
                <span class="text-xs text-gray-500">Dernière mise à jour: {{ item.lastUpdated | date:'short' }}</span>
                <div class="flex gap-1">
                  <button mat-icon-button class="text-gray-400 hover:text-white"><mat-icon>remove</mat-icon></button>
                  <button mat-icon-button class="text-gray-400 hover:text-white"><mat-icon>add</mat-icon></button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .mat-mdc-progress-bar { --mdc-linear-progress-track-color: #333; }
  `]
})
export class StockComponent implements OnInit {
  inventory = [
    { id: 1, name: 'Farine de Blé', category: 'Ingrédients', quantity: 45, minQuantity: 20, maxQuantity: 100, unit: 'kg', lastUpdated: new Date() },
    { id: 2, name: 'Huile d\'Olive', category: 'Ingrédients', quantity: 12, minQuantity: 15, maxQuantity: 50, unit: 'L', lastUpdated: new Date() },
    { id: 3, name: 'Sucre', category: 'Ingrédients', quantity: 30, minQuantity: 10, maxQuantity: 60, unit: 'kg', lastUpdated: new Date() },
    { id: 4, name: 'Vin Rouge (Bordeaux)', category: 'Cave', quantity: 24, minQuantity: 12, maxQuantity: 48, unit: 'btl', lastUpdated: new Date() },
    { id: 5, name: 'Café en Grains', category: 'Boissons', quantity: 5, minQuantity: 10, maxQuantity: 20, unit: 'kg', lastUpdated: new Date() },
    { id: 6, name: 'Serviettes en Tissu', category: 'Linge', quantity: 200, minQuantity: 50, maxQuantity: 300, unit: 'pcs', lastUpdated: new Date() },
  ];

  ngOnInit() {}
}
