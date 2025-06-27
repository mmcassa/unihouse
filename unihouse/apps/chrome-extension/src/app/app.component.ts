import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'chrome-extension';
  entryid: number = 427786;
  async test() {
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id !== undefined)
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: ((id: any) => {
          // navigate to static entryid
          window.location.href = window.location.origin + '/StarRezWeb/main/directory#!entry:'+ id.toString() +':rez%20360';
          window.location.reload();
 
        }) as unknown as () => void, 
        args: [this.entryid]
      }) 
  }
}
