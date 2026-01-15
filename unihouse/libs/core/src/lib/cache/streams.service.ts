import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StreamsService {
  private readonly http = inject(HttpClient);
  private readonly map = new Map<number, BehaviorSubject<any|null>>();
  protected fetch_fn!: (id: any) => void;

  constructor() { }



  get(id: number,force:boolean=false): Observable<any|null> {
    if (!this.map.has(id)) {
      const subject = new BehaviorSubject<any|null>(null);
      this.map.set(id,subject);
      this.fetch_fn(id);
    }
    return this.map.get(id)!.asObservable();
  }
}
