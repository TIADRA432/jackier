import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings.service';
import { LogsService } from '../../../core/services/logs.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="p-6 space-y-6">
      <h2 class="text-3xl font-serif font-bold text-jacquier-gold">Paramètres du Système</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- General Settings -->
        <mat-card class="bg-[#1a1a1a] border border-gray-800 text-white">
          <mat-card-header>
            <mat-card-title class="text-jacquier-gold">Configuration Générale</mat-card-title>
          </mat-card-header>
          <mat-card-content class="pt-4">
            <form [formGroup]="settingsForm" (ngSubmit)="onSaveSettings()" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Nom du Restaurant</mat-label>
                  <input matInput formControlName="restaurantName">
                </mat-form-field>
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Email de Contact</mat-label>
                  <input matInput type="email" formControlName="email">
                </mat-form-field>
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Téléphone</mat-label>
                  <input matInput formControlName="phone">
                </mat-form-field>
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Devise</mat-label>
                  <input matInput formControlName="currency">
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Adresse</mat-label>
                <input matInput formControlName="address">
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Horaires d'Ouverture</mat-label>
                <textarea matInput formControlName="openingHours" rows="3"></textarea>
              </mat-form-field>

              <div class="flex justify-end">
                <button mat-raised-button color="primary" class="px-8 py-2" [disabled]="settingsForm.invalid">
                  Enregistrer les Modifications
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- System Logs -->
        <mat-card class="bg-[#1a1a1a] border border-gray-800 text-white flex flex-col">
          <mat-card-header class="flex justify-between items-center">
            <mat-card-title class="text-jacquier-gold">Journaux d'Activité</mat-card-title>
            <button mat-icon-button (click)="loadLogs()" class="text-gray-400">
              <mat-icon>refresh</mat-icon>
            </button>
          </mat-card-header>
          <mat-card-content class="pt-4 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
            <div class="space-y-3">
              @for (log of logs; track log.id) {
                <div class="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 text-sm">
                  <div class="flex justify-between items-start mb-1">
                    <span class="font-bold text-jacquier-gold uppercase text-[10px] tracking-wider">{{ log.action }}</span>
                    <span class="text-gray-500 text-[10px]">{{ log.timestamp | date:'short' }}</span>
                  </div>
                  <p class="text-gray-300">{{ log.details }}</p>
                  <div class="mt-1 text-[10px] text-gray-500">Utilisateur ID: {{ log.userId }}</div>
                </div>
              } @empty {
                <div class="text-center py-10 text-gray-500">Aucun log disponible</div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
  `]
})
export class AdminSettingsComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private logsService = inject(LogsService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  logs: any[] = [];
  settingsForm = this.fb.group({
    restaurantName: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    openingHours: ['', Validators.required],
    vat: [18, Validators.required],
    currency: ['GNF', Validators.required]
  });

  ngOnInit() {
    this.loadSettings();
    this.loadLogs();
  }

  loadSettings() {
    this.settingsService.getSettings().subscribe(data => {
      if (data) this.settingsForm.patchValue(data);
    });
  }

  loadLogs() {
    this.logsService.getLogs().subscribe(data => this.logs = data);
  }

  onSaveSettings() {
    if (this.settingsForm.valid) {
      this.settingsService.updateSettings(this.settingsForm.value as any).subscribe(() => {
        this.snackBar.open('Paramètres mis à jour avec succès', 'Fermer', { duration: 3000 });
        this.loadLogs();
      });
    }
  }
}
