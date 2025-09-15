import { Component } from '@angular/core';
import { BasePageContent, NavTabOptions } from '../../core/nav';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-clean-up-page',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './clean-up-page.component.html',
  styleUrl: './clean-up-page.component.scss'
})
export class CleanUpPageComponent  extends BasePageContent {
  protected override _tabs: NavTabOptions[] = [
    {
      name: 'General',
      ext: 'general'
    },
    {name: 'Reports', ext: 'reports', icon: ''},
    {name: 'Dynamic Lists', ext: 'dynamiclists', icon: ''},
    {name: 'Templates', ext: 'templates', icon: ''}
  ];
  protected override _cls = CleanUpPageComponent;
  
  constructor() {
    super();
    this.update_tabs();
    this.navbarsrv.tab = this._tabs[0].ext ?? '';
  }

  protected router_event_detected(a: any) {
  }
}
