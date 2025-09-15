import { inject } from "@angular/core";
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from "@azure/msal-angular";
import { BrowserCacheLocation, InteractionType, IPublicClientApplication, LogLevel, PublicClientApplication } from "@azure/msal-browser";
import { MsalConfig, MULTI_AUTH_CONFIG } from "../../auth.config";

const token = inject(MULTI_AUTH_CONFIG);
/**
 * 
 * @returns Promise<> containing MSAL configuration for MSALInstance, MSALInterceptor, and MSALGuard
 */
export function fetchMSALConfig() {
    return fetch(token.apiUrl+"api/msal")
    .then((response) => response.json());
}

export function loggerCallback(logLevel: LogLevel, message: string) {
    console.log(message);
}

/**
 * Azure AUTH Factories
 * @returns 
 */
export function MSALInstanceFactory(): IPublicClientApplication {
    const config = token.authConfig as MsalConfig;
    return new PublicClientApplication({
        auth: config.auth,
        cache: {
        cacheLocation: BrowserCacheLocation.SessionStorage,
        },
        system: {
        allowPlatformBroker: false, // Disables WAM Broker
        loggerOptions: {
            loggerCallback,
            logLevel: LogLevel.Error,
            piiLoggingEnabled: false,
        },
        },
    });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const config = token.authConfig as MsalConfig;
    const protectedResourceMap = config.interceptor.protectedResourceMap;
  
    return {
      interactionType: InteractionType.Redirect,
      protectedResourceMap,
    };
}
  
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
    const config = token.authConfig as MsalConfig;
    return {
      interactionType: InteractionType.Redirect,
      authRequest: config.guard.authRequest,
      loginFailedRoute: '/login-failed',
    };
}
