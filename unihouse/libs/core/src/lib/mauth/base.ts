import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { MULTI_AUTH_CONFIG } from "./auth.config";

/**
 * Defines an outline for basic authentication status'
 */
export type AuthenticationStatus = 'authenticated' | 'unauthenticated' | 'pending' | 'init' | 'unknown';
/**
 * Abstract service definition for interactions with an authentication service like Azure AD, Keycloak, Django, etc...
 * 
 * Extend this and define custom functions to interact with your desired authentication provider.
 */
export abstract class AuthProviderService {
    protected readonly token = inject(MULTI_AUTH_CONFIG);
    public abstract login(): void;
    public abstract logout(): void;
    public manual_auth?(username: string,password: string,options?: any): void {}
    public abstract get provideAuthStatus(): Observable<AuthenticationStatus>;
    public abstract get authenticated(): Observable<boolean>;
    public abstract get currentAuthStatus(): boolean;
}
