import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SchoolService } from '../../../core/services/school.service';
import { SchoolProgramDto } from '../../../core/dto/school.dto';

@Component({
  selector: 'app-admin-school',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule
  ],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-serif font-bold text-jacquier-gold">École de Gastronomie</h2>
        <button mat-raised-button color="primary" (click)="toggleForm()" class="px-6 py-2">
          <mat-icon class="mr-2">{{ showForm ? 'close' : 'add' }}</mat-icon>
          {{ showForm ? 'Annuler' : 'Nouveau Programme' }}
        </button>
      </div>

      <!-- Add/Edit Form -->
      @if (showForm) {
        <mat-card class="bg-[#1a1a1a] border border-gray-800 text-white">
          <mat-card-header>
            <mat-card-title class="text-jacquier-gold">Détails du Programme</mat-card-title>
          </mat-card-header>
          <mat-card-content class="pt-4">
            <form [formGroup]="programForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Titre du Programme</mat-label>
                <input matInput formControlName="title">
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Durée (ex: 3 mois)</mat-label>
                <input matInput formControlName="duration">
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Prix (GNF)</mat-label>
                <input matInput type="number" formControlName="price">
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Date de Début</mat-label>
                <input matInput type="date" formControlName="startDate">
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full md:col-span-2">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="3"></textarea>
              </mat-form-field>

              <div class="md:col-span-2 flex justify-end gap-3">
                <button type="button" mat-button (click)="toggleForm()">Annuler</button>
                <button type="submit" mat-raised-button color="primary" [disabled]="programForm.invalid">
                  {{ editingId ? 'Mettre à jour' : 'Créer le Programme' }}
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }

      <!-- Programs List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (program of programs; track program.id) {
          <mat-card class="bg-[#1a1a1a] border border-gray-800 text-white hover:border-jacquier-gold transition-all group">
            <mat-card-header class="border-b border-gray-800 pb-4">
              <mat-card-title class="text-xl font-serif text-jacquier-gold">{{ program.title }}</mat-card-title>
              <mat-card-subtitle class="text-gray-400">{{ program.duration }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="py-4 space-y-3">
              <p class="text-sm text-gray-300 line-clamp-3">{{ program.description }}</p>
              <div class="flex justify-between items-center text-sm">
                <span class="text-jacquier-gold font-bold">{{ program.price | number }} GNF</span>
                <span class="text-gray-500">Début: {{ program.startDate | date }}</span>
              </div>
            </mat-card-content>
            <mat-card-actions align="end" class="border-t border-gray-800 pt-2">
              <button mat-icon-button color="accent" (click)="editProgram(program)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteProgram(program.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
  `]
})
export class AdminSchoolComponent implements OnInit {
  private schoolService = inject(SchoolService);
  private fb = inject(FormBuilder);

  programs: SchoolProgramDto[] = [];
  showForm = false;
  editingId: string | null = null;

  programForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    duration: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    startDate: ['', Validators.required],
    active: [true]
  });

  ngOnInit() {
    this.loadPrograms();
  }

  loadPrograms() {
    this.schoolService.getPrograms().subscribe(data => this.programs = data);
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editingId = null;
      this.programForm.reset({ active: true, price: 0 });
    }
  }

  editProgram(program: SchoolProgramDto) {
    this.editingId = program.id || null;
    this.programForm.patchValue(program as any);
    this.showForm = true;
  }

  async onSubmit() {
    if (this.programForm.valid) {
      const data = this.programForm.value as SchoolProgramDto;
      try {
        if (this.editingId) {
          await this.schoolService.updateProgram(this.editingId, data);
        } else {
          await this.schoolService.addProgram(data);
        }
        this.loadPrograms();
        this.toggleForm();
      } catch (error) {
        console.error('Error saving program', error);
      }
    }
  }

  async deleteProgram(id: string | undefined) {
    if (!id) return;
    if (confirm('Supprimer ce programme ?')) {
      try {
        await this.schoolService.deleteProgram(id);
        this.loadPrograms();
      } catch (error) {
        console.error('Error deleting program', error);
      }
    }
  }
}
