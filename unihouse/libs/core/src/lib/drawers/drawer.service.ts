import { inject, Injectable, Type } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CacheService } from '../cache';

export const DRAWER_CACHE_TOKEN = "rezscope_drawer_config_";
export const DRAWER_CACHE_TTL = 1 * 60 * 1000;


export interface DrawerConfig<T = any> {
  component: Type<any>;   // component to render in the drawer
  data?: T;               // data passed into the component
  width?: string;         // optional config
}

export interface DrawerConfigCache<T = any> extends Partial<DrawerConfig> {
  componentId: string;
  component?: Type<any>;
  data?: T;
  width?: string;
}

@Injectable({ providedIn: 'root' })
export class DrawerService {
  private drawer$ = new BehaviorSubject<DrawerConfig | DrawerConfigCache | null>(null);
  private readonly cache = inject(CacheService);

  constructor() {
    let config = this.cache.get<DrawerConfigCache<any>>(DRAWER_CACHE_TOKEN);
    if (config) {
      this.open(config);
    }
  }

  get drawerChanges(): Observable<DrawerConfig | DrawerConfigCache | null> {
    return this.drawer$.asObservable();
  }

  open<T>(config: DrawerConfig<T> | DrawerConfigCache) {
    this.drawer$.next(config);
  }

  close() {
    this.cache.delete(DRAWER_CACHE_TOKEN);
    this.drawer$.next(null);
  }
}
