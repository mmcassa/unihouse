import { Component, inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

import { TuiAppearance, TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [TuiButton,TuiAppearance],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.scss'
})
export class LogoutButtonComponent {

  private readonly authService = inject(MsalService);

  // Log the user out
  logout() {
    this.authService.logoutRedirect();
  }
}
