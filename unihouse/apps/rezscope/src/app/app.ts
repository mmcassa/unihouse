import { Component, inject, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NavSidebarComponent } from "./core/nav/nav-sidebar/nav-sidebar.component";
import { NavHeaderComponent } from "./core/nav/nav-header/nav-header.component";
import { BreadcrumbComponent, GenericDrawerComponent, NamedTemplateDirective } from "@unihouse/core";
import { TuiIcon, TuiRoot, TuiScrollbar } from "@taiga-ui/core";
import { TuiFade, TuiTabs } from "@taiga-ui/kit";
import { TuiNavigation } from "@taiga-ui/layout";
import { DEFAULT_THEME_VALUE, ThemeService } from "@unihouse/core";
import { NavBarService } from './core/nav/nav-bar.service';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { filter, Subject } from 'rxjs';
import { EventMessage, EventType } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    GenericDrawerComponent,
    TuiRoot,
    NavHeaderComponent,
    NavSidebarComponent,
    BreadcrumbComponent,
    TuiTabs,
    TuiFade,
    TuiNavigation,
    TuiScrollbar,
    TuiIcon
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App implements AfterContentInit {
  readonly activeroute = inject(ActivatedRoute);
  private readonly navbarService = inject(NavBarService);
  private readonly authService = inject(MsalService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);
  protected readonly themeService: ThemeService = inject<ThemeService>(ThemeService);
  protected readonly msalGuardConfig: MsalGuardConfiguration = inject<MsalGuardConfiguration>(MSAL_GUARD_CONFIG);

  private readonly _destroying$ = new Subject<void>();

  @ContentChildren(NamedTemplateDirective) templates!: QueryList<NamedTemplateDirective>;

  protected theme: string = DEFAULT_THEME_VALUE;
  protected $ready: boolean = false;

  protected title = 'REZian Telescope';

  protected tabs: any[] | null |  undefined;
  protected activeTabIndex: number = 0;
  
  // MSAL Settings
  loginDisplay = false;
  tokenExpiration: string = '';

  constructor() {
      this.navbarService.tabs.subscribe({
        next: (res) => {
          this.tabs = res;
        }
      });

      this.navbarService.activeTabIndex.subscribe({
        next: (idx) => {
          this.activeTabIndex = idx;
        }
      })

      this.themeService.theme.subscribe({
        "next" : (theme) => {
          this.theme = theme;
        }
      });
  }

  // On initialization of the page, display the page elements based on the user state
  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe({
      next: f => {
        this.$ready = true;
      }, error: f => {
        this.$ready = true;
      }
    });
    this.authService.instance.enableAccountStorageEvents();

    // Used for storing and displaying token expiration
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS)
      )
      .subscribe(msg => {
        this.tokenExpiration=  (msg.payload as any).expiresOn;
        localStorage.setItem('tokenExpiration', this.tokenExpiration);
      });

  }
  ngAfterContentInit() {
    this.templates.changes.subscribe({
      next: (templates) => {
      }
    })

  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  tabChange(path_ext:any) {
    this.navbarService.tab = path_ext;

  }
}
