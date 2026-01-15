import { InjectionToken } from "@angular/core";

export interface KeycloakConfig {
    url: string;
    realm: string;
    clientId: string;
}

export interface MsalConfig {
    auth: any;
    cache: any;
    guard: any;
    interceptor: any;
}

export interface MultiAuthConfig {
    apiUrl: string;
    authProvider: string;
    redirectUri: string;
    authConfig: KeycloakConfig | MsalConfig;

}

export const MULTI_AUTH_CONFIG = new InjectionToken<MultiAuthConfig>('MULTI_AUTH_CONFIG')