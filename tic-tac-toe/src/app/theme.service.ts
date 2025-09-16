import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _theme = signal<ThemeMode>(this.detectInitial());
  readonly theme = this._theme.asReadonly();

  constructor() {
    this.apply();
  }

  private detectInitial(): ThemeMode {
    try {
      const stored = localStorage.getItem('ttt-theme');
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  setTheme(mode: ThemeMode) {
    this._theme.set(mode);
    this.persist();
    this.apply();
  }

  toggle() {
    this.setTheme(this._theme() === 'dark' ? 'light' : 'dark');
  }

  private persist() {
    try { localStorage.setItem('ttt-theme', this._theme()); } catch {}
  }

  private apply() {
    const html = document.documentElement;
    html.setAttribute('data-theme', this._theme());
  }
}
