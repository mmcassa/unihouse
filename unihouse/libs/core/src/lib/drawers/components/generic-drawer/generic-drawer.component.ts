import { Component, OnDestroy, ViewChild, ViewContainerRef, ComponentRef, signal, AfterViewInit, inject, viewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DrawerService, DrawerConfig } from '../../drawer.service';
import { TuiDrawer } from '@taiga-ui/kit';
import { TuiButton, TuiPopup } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { DRAWER_REGISTRY_TOKEN } from '../../drawer.config';

@Component({
  selector: 'app-generic-drawer',
  standalone: true,
  imports: [
    CommonModule,
    TuiButton,
    TuiDrawer, 
    TuiPopup,
    
  ],
  template: `
    <tui-drawer *tuiPopup="open()" (close)="onClose()">
      <div class="exit">
          <button
              appearance="icon"
              iconStart="@tui.x"
              tuiIconButton
              type="button"
              (click)="open.set(false)"
          >
              Close
          </button>
      </div>
      
      <ng-template #drawerContainer></ng-template>
    
    </tui-drawer>
  `,
  styleUrl: './generic-drawer.component.scss'
})
export class GenericDrawerComponent implements AfterViewInit,OnDestroy {
  private readonly drawerService = inject(DrawerService);
  private readonly drawerConfig = inject(DRAWER_REGISTRY_TOKEN);
  container = viewChild('drawerContainer',{ read: ViewContainerRef});
  protected loading = signal(false);

  open = signal(false);
  width = 'auto';
  

  private sub?: Subscription;
  protected cmpRef?: ComponentRef<any>;

  constructor() {

  }
  ngAfterViewInit() {
    this.sub = this.drawerService.drawerChanges.subscribe(cfg => {
      if (cfg === null){
        this.handleConfig(cfg);
        return;
      }
      if ('componentId' in cfg) {
        const resolved = {
          ...cfg,
          component: this.drawerConfig[cfg.componentId]
        };
        this.handleConfig(resolved);
      } else {
        this.handleConfig(cfg);
      }

    });
  }

  private set_content(cfg: DrawerConfig) {
      // Create the component inside the drawer
      this.cmpRef = this.container()?.createComponent(cfg.component);
      if (this.cmpRef && cfg.data) {
        for (const [key,value] of Object.entries(cfg.data)) {
          this.cmpRef.setInput(key,value)
        }
      }
  }

  private handleConfig(cfg: DrawerConfig | null) {

    if (cfg) {
      this.container()?.clear();
      this.cmpRef?.destroy();
      this.cmpRef = undefined;
      this.width = cfg.width || 'auto';
      this.open.set(true);
      if (this.container()) {
        this.set_content(cfg);
      } else {
        // defer until container exists
        this.loading.set(true);
        setTimeout(() => this.set_content(cfg), 0);
      }
    } else {
      this.open.set(false);
    }
  }

  onClose() {
    this.open.set(false);
    this.drawerService.close();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
