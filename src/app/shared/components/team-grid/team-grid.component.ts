
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TeamMember } from '../../../core/models';

@Component({
  selector: 'app-team-grid',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      @for (member of members(); track member.id) {
        <div class="bg-white rounded-3xl overflow-hidden shadow-lg group hover:-translate-y-2 transition-all duration-500 border border-gray-100">
          <div class="relative h-80 overflow-hidden bg-jacquier-cream">
            @if (member.image) {
              <img [src]="member.image" class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000" [alt]="member.name" referrerPolicy="no-referrer">
            } @else {
              <div class="flex h-full w-full items-center justify-center text-6xl font-serif font-bold text-jacquier-gold/60" aria-hidden="true">{{ initials(member.name) }}</div>
            }
            @if (member.bio) {
              <div class="absolute inset-0 bg-gradient-to-t from-jacquier-dark/90 via-jacquier-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <p class="text-white text-center text-sm font-light leading-relaxed italic transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">"{{ member.bio }}"</p>
              </div>
            }
          </div>
          <div class="p-8 text-center bg-white relative">
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-jacquier-cream rounded-full border-4 border-white flex items-center justify-center text-jacquier-gold shadow-sm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h3 class="font-serif font-bold text-2xl text-jacquier-dark mb-2 mt-2">{{ member.name }}</h3>
            <p class="text-jacquier-gold text-xs font-bold uppercase tracking-widest">{{ member.role }}</p>
            @if (member.department) { <p class="mt-2 text-[11px] uppercase tracking-wider text-gray-400">{{ departmentLabel(member.department) }}</p> }
          </div>
        </div>
      }
    </div>
  `
})
export class TeamGridComponent {
  members = input.required<TeamMember[]>();

  initials(name: string): string {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }

  departmentLabel(value: string): string {
    const labels: Record<string, string> = {
      direction: 'Direction', cuisine: 'Cuisine', salle: 'Salle',
      administration: 'Administration', traiteur: 'Traiteur', ecole: 'École gastronomique'
    };
    return labels[value] ?? value;
  }
}
