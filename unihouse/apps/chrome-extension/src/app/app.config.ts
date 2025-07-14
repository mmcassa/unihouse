import { provideEventPlugins } from "@taiga-ui/event-plugins";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthHeaderInterceptor } from "./core/starrez/starrez-http.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
        provideAnimations(),
        provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
        provideEventPlugins(),{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true
    }
    ],
};
