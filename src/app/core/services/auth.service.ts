import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Router } from '@angular/router';
import { supabaseClient } from '../../../config/supabase.client';

export type UserRole = 'USER' | 'ADMIN' | 'MANAGER' | 'FINANCE' | 'RECEPTION' | 'CHEF' | 'EDITOR';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.restoreSession();
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void this.syncUser(session.user.id, session.user.email || '', session.access_token);
      } else {
        this.clearLocalUser();
      }
    });
  }

  private async restoreSession() {
    const { data } = await supabaseClient.auth.getSession();
    if (data.session?.user) {
      await this.syncUser(data.session.user.id, data.session.user.email || '', data.session.access_token);
    }
  }

  private async syncUser(id: string, email: string, token: string) {
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', id)
      .maybeSingle();

    const role = this.normalizeRole(profile?.role);
    const user: User = { id, email, role };
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }

  private normalizeRole(role: unknown): UserRole {
    const normalized = typeof role === 'string' ? role.toUpperCase() : 'USER';
    const allowed: UserRole[] = ['USER', 'ADMIN', 'MANAGER', 'FINANCE', 'RECEPTION', 'CHEF', 'EDITOR'];
    return allowed.includes(normalized as UserRole) ? normalized as UserRole : 'USER';
  }

  login(email: string, password: string): Observable<any> {
    return from(supabaseClient.auth.signInWithPassword({ email, password }));
  }

  currentUser(): User | null { return this.currentUserSubject.value; }
  get user$(): Observable<User | null> { return this.currentUser$; }

  logout() {
    void supabaseClient.auth.signOut().finally(() => {
      this.clearLocalUser();
      this.router.navigate(['/login']);
    });
  }

  isAuthenticated(): boolean { return !!this.currentUserSubject.value; }
  hasRole(roles: UserRole[]): boolean {
    const user = this.currentUserSubject.value;
    return !!user && roles.includes(user.role);
  }
  getToken(): string | null { return localStorage.getItem('token'); }

  private clearLocalUser() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}
