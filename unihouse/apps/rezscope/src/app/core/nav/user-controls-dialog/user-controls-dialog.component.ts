import { Component } from '@angular/core';
import { ThemeToggleButtonComponent } from '@unihouse/core';
import { environment } from '../../../../environments/environment'; 
import { TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { LogoutButtonComponent } from '../../auth';

@Component({
  selector: 'app-user-controls-dialog',
  standalone: true,
  imports: [
    LogoutButtonComponent,
    ThemeToggleButtonComponent,
    TuiCardLarge,
    TuiHeader,
    TuiTitle,
  ],
  templateUrl: './user-controls-dialog.component.html',
  styleUrl: './user-controls-dialog.component.scss'
})
export class UserControlsDialogComponent {
    protected version = environment.version;

}