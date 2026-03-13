import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Sync with Firebase user state
    user(this.auth).pipe(
      switchMap(fbUser => {
        if (fbUser) {
          fbUser.getIdToken().then(token => localStorage.setItem('token', token));
          return from(this.getUserProfile(fbUser.uid)).pipe(
            map(profile => ({
              id: fbUser.uid,
              email: fbUser.email || '',
              role: profile?.role || 'USER'
            } as User))
          );
        }
        return of(null);
      })
    ).subscribe(user => {
      this.currentUserSubject.next(user);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    });

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  private async getUserProfile(uid: string) {
    const userDoc = await getDoc(doc(this.firestore, 'users', uid));
    return userDoc.exists() ? userDoc.data() : null;
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get user$(): Observable<User | null> {
    return this.currentUser$;
  }

  logout() {
    from(signOut(this.auth)).subscribe(() => {
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    });
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUserSubject.value;
    return user ? roles.includes(user.role) : false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
