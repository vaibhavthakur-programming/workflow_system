import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthService } from '../../core/services/auth';
import { AuthActions } from '../../core/store/auth/auth.actions';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);
  private store = inject(Store);
  private router = inject(Router);
  themeService = inject(ThemeService);

  user = this.authService.getCurrentUser();

  logout(): void {
    this.store.dispatch(AuthActions.logout({}));
  }
}
