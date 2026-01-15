export class User {
    id!: number;
    username!: string;
    firstName!: string;
    lastName!: string;
    authdata?: string;
    email?: string;

    constructor() {

    }
}

export class UserPermissions {
    name!: string;
    content_type?: any;
    codename?: string;

}