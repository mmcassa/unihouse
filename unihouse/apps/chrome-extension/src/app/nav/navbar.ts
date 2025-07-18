import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiAppearance, TuiButton, TuiDropdown, TuiLink, TuiLoader, TuiTitle } from '@taiga-ui/core';
import { UserService } from '../core/user/user.service';
import { UserStatus } from '../core/user/user.utils';
import { InitialsAvatar, ThemeToggleButtonComponent } from '@unihouse/core'
import { StarrezTrackerIcon } from '../core/starrez/starrez-tracker-icon/starrez-tracker-icon';
import { TuiPlatform } from '@taiga-ui/cdk/directives/platform';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    TuiButton,
    TuiLoader,
    InitialsAvatar,
    StarrezTrackerIcon,
    ThemeToggleButtonComponent,
    TuiAppearance,
    TuiBadge,
    TuiButton,
    TuiCardLarge,
    TuiLink,
    TuiPlatform,
    TuiTitle,
    TuiDropdown,
    TuiHeader
    
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  protected user_service = inject(UserService);
  protected user_status: UserStatus;
  protected user_name: string = '';
  protected loading_user: boolean = false;

  constructor() {
    this.user_status = this.user_service.status;
    this.update_user_status();
  }

  protected async fetch_credentials() {

    await this.user_service.load_credentials_from_sr_web();
  }

  protected update_user_status() {
    this.user_service.statusAsObservable.subscribe({
      next: (status) => {
        if (status === 'authenticated') {
          this.user_name = this.user_service.starrez_api_credentials?.full_name ?? '?test ?'
        } 
        this.user_status = status;
        this.loading_user = status === 'pending';
        
      }, error: (err) => {
        console.error(err)
      }
    })
  }



}
