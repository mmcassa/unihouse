import { effect, inject, Injectable } from '@angular/core';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import Keycloak from 'keycloak-js'
import { AuthenticationStatus } from '../../base';
import { AuthProviderService } from '../../base';
@Injectable({
  providedIn: 'root',deps: [KEYCLOAK_EVENT_SIGNAL]
})
export class KeycloakService extends AuthProviderService {

  private is_authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  private readonly keycloak = inject(Keycloak);
  private _authStatus: BehaviorSubject<AuthenticationStatus> = new BehaviorSubject('pending' as AuthenticationStatus);

  constructor() { 
    super();
    this.listen_for_signal(); // start listening for keycloak authentication changes
    
  }


  /**
   * Listens to KEYCLOAK_EVENT_SIGNAL for authentication state changes
   */
  private listen_for_signal() {
    effect(() => {
      const keycloakEvent = this.keycloakSignal();
      const status = keycloakEvent.type;
      if (status === KeycloakEventType.AuthRefreshSuccess) {
        this.is_authenticated.next(true);
        this._authStatus.next('authenticated');
      } else if (status === KeycloakEventType.Ready) {
        if (this.keycloak.authenticated) {
          this.is_authenticated.next(true);
          this._authStatus.next('authenticated');
        } else {
          this.is_authenticated.next(false);
          this._authStatus.next('unauthenticated');
        }
        this._authStatus.next('init');
      } else if (status === KeycloakEventType.AuthLogout) {
        this.is_authenticated.next(false);
        this._authStatus.next('unauthenticated');
      } else {
        this.is_authenticated.next(false);
        this._authStatus.next('pending');
      }
    });
  }

  
  /**
   * Attempts authentication with keycloak service
   */
  login() {
      this.keycloak.login();
  }

  /**
   * Logs out of Keycloak session
   */
  logout() {
      this.keycloak.logout({redirectUri: `${this.token.redirectUri}/logout`});
  }

  public get provideAuthStatus(): Observable<AuthenticationStatus> {
    return this._authStatus.asObservable();
  }

  /**
   * Provides authentication status as boolean.
   */
  public get authenticated(): Observable<boolean> {
    return this.is_authenticated.asObservable();
  }

  public get currentAuthStatus(): boolean {
    return this.is_authenticated.value;
  }



}
