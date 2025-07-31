import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TabStatus } from './utils';

const MESSAGE_SEND_MAX_AWAIT_TAB_TIMEOUT = 5000;

class TabPortConnectionManager {
  port_connection: chrome.runtime.Port;

  constructor(connection: chrome.runtime.Port) {
    this.port_connection = connection;
    this.open_port_message_listener;
  }

  private open_port_message_listener() {
    this.port_connection.onMessage.addListener((message,port) => {
      console.log(port.name);
      console.log(message);
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class StarrezTabTracker {
  private trackedTabId: number | null = null;
  private trackedTab!: chrome.tabs.Tab;
  private targetOrigin = 'https://uga.starrezhousing.com';
  private targetPathname = '^/StarRezWeb/.*';
  private _tab_status: BehaviorSubject<TabStatus> = new BehaviorSubject('init' as TabStatus);
  private port_connections: chrome.runtime.Port[] = [];

  constructor() {
    this.findMatchingTab();
    this.setupTabUpdateListener();
  }

  private validate_matching_tab(tab:chrome.tabs.Tab): boolean {
    try {
      const url = new URL(tab.url || '');
      return url.origin === this.targetOrigin && url.pathname.match(this.targetPathname) !== null;
    } catch {
      return false;
    }
  }

  // Query all tabs and find one with the matching origin, run at start
  private findMatchingTab() {
    try {
      chrome.tabs.query({}, (tabs) => {
        
        this._tab_status.next('pending');
        const match = tabs.find(tab => {
          return this.validate_matching_tab(tab);
        });
        if (match) {
          this.set_tracked_tab(match);
          console.log('Tracking tab:', this.trackedTabId);
        } else {
          this._tab_status.next('closed');
        }
      });
    } catch {
      console.error('Tab tracker query failed to run');
    }
  }

  private set_tracked_tab(tab: chrome.tabs.Tab) {
    this.trackedTabId = tab.id!;
    this.trackedTab = tab;
    this._tab_status.next('active');
  }

  // open listener to continue listening for tab updates
  private setupTabUpdateListener() {
    try {
      // if the tracked tab is removed/closed find a new one
      chrome.tabs.onRemoved.addListener((tabId,removeInfo) => {
        if (tabId === this.trackedTabId) {
          this.findMatchingTab();
        }
      });
      // Add listener for if a valid tab is activated, track this tab
      chrome.tabs.onActivated.addListener((info) => {
        if (info.tabId !== this.trackedTabId) {
          chrome.tabs.get(info.tabId).then((tab) => {
            if (this.validate_matching_tab(tab)) {
              this.set_tracked_tab(tab);
            } 
          });
        }
      });
      // Add listener for updates to tabs
      chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        try {
          if (tabId !== this.trackedTabId) {
            return;
          } else {
            // console.log(`Tab (tabId: ${tabId}) changed. Tracking change...`)
          }
          this._tab_status.next('pending');
          const url = new URL(tab.url || '');
          if (url.origin.match(this.targetOrigin) && url.pathname.match(this.targetPathname)) {
            this.set_tracked_tab(tab);
          } else {
            this._tab_status.next('closed');
            this.trackedTabId = null;
            this.trackedTab = tab;
            this.findMatchingTab();
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

  public open_connection(name: string) {
    let tab_id = this.trackedTabId;
    if (typeof tab_id == 'number') {
      let conn = chrome.tabs.connect(tab_id,{name: name});
      this.port_connections.push(conn);
      return conn;
    } 
    return null;
  }

  public listen_to_port(name: string) {

  }

  public get_tab_url_extension(): string {
    console.log(this.trackedTab)
    const tab = this.trackedTab;
    const url = new URL(tab?.url || '');
    return url.href;
  }

  public async send_message(
    message:any,
    response_func?: (res: any) => void,
    options={},
    timeout:number=MESSAGE_SEND_MAX_AWAIT_TAB_TIMEOUT
  ) {
    let tabid = this.trackedTabId;
    if (typeof tabid === 'number') {
      
      let t = await chrome.tabs.get(tabid);
      if (t.active === false) {
        await chrome.tabs.update(tabid, { active: true});
      }
      console.log('sending_message');
      try {
        chrome.tabs.sendMessage(tabid, message,options,(response) => {
          console.log(response);
          response_func?.(response)
        });
        

      } catch {
        console.error('Failed to collect response');
        // response_func(null);
      }
      return 'err';
    } 
    throw Error('No tab available');
  }
    // else {
    //   switch (this._tab_status.value) {
    //     case 'active': {
    //       let sub = this._tab_status.asObservable();
    //       sub.subscribe({
    //         next: status => {
    //           if ('pending' === status) {
    //             this.send_message(message,response_func,options,timeout);
    //           }
    //         },
    //       });
    //       this.open_tab();
    //       break;
    //     }
    //     case 'pending': {
    //       this._tab_status.asObservable().subscribe({
    //         next: status => {
              
    //         },
    //       });
    //       break;
    //     } default: {
    //       console.error('Not in valid state for sending message');
    //       Error('Not in valid state for sending message')
    //       break;
    //     }
    //   }
    //   this._tab_status.asObservable().subscribe({
    //     next: status => {
          
    //     },
    //   });
    //   return;
    // }
  // }
}
