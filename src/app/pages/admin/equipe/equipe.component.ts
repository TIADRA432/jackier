import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, AdminTeamMember } from '../../../core/services/admin-data.service';

type TeamDraft = { name: string; role: string; photoUrl: string; active: boolean };
const emptyDraft = (): TeamDraft => ({ name: '', role: '', photoUrl: '', active: true });

@Component({
  selector: 'app-admin-equipe', standalone: true, imports: [CommonModule, FormsModule], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 class="text-2xl font-serif font-bold text-white">Équipe</h1><p class="mt-1 text-sm text-gray-400">Annuaire interne minimal et protégé</p></div>
        <div class="flex gap-3"><button type="button" (click)="load()" [disabled]="loading()" class="rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold text-gray-200 hover:border-jacquier-gold hover:text-jacquier-gold disabled:opacity-60">Actualiser</button><button type="button" (click)="startCreate()" class="rounded-xl bg-jacquier-gold px-4 py-2 text-sm font-bold text-jacquier-dark hover:bg-white">Ajouter un membre</button></div>
      </div>
      <p class="rounded-xl border border-gray-800 bg-[#1a1a1a] px-4 py-3 text-sm text-gray-400">Seuls le nom, la fonction, une photo facultative et l’état actif sont gérés ici. Aucun e-mail, salaire, planning ou statut de présence n’est enregistré.</p>
      @if (errorMessage()) { <p class="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">{{ errorMessage() }}</p> }
      <section class="grid gap-5 sm:grid-cols-2">
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6"><p class="text-xs font-bold uppercase tracking-widest text-gray-500">Membres enregistrés</p><p class="mt-3 text-2xl font-serif font-bold text-white">{{ members().length }}</p></article>
        <article class="rounded-2xl border border-gray-800 bg-[#1a1a1a] p-6"><p class="text-xs font-bold uppercase tracking-widest text-gray-500">Membres actifs</p><p class="mt-3 text-2xl font-serif font-bold text-jacquier-gold">{{ activeCount() }}</p></article>
      </section>
      @if (showForm()) {
        <form (ngSubmit)="save()" class="grid gap-4 rounded-2xl border border-jacquier-gold/30 bg-[#1a1a1a] p-6 md:grid-cols-2">
          <h2 class="text-lg font-serif font-bold text-white md:col-span-2">{{ editingId() ? 'Modifier le membre' : 'Nouveau membre' }}</h2>
          <label class="text-sm text-gray-300">Nom<input [(ngModel)]="draft.name" name="name" maxlength="160" required class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
          <label class="text-sm text-gray-300">Fonction<input [(ngModel)]="draft.role" name="role" maxlength="120" required class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
          <label class="text-sm text-gray-300 md:col-span-2">URL de photo <span class="text-gray-500">(facultatif, HTTP(S))</span><input [(ngModel)]="draft.photoUrl" name="photoUrl" type="url" maxlength="2000" class="mt-2 w-full rounded-xl bg-gray-900 px-3 py-2 text-white outline-none ring-jacquier-gold focus:ring-1" /></label>
          <label class="flex items-center gap-3 text-sm text-gray-300"><input type="checkbox" [(ngModel)]="draft.active" name="active" class="h-4 w-4 accent-yellow-500" /> Membre actif</label>
          <div class="flex justify-end gap-3 md:col-span-2"><button type="button" (click)="cancelEdit()" class="rounded-xl border border-gray-700 px-4 py-2 text-sm text-gray-300">Annuler</button><button type="submit" [disabled]="saving()" class="rounded-xl bg-jacquier-gold px-4 py-2 text-sm font-bold text-jacquier-dark disabled:opacity-60">{{ saving() ? 'Enregistrement…' : 'Enregistrer' }}</button></div>
        </form>
      }
      <section class="overflow-x-auto rounded-2xl border border-gray-800 bg-[#1a1a1a]">
        @if (loading()) { <p class="p-12 text-center text-sm text-gray-400" role="status">Chargement de l’annuaire…</p> }
        @else if (!members().length) { <p class="p-12 text-center text-sm text-gray-400">Aucun membre n’est encore enregistré.</p> }
        @else { <table class="w-full min-w-[650px] text-left text-sm"><thead class="border-b border-gray-800 bg-[#121212] text-xs uppercase text-gray-500"><tr><th class="px-6 py-4">Membre</th><th class="px-6 py-4">Fonction</th><th class="px-6 py-4">État</th><th class="px-6 py-4 text-right"><span class="sr-only">Actions</span></th></tr></thead><tbody>
          @for (member of members(); track member.id) { <tr class="border-b border-gray-800/60"><td class="px-6 py-4"><div class="flex items-center gap-3">@if (member.photoUrl) { <img [src]="member.photoUrl" [alt]="'Photo de ' + member.name" class="h-10 w-10 rounded-full object-cover" /> } @else { <span class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-jacquier-gold" aria-hidden="true">{{ initials(member.name) }}</span> }<p class="font-bold text-white">{{ member.name }}</p></div></td><td class="px-6 py-4 text-gray-300">{{ member.role }}</td><td class="px-6 py-4"><span [class]="member.active ? 'rounded bg-green-500/10 px-2 py-1 text-xs font-bold text-green-300' : 'rounded bg-gray-500/10 px-2 py-1 text-xs font-bold text-gray-400'">{{ member.active ? 'Actif' : 'Inactif' }}</span></td><td class="px-6 py-4 text-right">@if (pendingDeleteId() === member.id) { <button type="button" (click)="delete(member)" [disabled]="saving()" class="mr-2 rounded-lg bg-red-900 px-3 py-2 text-xs font-bold text-white">Confirmer</button><button type="button" (click)="pendingDeleteId.set(null)" class="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300">Annuler</button> } @else { <button type="button" (click)="edit(member)" class="mr-2 rounded-lg border border-gray-700 px-3 py-2 text-xs font-bold text-gray-200">Modifier</button><button type="button" (click)="pendingDeleteId.set(member.id)" [attr.aria-label]="'Supprimer ' + member.name" class="rounded-lg border border-red-900/70 px-3 py-2 text-xs font-bold text-red-200">Supprimer</button> }</td></tr> }
        </tbody></table> }
      </section>
    </div>
  `,
  styles: [`.animate-fade-in { animation: fadeIn .6s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`]
})
export class AdminEquipeComponent {
  private readonly adminData = inject(AdminDataService);
  readonly members = signal<AdminTeamMember[]>([]);
  readonly loading = signal(true); readonly saving = signal(false); readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null); readonly pendingDeleteId = signal<string | null>(null); readonly errorMessage = signal('');
  readonly activeCount = computed(() => this.members().filter(member => member.active).length);
  draft = emptyDraft();
  constructor() { void this.load(); }
  async load(): Promise<void> { this.loading.set(true); this.errorMessage.set(''); try { this.members.set(await this.adminData.getTeamMembers()); } catch { this.errorMessage.set('Impossible de charger l’annuaire. Réessayez dans un instant.'); } finally { this.loading.set(false); } }
  startCreate(): void { this.draft = emptyDraft(); this.editingId.set(null); this.showForm.set(true); }
  edit(member: AdminTeamMember): void { this.draft = { name: member.name, role: member.role, photoUrl: member.photoUrl ?? '', active: member.active }; this.editingId.set(member.id); this.showForm.set(true); this.pendingDeleteId.set(null); }
  cancelEdit(): void { this.showForm.set(false); this.editingId.set(null); this.draft = emptyDraft(); }
  async save(): Promise<void> { if (!this.draft.name.trim() || !this.draft.role.trim()) return; this.saving.set(true); this.errorMessage.set(''); const payload = { ...this.draft, name: this.draft.name.trim(), role: this.draft.role.trim(), photoUrl: this.draft.photoUrl.trim() || null }; try { const id = this.editingId(); if (id) { const updated = await this.adminData.updateTeamMember(id, payload); this.members.update(members => members.map(member => member.id === id ? updated : member)); } else { const created = await this.adminData.createTeamMember(payload); this.members.update(members => [...members, created].sort((a, b) => a.name.localeCompare(b.name))); } this.cancelEdit(); } catch { this.errorMessage.set('Impossible d’enregistrer ce membre. Vérifiez les valeurs saisies.'); } finally { this.saving.set(false); } }
  async delete(member: AdminTeamMember): Promise<void> { this.saving.set(true); this.errorMessage.set(''); try { await this.adminData.deleteTeamMember(member.id); this.members.update(members => members.filter(candidate => candidate.id !== member.id)); this.pendingDeleteId.set(null); } catch { this.errorMessage.set('Impossible de supprimer ce membre. Réessayez dans un instant.'); } finally { this.saving.set(false); } }
  initials(name: string): string { return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase(); }
}
