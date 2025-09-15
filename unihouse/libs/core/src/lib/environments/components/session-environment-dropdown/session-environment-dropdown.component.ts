import { Component, inject } from '@angular/core';
import { TuiTextfield } from '@taiga-ui/core';
import { ExtEnvironmentService } from '../../ext-environment.service';

@Component({
  selector: 'app-session-environment-dropdown',
  standalone: true,
  imports: [
    TuiTextfield,

  ],
  templateUrl: './session-environment-dropdown.component.html',
  styleUrl: './session-environment-dropdown.component.scss'
})
export class SessionEnvironmentDropdownComponent {
  private readonly envService = inject(ExtEnvironmentService);
}
