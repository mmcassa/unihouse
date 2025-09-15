import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AppConfig {

  loadConfig(): Promise<any> {
    return fetch(`${environment.apiUrl}0/msal/`)
      .then(response => response.json());
  }
}
