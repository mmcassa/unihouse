import { DOCUMENT, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from '../storage/local-storage.service';

const THEME_LOCAL_STORAGE_TOKEN = 'uh_lib_core_theme_setting';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _theme: string;
  private _themeBS: BehaviorSubject<string>;
  private _document = inject(DOCUMENT);
  private storage = inject(LocalStorageService);

  constructor() {
    this._theme = this.storage.get(THEME_LOCAL_STORAGE_TOKEN) ?? 'light';
    this._themeBS  = new BehaviorSubject(this._theme);
    this._themeBS.asObservable().subscribe({
      next: theme => {
        this.storage.set(THEME_LOCAL_STORAGE_TOKEN,theme);
        let els = this._document.getElementsByTagName('tui-root');
        if (els.length === 1) {
          els[0].setAttribute('tuiTheme',theme);
        }
      }
    })
   }

  get theme(): Observable<string> {
    return this._themeBS.asObservable();
  }

  toggleMode() {
    let t: string;
    if (this._themeBS.value === 'dark') {
      t = 'light';
    } else {
      t = 'dark';
    }
    this._themeBS.next(t);
  }
}
