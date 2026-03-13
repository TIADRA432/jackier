import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { CateringService } from '../../../core/services/catering.service';
import { CateringOrderDto } from '../../../core/dto/catering.dto';

@Component({
  selector: 'app-admin-traiteur',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule],
  template: `
    <div class="p-6 space-y-6">
      <h2 class="text-3xl font-serif font-bold text-jacquier-gold">Demandes Traiteur</h2>

      <div class="grid grid-cols-1 gap-6">
        @for (event of events; track event.id) {
          <mat-card class="bg-[#1a1a1a] border border-gray-800 text-white overflow-hidden">
            <div class="flex flex-col md:flex-row">
              <div class="p-6 flex-1">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-xl font-bold text-jacquier-gold">{{ event.eventName }}</h3>
                    <p class="text-gray-400 text-sm">{{ event.clientName }} • {{ event.email }} • {{ event.phone }}</p>
                  </div>
                  <mat-chip-set>
                    <mat-chip [ngClass]="getStatusClass(event.status)">
                      {{ event.status | uppercase }}
                    </mat-chip>
                  </mat-chip-set>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
                  <div class="flex flex-col">
                    <span class="text-gray-500 uppercase text-[10px] font-bold">Date de l'événement</span>
                    <span class="text-white">{{ event.date | date:'longDate' }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-gray-500 uppercase text-[10px] font-bold">Nombre d'invités</span>
                    <span class="text-white">{{ event.guests }} personnes</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-gray-500 uppercase text-[10px] font-bold">Budget estimé</span>
                    <span class="text-white">{{ event.budget ? (event.budget | number) + ' GNF' : 'Non spécifié' }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-gray-500 uppercase text-[10px] font-bold">Reçu le</span>
                    <span class="text-white">{{ event.createdAt | date:'short' }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-gray-800/50 p-6 flex flex-row md:flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-gray-700">
                <button mat-raised-button color="primary" class="w-full" (click)="updateStatus(event.id, 'approved')" [disabled]="event.status === 'approved'">
                  Approuver
                </button>
                <button mat-raised-button color="warn" class="w-full" (click)="updateStatus(event.id, 'rejected')" [disabled]="event.status === 'rejected'">
                  Rejeter
                </button>
                <button mat-button color="accent" class="w-full" (click)="deleteEvent(event.id)">
                  Supprimer
                </button>
              </div>
            </div>
          </mat-card>
        } @empty {
          <div class="text-center py-20 bg-[#1a1a1a] rounded-2xl border border-dashed border-gray-800">
            <mat-icon class="text-gray-600 text-6xl h-auto w-auto mb-4">event_busy</mat-icon>
            <p class="text-gray-500">Aucune demande traiteur pour le moment</p>
          </div>
        }
      </div>
    </div>
  `
})
export class AdminTraiteurComponent implements OnInit {
  private cateringService = inject(CateringService);
  events: CateringOrderDto[] = [];

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.cateringService.getEvents().subscribe(data => {
      this.events = data.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
    });
  }

  async updateStatus(id: string | undefined, status: any) {
    if (!id) return;
    try {
      await this.cateringService.updateEvent(id, { status });
      this.loadEvents();
    } catch (error) {
      console.error('Error updating status', error);
    }
  }

  async deleteEvent(id: string | undefined) {
    if (!id) return;
    if (confirm('Supprimer cette demande ?')) {
      try {
        await this.cateringService.deleteEvent(id);
        this.loadEvents();
      } catch (error) {
        console.error('Error deleting event', error);
      }
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'approved': return 'bg-green-500 text-white';
      case 'rejected': return 'bg-red-500 text-white';
      default: return 'bg-orange-500 text-white';
    }
  }
}
