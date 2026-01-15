import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';
import { Observable, tap } from 'rxjs';
import { alertsPipe } from '../pipes/generic-rxjs.pipes';

interface GenericPassFailCountResponse {
  success: number;
  failed: number;
}

@Injectable({
  providedIn: 'root'
})
export class StarrezManagementService {
  private readonly http = inject(HttpClient);
  private readonly alert = inject(TuiAlertService);


  clearDutyReport(envid:number): Observable<any> {
    return this.http.delete<any>(`0/sr/${envid}/duty-report/clear/`);
  }

  clear_inactive_waitlist_entryapplications(): Observable<any> {
    return this.http.post<GenericPassFailCountResponse>(`0/adhoc/clear/inactive-waitlist/`,null)
      .pipe(
        alertsPipe(this.alert)
      )
  }
  add_electronic_identities(): Observable<any> {
    return this.http.post<GenericPassFailCountResponse>(`0/adhoc/add-electronic-identities/`,null)
      .pipe(
        alertsPipe(this.alert)
      )
  }
}
