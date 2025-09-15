import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { MULTI_AUTH_CONFIG } from '../auth.config';

/**
 * AuthGuard is used to notify the navigation audit API
 */
const NAVIGATION_AUDIT_API_URI = "api/audit/nav";
@Injectable({ providedIn: 'root' })
export class AuthGuard  {
    private http = inject(HttpClient);
    private userService = inject(AuthenticationService);
    private token = inject(MULTI_AUTH_CONFIG)
    /** Inserted by Angular inject() migration for backwards compatibility */

    constructor() { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const authenticated = this.userService.currentAuthStatus;
        
        
        let data = new FormData();
        data.set('url',window.location.href);
        this.http.post(`${this.token.apiUrl}${NAVIGATION_AUDIT_API_URI}`,data).subscribe()

        // logged in so return true
        return true;
    }
}
