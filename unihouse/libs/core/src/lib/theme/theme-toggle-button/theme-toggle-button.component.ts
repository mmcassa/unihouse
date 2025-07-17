import { Component, inject } from '@angular/core';
import { ThemeService } from '../theme.service';
import { TuiButton, TuiHintDirective } from '@taiga-ui/core';

@Component({
  selector: 'app-theme-toggle-button',
  standalone: true,
  imports: [TuiButton,TuiHintDirective],
  templateUrl: './theme-toggle-button.component.html',
  styleUrl: './theme-toggle-button.component.scss'
})
export class ThemeToggleButtonComponent {

  // Imports the active theme status
  protected readonly themeService = inject(ThemeService);
  protected theme!: string;
  protected isDarkMode!: boolean;

  constructor() {
    this.themeService.theme.subscribe({
      next: theme => {
        this.theme = theme;
        this.isDarkMode = theme === 'dark';
      }
    })
  }
}
