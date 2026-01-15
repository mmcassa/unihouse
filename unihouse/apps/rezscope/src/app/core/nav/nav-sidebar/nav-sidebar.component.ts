import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { TuiAppearance, TuiButton, TuiDataList, TuiDropdown, TuiExpand, TuiHint } from '@taiga-ui/core';
import { TuiDataListDropdownManager, TuiFade } from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout'
@Component({
  selector: 'rt-nav-sidebar',
  standalone: true,
  imports: [
    RouterModule,
		TuiExpand,
		TuiDataList,
		TuiHint,
    TuiAppearance,
		TuiButton,
		TuiDropdown,
    TuiDataList,
		TuiNavigation,
		TuiDataListDropdownManager,
		TuiFade,
          ],
  templateUrl: './nav-sidebar.component.html',
  styleUrl: './nav-sidebar.component.scss'
})
export class NavSidebarComponent {
  expanded: boolean = true;
  submenu!: any;
  open: boolean = false;
  siteTitle = environment.title;
  tabs: any[] | undefined;
  navRoutes: any[] = [
    {name: 'Room Availability', link: 'room-availability', icon: '@tui.book-open'},
    {name: 'Access Manager', link: 'access-manager', icon: '@tui.id-card'},
    {name: 'Clean Up', icon: '@tui.bubbles', link: 'clean-up'}   
  ];

  constructor(readonly router: RouterModule) {
  }

}
