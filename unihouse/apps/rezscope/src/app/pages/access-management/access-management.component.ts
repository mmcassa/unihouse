import { Component } from '@angular/core';
import { UsersListComponent } from './tabs/users-list/users-list.component';
import { PositionsListComponent } from './tabs/positions-list/positions-list.component';
import { RouterOutlet } from '@angular/router';
import { SecUserHistoryPageComponent } from './tabs/sec-user-history-page/sec-user-history-page.component';
import { StarRezSecurityUsersPageComponent } from './tabs/security-users-page/security-users-page.component';
import { ScheduledChangesPageComponent } from './tabs/scheduled-changes-page/scheduled-changes-page.component';
import { BasePageContent, NavTabOptions } from '../../core/nav';

@Component({
  selector: 'app-access-management',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './access-management.component.html',
  styleUrl: './access-management.component.scss'
})
export class AccessManagementComponent extends BasePageContent {
  protected _tabs: NavTabOptions[] = [
      {
        icon: '@tui.users',
        name: 'Employees',
        component: UsersListComponent,
        ext: 'users'
      },{
        icon: '@tui.award',
        name: 'Positions',
        component: PositionsListComponent,
        ext: 'positions'
      }, {
        icon: '@tui.clock',
        name: 'Schedule',
        ext: 'scheduled-changes',
        component: ScheduledChangesPageComponent
      },{
        icon: '@tui.history',
        name: 'History',
        ext: 'history',
        component: SecUserHistoryPageComponent
      },{
        icon: '@tui.settings',
        name: 'Setup',
        component: StarRezSecurityUsersPageComponent,
        ext: 'setup'
      },
    ]
  protected _cls = AccessManagementComponent;
  
  constructor() {
    super();
    this.update_tabs();
  }

  protected router_event_detected(a: any) {
  }
}
