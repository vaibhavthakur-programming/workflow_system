import { Injectable, signal, computed } from '@angular/core';

const THEME_KEY = 'workflow_theme';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly _isDark = signal(this.loadInitialTheme());

  isDark = this._isDark.asReadonly();
  isLight = computed(() => !this._isDark());

  constructor() {
    this.applyTheme(this._isDark());
  }

  private loadInitialTheme(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return false;
  }

  private applyTheme(dark: boolean): void {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  toggleTheme(): void {
    this._isDark.update((v) => !v);
    const dark = this._isDark();
    this.applyTheme(dark);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    }
  }

  setTheme(mode: ThemeMode): void {
    const dark = mode === 'dark';
    this._isDark.set(dark);
    this.applyTheme(dark);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_KEY, mode);
    }
  }
}
