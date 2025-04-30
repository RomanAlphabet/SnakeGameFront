import {inject, Injectable, signal} from '@angular/core';
import {DOCUMENT} from '@angular/common';

export type Theme = 'dark' | 'light'

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly document = inject(DOCUMENT);
  private usedTheme = signal<Theme>("dark");
  constructor() { }
  toggleTheme() {
      if(this.usedTheme() === "dark") {
        this.document.documentElement.classList.add('light-mode');
        this.usedTheme = signal('light');
      }
      else {
        this.document.documentElement.classList.remove('light-mode');
        this.usedTheme = signal('dark');
      }
  }
}
