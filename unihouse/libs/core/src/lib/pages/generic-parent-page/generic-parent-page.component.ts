import { Component } from '@angular/core';
import { BasePageContent, NavTabOptions } from '@app/core/nav/nav-bar.service';

@Component({
  selector: 'app-generic-parent-page',
  imports: [],
  templateUrl: './generic-parent-page.component.html',
  styleUrl: './generic-parent-page.component.scss'
})
export class GenericParentPageComponent extends BasePageContent {
  protected _tabs: NavTabOptions[] = []
  protected _cls = GenericParentPageComponent;

    
    constructor() {
      super();
      this.update_tabs();
      this.navbarsrv.tab = this._tabs[0].ext ?? '';
    }

    protected router_event_detected(a: any) {
    }
}
