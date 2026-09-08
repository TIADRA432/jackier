import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService, SchoolProgram } from '../../../core/services/admin-data.service';

@Component({
  selector: 'app-admin-school', standalone: true, imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 class="text-2xl font-serif font-bold text-white">École Gastronomique</h1><p class="mt-1 text-sm text-gray-400">Programmes de formation publiés.</p></div>
        <button type="button" (click)="load()" [disabled]="loading()" class="self-start rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-50">{{ loading() ? 'Actualisation…' : 'Actualiser' }}</button>
      </header>
      @if (errorMessage()) { <div role="alert" class="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">{{ errorMessage() }} <button type="button" (click)="load()" class="ml-2 font-bold underline">Réessayer</button></div> }
      @if (loading()) { <div class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-gray-400" role="status">Chargement des programmes…</div> }
      @else if (!programs().length) { <div class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-12 text-center text-gray-400">Aucun programme publié pour le moment.</div> }
      @else { <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">@for (program of programs(); track program.id) { <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6"><p class="text-[10px] font-bold uppercase tracking-widest text-jacquier-gold">{{ program.level || 'Niveau à préciser' }}</p><h2 class="mt-3 text-xl font-serif font-bold text-white">{{ program.title || 'Programme sans titre' }}</h2><p class="mt-3 text-sm leading-6 text-gray-400">{{ program.description || 'Aucune description disponible.' }}</p><div class="mt-6 border-t border-gray-800 pt-4 text-sm text-gray-300"><span class="font-bold text-gray-500">Durée :</span> {{ program.duration || 'À préciser' }}</div></article> }</section> }
      <p class="text-xs text-gray-500">La gestion des étudiants n’est pas encore modélisée dans l’API ; cette page n’affiche donc que les programmes réellement disponibles.</p>
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn .6s ease-out forwards; } @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`]
})
export class AdminSchoolComponent {
  private readonly adminData = inject(AdminDataService);
  readonly programs = signal<SchoolProgram[]>([]); readonly loading = signal(true); readonly errorMessage = signal('');
  constructor() { void this.load(); }
  async load(): Promise<void> { this.loading.set(true); this.errorMessage.set(''); try { this.programs.set(await this.adminData.getSchoolPrograms()); } catch { this.errorMessage.set('Impossible de charger les programmes. Vérifiez votre session administrateur puis réessayez.'); } finally { this.loading.set(false); } }
}
