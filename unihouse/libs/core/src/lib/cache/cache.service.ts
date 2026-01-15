// persistent-cache.service.ts
import { Injectable } from '@angular/core';

interface CacheEntry<T> {
  value: T;
  expiry?: number;
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private prefix = 'app-cache-';

  private makeKey(key: string): string {
    return this.prefix + key;
  }

  set<T>(key: string, value: T, ttlMillis?: number): void {
    const expiry = ttlMillis ? Date.now() + ttlMillis : undefined;
    const entry: CacheEntry<T> = { value, expiry };
    localStorage.setItem(this.makeKey(key), JSON.stringify(entry));
  }

  get<T>(key: string): T | null {
    const raw = localStorage.getItem(this.makeKey(key));
    if (!raw) return null;

    try {
      const entry: CacheEntry<T> = JSON.parse(raw);
      if (entry.expiry && Date.now() > entry.expiry) {
        localStorage.removeItem(this.makeKey(key));
        return null;
      }
      return entry.value;
    } catch (e) {
      return null;
    }
  }

  delete(key: string): void {
    localStorage.removeItem(this.makeKey(key));
  }

  clear(): void {
    Object.keys(localStorage)
      .filter(k => k.startsWith(this.prefix))
      .forEach(k => localStorage.removeItem(k));
  }
}
