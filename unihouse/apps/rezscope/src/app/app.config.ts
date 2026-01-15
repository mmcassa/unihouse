import { provideAnimations } from "@angular/platform-browser/animations";
import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi, withXsrfConfiguration } from "@angular/common/http";

import { MsalGuard, MsalInterceptor, MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { environment } from "../environments/environment";
import { CachingInterceptor, DRAWER_REGISTRY_TOKEN } from "@unihouse/core";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { authInterceptors, authProviders } from "./core/mauth/auth.factory";

import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { PositionDetailComponent } from "./core/access";
import { EmployeeDetailComponent } from "./core/access/employees";

// All MSAL setup work
function loggerCallback(logLevel: LogLevel, message: string) {
  console.log("MSAL Angular: ", message);
}

export function provide_msal() {
  const msal_config = environment.authConfig.authConfig;
  return [
      {
        provide: MSAL_INSTANCE,
        useValue: new PublicClientApplication({
          auth: msal_config.auth,
          cache: msal_config.cache, 
          system: {
            loggerOptions: {
              loggerCallback,
              logLevel: LogLevel.Error,
              piiLoggingEnabled: false,
            },
          },
        })
      },
      {
        provide: MSAL_GUARD_CONFIG,
        useValue: {
          interactionType: msal_config.guard.interactionType,
          authRequest: msal_config.guard.authRequest,
          loginFailedRoute: msal_config.guard.loginFailedRoute,
        } as MsalGuardConfiguration,
      },
      {
        provide: MSAL_INTERCEPTOR_CONFIG,
        useValue: {
          interactionType: msal_config.interceptor.interactionType,
          protectedResourceMap: new Map(msal_config.interceptor.protectedResourceMap),
        } as MsalInterceptorConfiguration,
      }, {
        provide: HTTP_INTERCEPTORS,
        useClass: MsalInterceptor,
        multi: true
      },
      MsalService,
      MsalGuard,
      MsalBroadcastService
  ]
}

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideAnimations(), 
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    importProvidersFrom(),
    provideHttpClient(
      withInterceptorsFromDi(),
      // withInterceptors(authInterceptors()),
      withXsrfConfiguration({
        cookieName: 'csrftoken',
        headerName: 'X-CSRFToken',
      }),),
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },    
    ...provide_msal(), 
    provideAnimationsAsync(),
    provideEventPlugins(),
    
    { 
      provide: DRAWER_REGISTRY_TOKEN, 
      useValue: {
        employee: EmployeeDetailComponent,
        position: PositionDetailComponent
      }
    },
    // ...authProviders()
  ],
};