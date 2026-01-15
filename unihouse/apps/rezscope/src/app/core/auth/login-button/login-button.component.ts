import { Component, inject } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';

import { TuiAppearance, TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-login-button',
  standalone: true,
  imports: [TuiButton,TuiAppearance],
  templateUrl: './login-button.component.html',
  styleUrl: './login-button.component.scss'
})
export class LoginButtonComponent {
  private readonly authService = inject(MsalService);
  protected readonly msalGuardConfig: MsalGuardConfiguration = inject<MsalGuardConfiguration>(MSAL_GUARD_CONFIG);

  // Log the user in and redirect them if MSAL provides a redirect URI otherwise go to the default URI
  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect(
        { ...this.msalGuardConfig.authRequest } as RedirectRequest
      );
    } else {
      this.authService.loginRedirect();
    }
  }
}
