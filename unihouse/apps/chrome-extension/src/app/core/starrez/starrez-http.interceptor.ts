// auth-header.interceptor.ts
import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service'; // adjust path as needed

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {
  private userService = inject(UserService);

  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const credentials = this.userService.starrez_api_credentials;

    let modifiedReq = req;
    if (credentials && Object.keys(credentials).length > 0) {
      let headers = req.headers;
      if ( credentials.username != null )
      headers = headers.set('StarRezUsername',credentials.username);
      if ( credentials.api_key != null )
        headers = headers.set('StarRezPassword',credentials.api_key);
      modifiedReq = req.clone({ headers });
    }
    console.log(credentials)
    console.log(modifiedReq)
    return next.handle(modifiedReq);
  }
}
