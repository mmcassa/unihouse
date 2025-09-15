import { Component, inject, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { environment } from '../../../../environments/environment';
import { TuiAppearance, TuiAutoColorPipe, TuiButton, TuiDataList, TuiDialogService, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar, TuiBadge, TuiBadgeNotification } from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';
import { filter } from 'rxjs';
import { UserControlsDialogComponent } from '../user-controls-dialog/user-controls-dialog.component';
import { RouterModule } from '@angular/router';
import { EnvironmentCollectionDropdownComponent } from '@unihouse/core';
import { LoginButtonComponent } from '../../auth';

@Component({
  selector: 'rt-nav-header',
  standalone: true,
  imports: [
    RouterModule,
    TuiAvatar,
    TuiDataList,
    TuiDropdown,
    TuiNavigation,
    TuiAutoColorPipe,
    TuiAppearance,
    TuiIcon,
    TuiButton,
    TuiBadgeNotification,
    TuiBadge,
    LoginButtonComponent,
    UserControlsDialogComponent, 
    EnvironmentCollectionDropdownComponent
        ],
  templateUrl: './nav-header.component.html',
  styleUrl: './nav-header.component.scss'
})
export class NavHeaderComponent implements OnInit {
  private readonly dialogs = inject(TuiDialogService);
  private readonly authService = inject(MsalService);
  private readonly authBroadcastService = inject(MsalBroadcastService);

  // Title of the site
  protected siteTitle = environment.title;
  protected version = environment.version;

  // Defines if site is in dev mode or not
  protected isDev: boolean = true;

  // Authentication status
  protected is_authenticated: boolean = false;
  protected initials: string = "";

  // List of existing StarRez environments 
  activeEnvironment: string = 'Production';
  environmentsList: any[] = [
];

  // User has existing notifications
  protected hasNotifications: boolean = false;

  
  constructor() { }

  private getInitials(name: string): string {
    let all_initials = name.split(" ").map(x => x[0]);
    let used_initials = all_initials.length > 2 ? all_initials.splice(1,all_initials.length-2 ) : all_initials
    return used_initials.join("");
  }

  ngOnInit(): void {
    this.authBroadcastService.msalSubject$.pipe(
        filter((msg: EventMessage) => 
          msg.eventType === EventType.LOGOUT_SUCCESS 
          || msg.eventType === EventType.LOGIN_SUCCESS
          || msg.eventType === EventType.INITIALIZE_END
          || msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
      )
      ).subscribe({
          next: msg => {
        this.is_authenticated = this.authService.instance.getAllAccounts().length > 0;
        if (this.is_authenticated) {
          let account = this.authService.instance.getActiveAccount();
          if (account !== undefined) {
            account = this.authService.instance.getAllAccounts()[0];
          }
          this.initials = this.getInitials(account != undefined ? (account.name || "") : "");
        }
      }})
  }

  protected openUserControls() {
    if (this.is_authenticated) {
      this.dialogs.open(UserControlsDialogComponent,)
    }
  }


}
