import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { UserService } from '../core/user/user.service';
import { UserStatus } from '../core/user/user.utils';
import { InitialsAvatar } from '@unihouse/core'

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    TuiButton,
    TuiLoader,
    InitialsAvatar
    
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
        console.log(`navbar update to status ${status}`)
        if (status === 'authenticated') {
          console.log(this.user_service.starrez_api_credentials)
          this.user_name = this.user_service.starrez_api_credentials?.full_name ?? 'Ttest Name'
        } 
        this.user_status = status;
        this.loading_user = status === 'pending';
        
      }, error: (err) => {
        console.error(err)
      }
    })
  }



}
