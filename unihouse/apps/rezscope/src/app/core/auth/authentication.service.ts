import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User } from './user.model';
import { UserPermissions } from './user-permission.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject!: BehaviorSubject<User|null>;
    private userPermissionsSubject!: BehaviorSubject<UserPermissions[]|null>;
    private is_auth!: BehaviorSubject<boolean>;
    public user!: Observable<User|null>;
    public userPermissions!: Observable<UserPermissions[]|null>;

    constructor(
        private http: HttpClient
    ) {
        this.authSetup();
        this.is_auth = new BehaviorSubject(false);
    }

    clearUser() {
        this.userSubject.next(null);
        localStorage.setItem('user',JSON.stringify({}));
        this.userPermissionsSubject.next(null);
        localStorage.setItem('userpermissions', JSON.stringify([]));
        this.is_auth.next(false);
    }


 
    setUserPermissions() {
        this.http.get<UserPermissions[]>(`${environment.apiUrl}api/user/permissions/`)
        .subscribe({
            next: (res)  => {
                this.userPermissionsSubject.next(res);
                localStorage.setItem('userpermissions', JSON.stringify(res));
            }, error: err => {
                this.userPermissionsSubject.next([]);
                localStorage.setItem('userpermissions', JSON.stringify([]));
            }
        })
    }

    setUserInfo() {
        this.http.get<User>(`${environment.apiUrl}api/user/`)
        .subscribe({ 
            next: (res) => {
                this.userSubject.next(res);
                localStorage.setItem('user',JSON.stringify(res));
            }, error: err => {
                let u;
                let t = localStorage.getItem('user');
                if (typeof(t) == 'string') {
                    u = JSON.parse(t) as User;
                    this.userSubject.next(u);
                }
            }
        })
    }

    authSetup() {
        let user, permissions;
        // Set User
        user = localStorage.getItem('user');
        if (user !== null) {
            user = JSON.parse(user);
            this.is_auth.next(true);
        }
        this.userSubject = new BehaviorSubject<User|null>(user);
        // Set permissions
        permissions = localStorage.getItem('userpermissions');
        if (permissions !== null) {
            permissions = JSON.parse(permissions);
        }
        this.userPermissionsSubject = new BehaviorSubject<UserPermissions[]|null>(permissions);
        // Create Observables
        this.user = this.userSubject.asObservable();
        this.userPermissions = this.userPermissionsSubject.asObservable();
    }

    public get userValue(): User | null {
        return this.userSubject.value;
    }

    public get userInitials(): string | null {
        if (this.userSubject.value !== null)
            return this.userSubject.value?.firstName[0] + this.userSubject.value?.lastName[0];
        return null;
    }

    public get isAuthenticated(): boolean {
        return this.userSubject.value === null ? false : true;
    }

    public get authenticated(): Observable<boolean> {
        return this.is_auth.asObservable();
    }

    public get permissions(): UserPermissions[] | null {
        return this.userPermissionsSubject.value;
    }

  }