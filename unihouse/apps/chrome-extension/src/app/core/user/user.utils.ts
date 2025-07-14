export type UserStatus = 'authenticated' | 'unauthenticated' | 'pending' | 'init' ;

export interface UserCredentialsInterface {
    username?: string;
    password?: string;
    api_key?: string;
    token_name?: string;
    auth_headers?: any;
    full_name?: string;
    initials?: string;

}

