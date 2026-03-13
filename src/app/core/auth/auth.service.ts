
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<any | null>(null);

  login(username: string, password?: string) {
    // Mock implementation
    this.currentUser.set({ name: 'User', role: 'admin' });
    return true;
  }

  logout() {
    this.currentUser.set(null);
  }

  isAuthenticated() {
    return this.currentUser() !== null;
  }

  hasRole(role: string | string[]) {
    const userRole = this.currentUser()?.role;
    if (!userRole) return false;
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    return userRole === role;
  }

  getToken() {
    return 'mock-token';
  }
}
