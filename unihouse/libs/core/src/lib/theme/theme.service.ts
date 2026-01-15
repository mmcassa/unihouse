import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CacheService } from '../cache/cache.service';

const THEME_SERVICE_CACHE_TOKEN = 'uh_lib_core_theme_setting';
export const DEFAULT_THEME_VALUE:string  = "dark";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private cache = inject(CacheService);
  private _theme: string;
  private _themeBS: BehaviorSubject<string>;
  constructor() {
    const cache_value = this.cache.get(THEME_SERVICE_CACHE_TOKEN) as string | null;
    this._theme = cache_value ?? DEFAULT_THEME_VALUE;
    this._themeBS  = new BehaviorSubject(this._theme);
   }

  get theme(): Observable<string> {
    return this._themeBS.asObservable();
  }

  toggleMode() {
    let t: string;
    if (this._themeBS.value == 'dark') {
      t = 'light';
    } else {
      t = 'dark';
    }
    this.cache.set(THEME_SERVICE_CACHE_TOKEN,t);
    this._themeBS.next(t);
  }
}
