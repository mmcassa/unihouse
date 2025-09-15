import { Component } from '@angular/core';
import { BasePageContent, NavTabOptions } from '../../core/nav/nav-bar.service';
import { ManageEnvironmentsPageComponent } from '../manage-environments-page/manage-environments-page.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings-page',
  imports: [
    RouterOutlet
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent extends BasePageContent {
  protected override _tabs: NavTabOptions[] = [
    {
      component: ManageEnvironmentsPageComponent,
      ext : 'environments',
      icon : '@tui.globe',
      name: 'Environments'

    }
  ];
  protected override _cls = SettingsPageComponent;

  
  constructor() {
    super();
    this.update_tabs();
    this.navbarsrv.tab = this._tabs[0].ext ?? '';
  }
  protected router_event_detected(a: any) {
  }
}
