import { inject, Injectable } from '@angular/core';
import { AuthProviderService } from '../../base';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { BehaviorSubject, filter, Observable, Subject, takeUntil, tap } from 'rxjs';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { AuthenticationStatus } from '../../base';
import { MsalConfig } from '../../auth.config';

@Injectable({
  providedIn: 'root'
})
export class MsalProviderService extends AuthProviderService {
  private msalGuardConfig = inject<MsalGuardConfiguration>(MSAL_GUARD_CONFIG);
  private msalBroadcastService = inject(MsalBroadcastService);
  private authService = inject(MsalService);

  
  private _authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _authStatus: BehaviorSubject<AuthenticationStatus>;
  private readonly _destroying$ = new Subject<void>();

  constructor() { 
    super();
    if (this.token.authProvider === 'msal') {
      if (localStorage.getItem('msal_auth_status') != null) {
        this._authStatus = new BehaviorSubject("pending" as AuthenticationStatus); 
      } else {
        this._authStatus = new BehaviorSubject('unauthenticated' as AuthenticationStatus);
      }
      this.setup();
    } else {
      this._authStatus = new BehaviorSubject('unknown' as AuthenticationStatus);
    }
  }

  /**
   * MSAL setup 
   */ 
  private setup() {
    this.authService.handleRedirectObservable().subscribe();
    this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
    this.msalBroadcastService.msalSubject$
      
      .pipe(
        tap({
          next: (msg: EventMessage) => {
            if (msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
              msg.eventType === EventType.SSO_SILENT_SUCCESS 
            ) {
              this._authenticated.next(true);
              this._authStatus.next('authenticated');
            } else if (msg.eventType === EventType.LOGOUT_SUCCESS ||
              msg.eventType === EventType.LOGOUT_FAILURE ||
              msg.eventType === EventType.LOGIN_FAILURE ||
              msg.eventType === EventType.SSO_SILENT_FAILURE
            ) {
              this._authenticated.next(false);
              this._authStatus.next('unauthenticated');
            } else if (
              msg.eventType === EventType.ACQUIRE_TOKEN_START ||
              msg.eventType === EventType.LOGIN_START || 
              msg.eventType === EventType.LOGOUT_START || 
              msg.eventType === EventType.SSO_SILENT_START
            ) {
              this._authStatus.next('pending');              
            } else if (msg.eventType === EventType.HANDLE_REDIRECT_END) {
              
            } 
          }
        })
      )
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED ||
            msg.eventType === EventType.HANDLE_REDIRECT_END
        )
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          this._authStatus.next('unauthenticated');
        } else {
          this._authStatus.next('authenticated');
        }
      });
      this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });
  }

  login() {
    localStorage.setItem('msal_auth_status','pending');
    this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest).subscribe({
      next: () => {},
      error: err => {
        return new Error('Authentication failed');
      }
    });
  }

  logout(popup?: boolean) {
    localStorage.clear();
    sessionStorage.clear();    
    if (popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: '/',
      }).subscribe();
    } else {
      let config = this.token.authConfig as MsalConfig
      this.authService.logoutRedirect({
        postLogoutRedirectUri: config.auth.postLogoutRedirectUri,
        idTokenHint: this.authService.instance.getActiveAccount()?.idToken
      }).subscribe();
    }
  }

  public get provideAuthStatus(): Observable<AuthenticationStatus> {
      return this._authStatus.asObservable();
  }

  public get authenticated(): Observable<boolean> {
    return this._authenticated.asObservable();
      
  }

  public get currentAuthStatus(): boolean {
      return true;
  }

  // MSAL v4
  checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();

    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
      // UPDATE USER ACCOUNTS
    }
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  private loginRedirect() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest).subscribe({
        next: () => {
        }
      });
    } else {
      this.authService.loginRedirect().subscribe({
        next: () => {
        }
      });
    }
  }

  private loginPopup() {
    if (this.msalGuardConfig.authRequest) {
      this.authService
        .loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
    } else {
      this.authService
        .loginPopup()
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
    }
  }

  
}
