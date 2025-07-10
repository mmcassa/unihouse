import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TabStatus } from './utils';

const MESSAGE_SEND_MAX_AWAIT_TAB_TIMEOUT = 5000;

@Injectable({
  providedIn: 'root'
})
export class StarrezTabTracker {
  private trackedTabId: number | null = null;
  private targetOrigin = 'https://uga.starrezhousing.com';
  private targetPathname = '^/StarRezWeb/.*';
  private _tab_status: BehaviorSubject<TabStatus> = new BehaviorSubject('init' as TabStatus);

  constructor() {
    this.findMatchingTab();
    this.setupTabUpdateListener();
  }

  // Query all tabs and find one with the matching origin, run at start
  private findMatchingTab() {
    try {
      chrome.tabs.query({}, (tabs) => {
        
        this._tab_status.next('pending');
        const match = tabs.find(tab => {
          try {
            const url = new URL(tab.url || '');
            return url.origin === this.targetOrigin;
          } catch {
            return false;
          }
        });
        if (match) {
          this.trackedTabId = match.id!;
          this._tab_status.next('active');
          console.log('Tracking tab:', this.trackedTabId);
        } else {
          this._tab_status.next('closed');
        }
      });
    } catch {
      console.error('Tab tracker query failed to run');
    }
  }

  // open listener to continue listening for tab updates
  private setupTabUpdateListener() {
    try {
      chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        try {
          this._tab_status.next('pending');
          const url = new URL(tab.url || '');
          if (url.origin.match(this.targetOrigin) && url.pathname.match(this.targetPathname)) {
            this.trackedTabId = tabId;
            this._tab_status.next('active');
            console.log('Updated tracked tab:', tabId);
          }
        } catch {
          // Ignore malformed URLs
          this._tab_status.next('closed');
        }
      });
    } catch {
        console.error('Tab tracker changes listener failed');
      
    }
  }

  public get tab_id(): number | null {
    return this.trackedTabId;
  }

  public get tab_status(): Observable<TabStatus> {
    return this._tab_status.asObservable();
  }

  public async open_tab() {
    await chrome.tabs.create({
      url: 'https://uga.starrezhousing.com/StarRezWeb/'
    }).then().catch((err) => {
      console.error(err)
    });
  }

  public send_message(
    message:any,
    response_func: (res: any) => void,
    options={},
    timeout:number=MESSAGE_SEND_MAX_AWAIT_TAB_TIMEOUT
  ) {
    let tabid = this.trackedTabId
    
    if (typeof tabid === 'number') {
      chrome.tabs.sendMessage(tabid, message,options, (response) => response_func);
      return;
    }
    switch (this._tab_status.value) {
      case 'active': {
        let sub = this._tab_status.asObservable();
        sub.subscribe({
          next: status => {
            if ('pending' === status) {
              this.send_message(message,response_func,options,timeout);
            }
          },
        });
        this.open_tab();
        break;
      }
      case 'pending': {
        this._tab_status.asObservable().subscribe({
          next: status => {
            
          },
        });
        break;
      } default: {
        console.error('Not in valid state for sending message');
        Error('Not in valid state for sending message')
        break;
      }
    }
    this._tab_status.asObservable().subscribe({
      next: status => {
        
      },
    });
    
  }
}
