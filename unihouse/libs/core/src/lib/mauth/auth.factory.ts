
import { KeycloakService } from "./provider/keycloak/keycloak.service";
import { MsalProviderService } from "./provider/msal/msal.service";
import { AuthProviderService } from "./base";
import { includeBearerTokenInterceptor } from "keycloak-angular";
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalModule, MsalService } from "@azure/msal-angular";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { MSALInstanceFactory, MSALGuardConfigFactory,MSALInterceptorConfigFactory } from "./provider/msal/msal.factory";
import { provideKeycloakAngular } from "./provider/keycloak/keycloak.factory";
import { MULTI_AUTH_CONFIG } from "./auth.config";
import { inject } from "@angular/core";

const token = inject(MULTI_AUTH_CONFIG);
/**
 * 
 * @returns Authentication Provider Service based on `token.authProvider`
 */
export function authFactory(): AuthProviderService {
    switch (token.authProvider) {
        case 'keycloak':
            return new KeycloakService;
        case 'msal':
            return new MsalProviderService;
        default:
            throw new Error('Unknown Authentication Provider')
    }
}




/**
 * 
 * @returns list of providers required by the specified authentication provider
 */
export function authProviders(): any[] {
    switch (token.authProvider) {
        case 'keycloak':
            // if Keycloak is setup, then use Keycloak providers
            return [provideKeycloakAngular()]
        case 'msal':
            // if MSAL is setup, then use MSAL providers & modules
            return [
                { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
                { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
                { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
                { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
                MsalService,
                MsalGuard,
                MsalBroadcastService
            ];
        case 'django':
            break;
        default:
            throw new Error('Invalid Auth Provider specified.');
    }
    return [];
}

/**
 * 
 * @returns list of interceptors required by the specified authentication provider
 */
export function authInterceptors(): any[] {
    switch (token.authProvider) {
        case 'keycloak':
            return [includeBearerTokenInterceptor];
        case 'msal':
            break;
        case 'django':
            break;
        default:
            throw new Error('Invalid Auth Provider specified.');
    }
    return [];
}

/**
 * 
 * @returns list of modules required by the specified authentication provider
 */
export function authModules(): any[] {
    switch (token.authProvider) {
        case 'keycloak':
            return [];
        case 'msal':
            break;
        case 'django':
            break;
        default:
            throw new Error('Invalid Auth Provider specified.');
    }
    return [];
}