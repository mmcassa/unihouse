import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, shareReplay, tap, throwError } from 'rxjs';
import { TuiAlertService } from '@taiga-ui/core';
import { EmployeeInterface } from './employees/interfaces/employee.interface';
import { ScheduledPositionChangeInterface } from './access.interface';
import { SecurityUserHistory } from './history/securityuser-history.interface';
import { DialogService, PaginationOptions, add_filters_to_params, PaginatedAPIDataInterface, set_paging_params, parsePagedData, alertsPipe2 } from '@unihouse/core';
import { ScheduledChangesBulkUpdateActionsComponent, ScheduledChangedImportComponent } from './scheduled-changes';


export interface RemoveStudentWorkerAccessResponse {
  success: number[];
  failed: number[];
}

export interface AutoDetectPosition {
  id: number;
  title: string;
  code?: string;
  department: string;
  is_prostaff: boolean;
  has_community: boolean;
  staged: boolean;
  archive: boolean;
  parent?: number;
  supervisor_position?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StarrezAccessService {
  private readonly alerts = inject(TuiAlertService);
  private readonly http = inject(HttpClient);
  private readonly dialog = inject(DialogService);
  private employees = new Map<number, BehaviorSubject<EmployeeInterface| null>>(); // TODO: convert get_employee/s functions to use this as a stream for the rest of 

  constructor() { }

  open_bulk_edit_scheduled_changes(
    changes: ScheduledPositionChangeInterface[]
  ): Observable<any> {
    return this.dialog.openDialog(
      ScheduledChangesBulkUpdateActionsComponent,
      'Bulk Update - Scheduled Changes',
      changes,
      'l',
      true
    )
  }

  open_import_scheduled_changes(
  ): Observable<any> {
    return this.dialog.openDialog(
      ScheduledChangedImportComponent,
      'Scheduled Changes Import',
      undefined,
      'l',
      true
    )
  }

  

  get_scheduled_changes(
    paging_options?: Partial<PaginationOptions>,
    filters?: any
  ): Observable<ScheduledPositionChangeInterface[]> {
    let params = new HttpParams();
    params = add_filters_to_params(filters);
    return this.http.get<PaginatedAPIDataInterface<ScheduledPositionChangeInterface>>(
        `0/sr/4/access/scheduled-changes/`,
        { 
          params: set_paging_params(paging_options,params)
        }
      )
      .pipe(
        parsePagedData(paging_options),
        tap(x => {
          x.forEach(i => {
            if (typeof i.actiondatestart === 'string') {
              i.actiondatestart = new Date(i.actiondatestart);
            }
          })
        })
      )
  }

  
  cancel_scheduled_change(
    id: number
  ): Observable<any> {
    return this.http.post<any>(`0/sr/4/access/scheduled-changes/${id}/cancel/`,null);
  }

  cancel_scheduled_changes(
      ids: number[]
    ): Observable<any> {
      return this.http.post<any>(`0/sr/4/access/scheduled-changes/cancel/`,{ ids: ids });
  }

  del_scheduled_change(
    id: number
  ): Observable<any> {
    return this.http.delete<any>(`0/sr/4/access/scheduled-changes/${id}/`);
  }

  del_scheduled_changes(
    ids: number[]
  ): Observable<any> {
    return this.http.post<any>(`0/sr/4/access/scheduled-changes/delete/`,{ params: add_filters_to_params({ids:ids}) });
  }

  detect_new_scheduled_changes() {
    return this.http.post<boolean|null>(`0/sr/4/access/scheduled-changes/detect/`,null);
  }

  execute_scheduled_change(
      id: number
    ): Observable<any> {
      return this.http.post<any>(`0/sr/4/access/scheduled-changes/${id}/execute/`,null);
  }

  execute_scheduled_changes(
      ids: number[]
    ): Observable<any> {
      return this.http.post<any>(`0/sr/4/access/scheduled-changes/execute/`,{ ids: ids });
  }

  update_scheduled_changes(
      ids: number[],
      changes: Partial<ScheduledPositionChangeInterface>
    ): Observable<any> {
      let params = add_filters_to_params({ids: ids});
      return this.http.post<any>(
        `0/sr/4/access/scheduled-changes/update/`,
        changes,
        {params: params}
        ).pipe(
          alertsPipe2(
            this.alerts,
            {
              on_success_label: `Updated  ${ids.length} Scheduled Changes`,
              on_success_message: `Updated ${Object.keys(changes).length} properties.`,
              on_fail_label: 'Failed to update',
              on_fail_http_error_details: true,
            }
          )
        );
  }

  update_scheduled_change(
      scheduled_change: ScheduledPositionChangeInterface,
      changes: Partial<ScheduledPositionChangeInterface>
    ): Observable<any> {
      return this.http.patch<any>(
        `0/sr/4/access/scheduled-changes/${scheduled_change.id}/`,
        changes
        )
        .pipe(
          alertsPipe2(
            this.alerts,
            {
              on_success_label: 'Updated Scheduled Change',
              on_success_message: `Updated ${Object.keys(changes).length} properties`,
              on_fail_label: 'Failed to update',
              on_fail_http_error_details: true,
            }
          )
        );
  }

  get_security_user_history(
    filters?: Partial<SecurityUserHistory>,
    paging_options?: Partial<PaginationOptions>
  ): Observable<SecurityUserHistory[]> {
    let params = add_filters_to_params(filters ?? {});
    return this.http.get<PaginatedAPIDataInterface<SecurityUserHistory>>(
      `0/sr/4/access/log/`, 
      {
        params: set_paging_params(paging_options,params)
      }
      )
      .pipe( parsePagedData(paging_options ));
  }

  autodetect(): Observable<AutoDetectPosition[]> {
    return this.http.get<AutoDetectPosition[]>(`0/sr/4/access/auto-detect/`).pipe(
      catchError((error:any) => {
        this.alerts.open(`${error.error}`,{
          label: 'Auto-Detect Failed',
          appearance: 'error'}).subscribe();
        return throwError(() => error)
      }),
      tap(result => {
        this.alerts.open(`It is recommended to reload the page`,{
          label: 'Auto-Detect Completed',
          appearance: 'success'}).subscribe();
      }),
    shareReplay({ bufferSize: 1, refCount: false })
    );
  }

  test(): Observable<any> {
    return this.http.get<any>(`0/test/`).pipe(
      catchError((error:any) => {
        this.alerts.open(`${error.error}`,{
          label: 'Test API Call failed',
          appearance: 'error'}).subscribe();
        return throwError(() => error)
      }),
      tap(result => {
        this.alerts.open(`Test success`,{
          label: 'Test API',
          appearance: 'success'}).subscribe();
      })
    );
  }

  updateConferenceAddresses(): Observable<any> {
    return this.http.get<any>(`0/sr/4/conferences/cf2addr/`).pipe(
      catchError((error:any) => {
        this.alerts.open(`${error.error}`,{
          label: 'Update failed',
          appearance: 'error'}).subscribe();
        return throwError(() => error)
      }),
      tap(result => {
        this.alerts.open(`Updated addresses`,{
          label: 'Conferences',
          appearance: 'success'}).subscribe();
      })
    );
  }
  
}
