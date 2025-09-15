import { inject } from "@angular/core";
import { AutoRefreshTokenService, createInterceptorCondition, INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, IncludeBearerTokenCondition, includeBearerTokenInterceptor, KEYCLOAK_EVENT_SIGNAL, KeycloakService as AngularKeycloakService, provideKeycloak, UserActivityService, withAutoRefreshToken } from "keycloak-angular";
import { KeycloakConfig, MULTI_AUTH_CONFIG } from "../../auth.config";
// import { KeycloakConfig } from "keycloak-js";

const token = inject(MULTI_AUTH_CONFIG)
/**
 * Provider value for keycloak interceptor to add Bearer token to API calls
 */
const urlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern:  new RegExp(`^${token.apiUrl}api/.*?$`,"i"),
    bearerPrefix: 'Bearer',
  });

/**
 * Keycloak Factory
 * @returns 
 */
export const provideKeycloakAngular = () =>
    provideKeycloak({
        config: token.authConfig as KeycloakConfig,
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: `${window.location.origin}/assets/silent-check-sso.html`,
          redirectUri: window.location.origin,
        }
        , features : [
          withAutoRefreshToken({
            onInactivityTimeout: 'logout',
            sessionTimeout: 300000
          })
        ], providers: [
            AutoRefreshTokenService,
            UserActivityService,
            {
            provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
            useValue: [urlCondition] as IncludeBearerTokenCondition[]
            }
        ]
    });
