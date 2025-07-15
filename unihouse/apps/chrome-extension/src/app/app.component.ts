import { TuiAppearance, TuiButton, TuiIcon, TuiNotification, TuiRoot, TuiTextfield, TuiTitle } from "@taiga-ui/core";
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Navbar } from "./nav/navbar";
import { BulkDeleteTransactions } from "./transactions/bulk-delete-transactions";
import { UserService } from "./core/user/user.service";
import { StarrezTabTracker } from "./core/starrez/starrez-tab-tracker.service";
import { StarrezTrackerIcon } from "./core/starrez/starrez-tracker-icon/starrez-tracker-icon";
import { UserStatus } from "./core/user/user.utils";
@Component({
  imports: [
    CommonModule,
    RouterModule, 
    TuiRoot,
    ReactiveFormsModule,
    TuiAppearance,
    TuiButton,
    TuiIcon,
    TuiNotification,
    TuiTextfield,
    TuiTitle,
    Navbar,
    BulkDeleteTransactions,
    
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'chrome-extension';
  entryid: number = 427786;
  username: string = '';
  active_tab: number = -1;
  active_url: string = '';
  user_status: UserStatus = 'init';
  private fb: FormBuilder = inject(FormBuilder);
  form: FormGroup;
  user_service = inject(UserService);
  tab_service = inject(StarrezTabTracker);
  tabid: number = -1;

  constructor() {
    this.tab_service.tab_status.subscribe({
      next: (status) => {
        if (status === 'active') {
          this.tabid = this.tab_service.tab_id ?? -1;
        }
      }
    })
    this.form = this.fb.group({
        "basic" : [],
        "email" : [],
        "name" : [],
        "subscribe" : [],
      }
    );
    let storage_user = localStorage.getItem('sr_username')
    if (storage_user) {
      this.username = storage_user;
    }
    this.user_service.statusAsObservable.subscribe({
      next: res => {
        this.user_status = res;
      }
    })
    
    // try/catch for development preview without building 
    try {
        // load current tab
        chrome.tabs.getCurrent().then(async (tab) => {
          this.active_tab = tab?.id ?? -1;
          this.active_url = tab?.url ?? '';
          // update user info 
              if (
                tab !== undefined 
                && tab.id !== undefined 
                && this.match_sr_web_url(tab?.url ?? '')
              ) {
                  chrome.tabs.sendMessage(tab.id, { action: "get_user" },{}, (response) => {
                  if (typeof response === 'object' && typeof response['data'] === 'string')
                    this.update_username(response.data);
                });
              }
        });

        // start listener to update active_tab
        chrome.tabs.onActivated.addListener(async (activeInfo) => {
            this.active_tab = activeInfo.tabId;
            chrome.tabs.get(this.active_tab).then((tab) => {
              this.active_url = tab.url ?? '';

              // update user info 
              if (activeInfo.tabId && this.match_sr_web_url(tab.url ?? '')) {
                chrome.tabs.sendMessage(activeInfo.tabId, 
                  { action: "get_user" },
                  {}, 
                  (response) => {
                    if (typeof response === 'object' && typeof response['data'] === 'string')
                      this.update_username(response.data);
                  }
                );
              }
            });



          });
    } catch {

    }
    
  }

  protected match_sr_web_url(url: string) {
    return url.match('https://uga.starrezhousing.com/StarRezWeb/') !== null;
  }

  private update_username(username: string) {
    console.log('updating username')
    this.username = username;
    localStorage.setItem('sr_username',username);
  }

  async test() {
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id !== undefined) {
      chrome.tabs.sendMessage(tab.id, { action: "get_user" },{}, (response) => {
          if (typeof response === 'object' && typeof response['data'] === 'string')
            this.update_username(response.data);
        });
    }
  }
}
