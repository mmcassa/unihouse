import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '@unihouse/core';
import { StarrezTabTracker } from '../starrez/starrez-tab-tracker.service';
import { BehaviorSubject } from 'rxjs';
import { UserCredentialsInterface, UserStatus } from './user.utils';

const EXT_STARREZ_USER_STORAGE_TOKEN = 'chr_ex_sr_user_credentials_obj'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  storage = inject(LocalStorageService);
  starrez_tab = inject(StarrezTabTracker);
  private _user!: UserCredentialsInterface;
  private _user_status: BehaviorSubject<UserStatus> = new BehaviorSubject('init' as UserStatus);

  constructor() { 
    this.load_credentials_from_storage();
  }

  /**
   * Sends a command to content script listeners to create an api key and fetch the user's username
   * @returns void
   */
  private execute_get_credentials_commands() {
    if (this._user_status.value === 'pending') { return; }
    this._user_status.next('pending');
    this.starrez_tab.send_message({'action' : 'fetch_credentials'}, (response) => 
      this.store_credentials_from_sr(response));  
  }

  private store_credentials_from_sr(response: any) {
      if (typeof response === 'object'){
        this.set_credentials(response);
        this._user_status.next('authenticated');
        
      } else {
        this._user_status.next('unauthenticated');
      }
  }

  private load_credentials_from_storage() {
    let saved_credentials = this.storage.get(EXT_STARREZ_USER_STORAGE_TOKEN);
    if (saved_credentials != null) {
      this._user = saved_credentials; 
      this._user_status.next('authenticated');
    } else {
      
    }
  }

  async load_credentials_from_sr_web() {
    let tab_id = this.starrez_tab.tab_id;
    if (tab_id === null) {
      this.starrez_tab.open_tab().then( (id) =>{
        this.execute_get_credentials_commands();}
      );
    } else {
      this.execute_get_credentials_commands();
    }
  }

  private set_credentials(creds: any) {
    this._user = creds;
    if (creds == null) {
      this.storage.remove(EXT_STARREZ_USER_STORAGE_TOKEN);
    } else {
      this.storage.set(EXT_STARREZ_USER_STORAGE_TOKEN,creds);
    }
  }

  get starrez_api_credentials() {
    return this._user;
  }

  get status() {
    return this._user_status.value;
  }

  get statusAsObservable() {
    return this._user_status.asObservable();
  }

  public clear_user_settings() {
    this._user_status.next('pending');
    this.set_credentials(null);
    this._user_status.next('unauthenticated');

  }
}
