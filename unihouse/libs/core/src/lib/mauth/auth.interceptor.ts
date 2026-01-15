import { inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHandlerFn, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from './services/authentication.service';
import { MULTI_AUTH_CONFIG } from './auth.config';

// @Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    private authenticationService = inject(AuthenticationService);
    private token = inject(MULTI_AUTH_CONFIG);
    constructor() { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add header with basic auth credentials if user is logged in and request is to the api url
        const user = this.authenticationService.user;
        const isLoggedIn = user && user.authdata;
        const isApiUrl = request.url.startsWith(this.token.apiUrl);
        if (isLoggedIn && isApiUrl) {
        }
        request = request.clone({
            withCredentials: true
        });
        return next.handle(request);
    }
}

export function ldapInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authService = inject(AuthenticationService);
    const tokenExtractor = inject(HttpXsrfTokenExtractor);
    const token = inject(MULTI_AUTH_CONFIG);
    if (authService.authenticated && request.url.startsWith(token.apiUrl)) {
        request = request.clone({
            withCredentials: true
        });
        if (["POST","DELETE","PUT","PATCH"].includes(request.method)) {
            const csrfToken = tokenExtractor.getToken() as string;
            if (csrfToken) {
              const modifiedRequest = request.clone({
                headers: request.headers.set('X-CSRFToken', csrfToken)
              });
              return next(modifiedRequest);
            }
        }
    }
    return next(request);
  }