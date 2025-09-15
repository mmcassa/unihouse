import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, shareReplay, tap, finalize } from 'rxjs';
import { CacheService } from './cache.service';
import { CACHE_RULES } from './cache.config';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  private cache = inject(CacheService);

  // NEW: Track in-flight requests
  private inFlightRequests = new Map<string, Observable<HttpEvent<any>>>();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const forceRefresh = req.headers.get('X-Force-Refresh') === 'true';

    if (req.method !== 'GET' || forceRefresh) {
      return next.handle(req);
    }

    const cacheRule = CACHE_RULES.find(rule => rule.pattern.test(req.url));
    if (!cacheRule) {
      return next.handle(req);
    }

    const cacheKey = req.urlWithParams;

    // Return from cache if available
    const cached = this.cache.get<HttpResponse<any>>(cacheKey);
    if (cached) {
      return of(new HttpResponse({ body: cached.body, status: 200 }));
    }

    // NEW: Return pending request if exists
    const inFlight = this.inFlightRequests.get(cacheKey);
    if (inFlight) {
      return inFlight;
    }

    // NEW: Otherwise create request and store it as in-flight
    const request$ = next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse && event.status < 400) {
          this.cache.set(cacheKey, event, cacheRule.ttl);
        }
      }),
      finalize(() => {
        this.inFlightRequests.delete(cacheKey); // cleanup after request completes/errors
      }),
      shareReplay(1) // ensures all subscribers get the same result
    );

    this.inFlightRequests.set(cacheKey, request$);

    return request$;
  }

  // Optional utility if you want to check this from a component/service
  isPending(url: string): boolean {
    return this.inFlightRequests.has(url);
  }
}
