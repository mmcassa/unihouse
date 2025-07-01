import { TuiAppearance, TuiButton, TuiError, TuiIcon, TuiNotification, TuiRoot, TuiTextfield, TuiTitle } from "@taiga-ui/core";
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AsyncPipe, CommonModule } from "@angular/common";

@Component({
  imports: [
    NxWelcomeComponent, 
    CommonModule,
    RouterModule, 
    TuiRoot,
    AsyncPipe,
    ReactiveFormsModule,
    TuiAppearance,
    TuiButton,
    TuiError,
    TuiIcon,
    TuiNotification,
    TuiTextfield,
    TuiTitle,
    
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'chrome-extension';
  entryid: number = 427786;
  private fb: FormBuilder = inject(FormBuilder);
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      "basic" : [],
      "email" : [],
      "name" : [],
      "subscribe" : [],
    }
    )
  }
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
