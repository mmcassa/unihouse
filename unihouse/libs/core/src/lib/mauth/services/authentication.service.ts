import { Injectable, OnDestroy, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { User, UserPermissions } from '../user';
import { AuthenticationStatus } from '../base';
import { AuthProviderService } from '../base';
import { MULTI_AUTH_CONFIG } from '../auth.config';

const AUTH_REQUEST_RETRY_COUNT = 2;
const FORCE_LOGOUT_ON_MAX_RETRY = true; 

/**
 * Interval in which permissions must be refreshed.
 */
const REFRESH_PERMISSIONS_INTERVAL: number = 60000;
/**
 * Interval for spacing out retry attempts to fetch user info
 */
const RETRY_FETCH_USER_INTERVAL: number = 10000;
/**
 * As retries continue, change the frequency of the polling interval
 */
const RETRY_DECAY: number = 1.5;

const null_user: User = {
    id: -1,
    username: "",
    lastName: "",
    firstName: "",
}

/**
 * The `AuthenticationService` is an user authentication service that abstracts the authentication provider so frontend actions can easily interact with simple functions like `login()`, `logout()`, `getRoles()`, etc...
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService implements OnDestroy {
    private http = inject(HttpClient);
    private token = inject(MULTI_AUTH_CONFIG);
    private authProvider = inject(AuthProviderService);
    public event_notifications: BehaviorSubject<string> = new BehaviorSubject('');

    private _subscriptions: Subscription[] = [];


    private loading_user: boolean = false;
    private loading_permissions: boolean = false;
    private auth_user_retry_count: number;
    private _fetch_user_lock: boolean = false;
    private auth_permissions_retry_count: number;
    private max_reached_notified: boolean = false;
    private permissions_refresh_timeout: ReturnType<typeof setTimeout>;
    
    

    private userSubject: BehaviorSubject<User>;
    private userPermissionsSubject: BehaviorSubject<UserPermissions[]>;

    /** Inserted by Angular inject() migration for backwards compatibility */
    constructor() {
        this.auth_user_retry_count = 0;
        this.auth_permissions_retry_count = 0;
        /** function definition required */
        this.permissions_refresh_timeout = setTimeout(() => {
            this.fetchUserPermissions();
        }, REFRESH_PERMISSIONS_INTERVAL);
        /**Previously the authSetup function */
        // this.authSetup();
        const authenticated: boolean = this.authProvider.currentAuthStatus;
        const authStatus: Observable<AuthenticationStatus> = this.authProvider.provideAuthStatus;
        let lastUser: User = null_user;
        let lastPermissions: UserPermissions[] = [];
        if (authenticated) {
            lastUser = JSON.parse(localStorage.getItem('user') ?? "") ?? null_user;
            lastPermissions = JSON.parse(localStorage.getItem('userpermissions') ?? "") ?? [];
        }
        this.userSubject = new BehaviorSubject<User>(lastUser);
        this.userPermissionsSubject = new BehaviorSubject<UserPermissions[]>(lastPermissions);
        authStatus.subscribe({ next: (status) => { if (status === 'pending') this.refreshUserAndPermissions(); }});
        /** END function */

        this.listen_for_auth_changes();

        
    }

    /**
     * Clears the stored user and user permissions objects and removes them both from local storage.
     */
    private clearUser() {
        // remove local storage data
        localStorage.setItem('user',JSON.stringify({}));
        localStorage.setItem('userpermissions', JSON.stringify([]));
        // update user info 
        this.userSubject.next(null_user);
        this.userPermissionsSubject.next([]);
    }

    private listen_for_auth_changes() {
        const obj = this.authProvider.provideAuthStatus.subscribe({
            next: (status: AuthenticationStatus) => {
                if (status === 'authenticated') {
                    this.refreshUserAndPermissions();
                } else if (status === 'unauthenticated') {
                    this.clearUser();
                }
            }
        });
        this._subscriptions.push(obj);
    }

    private maxPollRetryReached(): void {
        if (this.max_reached_notified) return;
        if (FORCE_LOGOUT_ON_MAX_RETRY) {
            this.post_notification('Failed auth too many times, logging out...');
            this.logout();
        } else {
            this.post_notification('Failed to load user data too many times. It is recommended to logout and log back in.');
            throw Error('Failed to load user data.');
        }
    }

    private autoPermissionsRefresh(): void {
        if (this.permissions_refresh_timeout) {
            clearTimeout(this.permissions_refresh_timeout);
        }
        this.permissions_refresh_timeout = setTimeout(() => {
            this.fetchUserPermissions();
        }, REFRESH_PERMISSIONS_INTERVAL);
    }

    /**
     * Loads User Permissions and stores them in localStorage
     */
    private fetchUserPermissions() {
        // Check user is logged in
        if (! this.authProvider.currentAuthStatus) return;

        // Reject attempts greater than the max retry
        if (this.auth_permissions_retry_count > AUTH_REQUEST_RETRY_COUNT) {
            this.maxPollRetryReached();
            return;
        }

        // Do not call competing attempts to pull user permissions
        if (this.loading_permissions) return;
        this.loading_permissions = true;

        this.http.get<UserPermissions[]>(`${this.token.apiUrl}api/user/permissions/`)
        .subscribe({
            next: (res)  => {
                this.auth_permissions_retry_count = 0;
                this.userPermissionsSubject.next(res);
                localStorage.setItem('userpermissions', JSON.stringify(res));
                this.loading_permissions = false;
                this.autoPermissionsRefresh();
            }, error: err => {
                this.auth_permissions_retry_count ++;
                this.loading_permissions = false;
                if (err.status === 403) {
                    this.logout();
                    return;
                } 
                this.autoPermissionsRefresh();

            }
        });
    }

    private retryFetchUser() {
        // lock has already been acquired and a delay is set
        if (this._fetch_user_lock) {return;}
        this._fetch_user_lock = true;
        setTimeout(() => {
            this.fetchUser();
            this._fetch_user_lock = false;
        
        },this.auth_user_retry_count > 1 ? RETRY_FETCH_USER_INTERVAL : (RETRY_FETCH_USER_INTERVAL * (RETRY_DECAY*(this.auth_user_retry_count-1))));

    }

    /**
     * Loads User Object and stores it in localStorage
     */
    private fetchUser() {
        // Check user is logged in
        if (! this.authProvider.currentAuthStatus) return;

        // Reject attempts greater than the max retry
        if (this.auth_user_retry_count > AUTH_REQUEST_RETRY_COUNT) {
            this.maxPollRetryReached();
            return;
        }
        // Do not call competing attempts to pull user data
        if (this.loading_user) return;

        this.loading_user = true;
        this.http.get<User>(`${this.token.apiUrl}api/user/`)
        .subscribe({ 
            next: (res) => {
                this.auth_user_retry_count = 0;
                this.userSubject.next(res);
                localStorage.setItem('user',JSON.stringify(res));
                this.loading_user = false;
            }, error: err => {
                this.auth_user_retry_count ++;
                this.retryFetchUser();
                if (this.auth_user_retry_count > 1)
                    this.post_notification("Failed to acquire user details");
                this.loading_user = false;
                if (err.status == 403) {
                    this.logout();
                } 
            }
        });
    }

    /**
     * Fetches all user information
     */
    private authSetup() {
        
        
    }

    private post_notification(notif: string) {
        if (notif.length > 0)
            this.event_notifications.next(notif);
    }

    private getNotifications(): Observable<string> {
        return this.event_notifications.asObservable();
    }

    /**
     * 
     * @returns Active user as an observable
     */
    public getObservableUser(): Observable<User> {
        return this.userSubject.asObservable();
    }

    /**
     * 
     * @returns UserPermssions list as an observable
     */    
    public getObservablePermissions(): Observable<UserPermissions[]> {
        return this.userPermissionsSubject.asObservable();
    }

    /**
     * @returns Returns the current authenticated `User` object
     */
    public get user(): User {
        return this.userSubject.value;
    }

    /**
     * @returns Returns the current authenticated `User` object's list of `UserPermissions` 
     */
    public get permissions(): UserPermissions[] {
        return this.userPermissionsSubject.value;
    }

    public get authenticated(): Observable<boolean> {
        return this.authProvider.authenticated;
    }

    public refreshUserAndPermissions() {
        this.fetchUser();
        this.fetchUserPermissions();
        return true;
    }

    /**
     * @returns `true` if a user is currently logged in authentication, otherwise `false`
     */
    public get currentAuthStatus(): boolean {
        return this.authProvider.currentAuthStatus;
    }

    manual_auth(username: string,password: string,options?: any) {
        if (typeof this.authProvider['manual_auth'] === 'function') {
            this.authProvider.manual_auth(username,password,options);
        }
    }

    login() {
        this.authProvider.login();
    }

    logout() {
        this.auth_user_retry_count = 0;
        this.auth_permissions_retry_count = 0;
        this.clearUser();
        this.authProvider.logout();
    }

    /**
     * 
     * @param role a `UserPermission.name` or `UserPermission.codename` value
     * @returns true if the role is found in the list of user permissions
     */
    public hasRole(role: string) {
        let roles = this.userPermissionsSubject.value;
        for (let r of roles) {
            if (r.name === role || r.codename === role) {
                return true;
            }
        }
        return false;
    }


    /**
     * 
     * @param roles a list of `UserPermission.name` or `UserPermission.codename` values
     * @returns true if all roles are found in the list of user permissions
     */
    public hasRoles(roles: string[]) {
        
    }

    
    ngOnDestroy(): void {
        this._subscriptions.forEach(sub => sub.unsubscribe());
    }
}