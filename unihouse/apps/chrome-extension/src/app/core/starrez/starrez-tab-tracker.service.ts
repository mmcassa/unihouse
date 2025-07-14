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
  private targetOrigin = 'https://uga.starrezhousing.com';
  private targetPathname = '^/StarRezWeb/.*';
  private _tab_status: BehaviorSubject<TabStatus> = new BehaviorSubject('init' as TabStatus);
  private port_connections: chrome.runtime.Port[] = [];

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
      // chrome.tabs.onCreated
      chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        try {
          if (tabId !== this.trackedTabId) {
            console.log(`Tab (tabId: ${tabId}) changed. Ignoring change`);
            return;
          } else {
            console.log(`Tab (tabId: ${tabId}) changed. Tracking change...`)
          }
          this._tab_status.next('pending');
          const url = new URL(tab.url || '');
          if (url.origin.match(this.targetOrigin) && url.pathname.match(this.targetPathname)) {
            this.trackedTabId = tabId;
            this._tab_status.next('active');
            console.log('Updated tracked tab:', tabId);
          } else {
            this._tab_status.next('closed');
            this.trackedTabId = null;
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
      // chrome.tabs.get(tabid).then( (tab) => { console.log(tab)})
      console.log('sending_message');
      try {
        // let res = await chrome.tabs.sendMessage(tabid, message,options);
        chrome.tabs.sendMessage(tabid, message,options,(response) => {
          // chrome.runtime.
          console.log(response);
          response_func?.(response)
        });
        // console.log(res);
        // return;
        // if (response_func)
        //   response_func(res);
        

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
