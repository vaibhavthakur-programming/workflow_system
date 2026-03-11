import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { MockApiService } from './mock-api';

const AUTH_KEY = 'workflow_auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(
    private mockApi: MockApiService,
    private router: Router
  ) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
      } catch {
        this.currentUser = null;
      }
    }
  }

  login(email: string, password: string): Observable<User | null> {
    return this.mockApi.login(email, password).pipe(
      tap((user) => {
        if (user) {
          this.currentUser = user;
          localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        } else {
          this.currentUser = null;
        }
      })
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(AUTH_KEY);
    this.router.navigate(['/auth'], { replaceUrl: true });
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return !!this.currentUser && roles.includes(this.currentUser.role);
  }
}
