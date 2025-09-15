import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';
import { Observable, switchMap, tap } from 'rxjs';
import { SecurityUserGroup, SecurityUserGroupCompare } from '../access.interface';
import { EmploymentPositionInterface, Community } from './position.interface';
import { EmployeeInterface } from '../employees/interfaces/employee.interface';
import { EmployeeFiltersInterface } from '../employees/interfaces/employee-filters.interface';
import { DrawerService, DialogService, PaginationOptions, set_paging_params, add_filters_to_params, PaginatedAPIDataInterface, parsePagedData, alertsPipe } from '@unihouse/core';

export interface PositionEmployeeFilters extends EmployeeFiltersInterface {
  positionid: number;
}

export interface MergePositionPOSTData {
  to: number;
  mergeUsers?: boolean;
  positionConfirmed?: boolean;
  addGroups?: number[];
  removeGroups?: number[];
  pushGroupChangesToStarRez?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private readonly alerts = inject(TuiAlertService);
  private readonly drawer = inject(DrawerService);
  private readonly http = inject(HttpClient);
  private readonly dialog = inject(DialogService);

  constructor() { }
  
  open_position_drawer(
    position: EmploymentPositionInterface
  ): void {
    this.drawer.open({
      componentId: 'position',
      data: {"id" : position}
    })
  }

  merge_position(
      from:number,
      to:number,
      merge_users: boolean,
      users_confirm_position?: boolean,
      add_groups?: number[],
      remove_groups?: number[],
      update_user_groups?: boolean
    ): Observable<boolean> {
      
        let data: MergePositionPOSTData = {
         to: to,
          mergeUsers: merge_users,
          positionConfirmed: users_confirm_position,
          addGroups: add_groups,
          removeGroups: remove_groups,
          pushGroupChangesToStarRez: update_user_groups
        }
  
        return this.http.post<boolean>(`0/sr/4/access/positions/${from}/merge/`,data);
    }
  
  get_position(id: number): Observable<EmploymentPositionInterface> {
    return this.http.get<EmploymentPositionInterface>(
      `0/sr/4/access/positions/${id}/`
    );
  }

  get_positions(
    filters?: any,
    paging_options?: Partial<PaginationOptions>
  ): Observable<EmploymentPositionInterface[]> {
    let params = set_paging_params(paging_options);
    if (filters) {
      params = add_filters_to_params(filters,params);
    }
    return this.http.get<PaginatedAPIDataInterface<EmploymentPositionInterface>>(
      `0/sr/4/access/positions/`, {params: params}
    ).pipe(
        parsePagedData(paging_options)
      );
  }  

  get_position_securitygroups(
    id: number
  ): Observable<SecurityUserGroup[]> {
    return this.http.get<SecurityUserGroup[]>(`0/sr/4/access/positions/${id}/groups/`);
  }

  get_employees(
      filters?: PositionEmployeeFilters,
      paging_options?: Partial<PaginationOptions>
    ): Observable<EmployeeInterface[]> {
      
      let params = add_filters_to_params(filters);
      params = set_paging_params(paging_options,params);
  
      return this.http.get<PaginatedAPIDataInterface<EmployeeInterface>>(
        `0/sr/4/access/users/`, 
        { params: params }
      ).pipe(
        parsePagedData(paging_options)
      );
    }
  
    
  
    get_position_groups_comparison(
      id: number,
      compare_id: number
    ): Observable<SecurityUserGroupCompare[]> {
      return this.http.get<SecurityUserGroupCompare[]>(`0/sr/4/access/positions/${id}/groups/diff/`,{
        params: {
          "pk2" : compare_id
        }
      });
    }

    del_position(
    position: EmploymentPositionInterface
  ): Observable<any> {
    return this.dialog.openApproveDialog("Confirm Deletion",{ 
        subtitle: "Position Deletion Approval",
        details: 'Please confirm you would like to delete this position',
        true_text: "Delete",
        false_text: "Cancel"
      }).pipe(
        switchMap((confirmed) => {
            if (confirmed) {
              return this.http.delete(`0/sr/4/access/positions/${position.id}/`)
                .pipe(
                  tap({
                    next: (res) => {
                      this.alerts.open(
                        `${position.title} has been removed.`,
                        {
                          label: 'Postion Deleted',
                          appearance: 'success'
                        }).subscribe();
                    }
                  })
                );
            } else {
              return [];
            }
          }
        )
  );
  }

  upd_position(
    position: EmploymentPositionInterface,
    changes: Partial<EmploymentPositionInterface>
  ): Observable<EmploymentPositionInterface> {
    return this.http.patch<EmploymentPositionInterface>(`0/sr/4/access/positions/${position.id}/`,
        changes)
        .pipe(
          alertsPipe(this.alerts,
            'Position Updated',
            'ERROR: Position Update',
            true,
            `${position.title} was not updated.`,
            `${position.title} has been updated!`
      ));
  }

  upd_position_title(
    id: number,
    title: string
  ): Observable<EmploymentPositionInterface> {
    return this.http.patch<EmploymentPositionInterface>(
                          `0/sr/4/access/positions/${id}/`,
                          {'title':title}
                        )
                        .pipe(
                          alertsPipe(this.alerts,
                            'Position Updated',
                            'Update failed',
                            true,
                            '',
                            'Title updated to ' + title + '.'
                          )
                        );
  } 

  upd_position_set_approved(
    id: number
  ): Observable<any> {
    return this.dialog.openApproveDialog("Confirm Approval",{
        subtitle: "",
        details: `Please confirm you would like to confirm this position and it's users`,
        true_text: "Confirm",
        false_text: "Cancel"}
      )
      .pipe(
        switchMap((confirmed) => {
          if (confirmed) {
            return this.http.post(`0/sr/4/access/positions/${id}/confirm/`,null)
            .pipe(
                tap({next: () => {
                  this.alerts.open(
                    `Position (id:${id}) has been approved.`,
                    {
                      label: 'Postion Approved',
                      appearance: 'success'
                    }
                  ).subscribe();
                }, error: () => {
                  this.alerts.open(
                    `Update error.`,
                    { label: 'Failed to approve position',
                      appearance: 'error'}
                    ).subscribe();
                }
              })
            )
          } else {
            return []
          }
        }
      )
    )
  }

  del_position_securitygroup(
    position_id: number,
    securitygroup_id: number
  ): Observable<any> {
    return this.http.delete(`0/sr/4/access/positions/${position_id}/groups/${securitygroup_id}/`);
  }

  position_add_group() {

  }

  position_remove_group(
    position: EmploymentPositionInterface,
    group: SecurityUserGroup
  ) {
    return this.dialog.openApproveDialog('Position Access Management',{
          title: 'Remove Group',
          subtitle: "Position Access Management",
          details: `Are you sure you would like to remove '${group.name}' from all ${position.title} users?`,
          true_text: "Remove",
          false_text: "Cancel"
        }).pipe(
          switchMap((confirmed) => {
            if (confirmed) {
              return this.http.get(`0/sr/4/access/positions/${position.id}/groups/${group.id}/`,{params:{'groupid':group.id}})
                .pipe(
                  tap({
                    next: (res) => {
                      
                      this.alerts.open(`${group.name} was removed from the position.`,{
                        label: 'Group Access Removed',
                        appearance: 'success'}).subscribe();
                    }, error: (err) => {
                      this.alerts.open(`${group.name} was not removed from the position.`,{
                        label: 'Group Access Removal',
                        appearance: 'error'}).subscribe();
                    }, complete: () => {
                    }
                  })
                );
            } else {
              return [];
            }
          }
        ));
  }

  get_communities(
    communityid?: number | number[],
    searchStr?: string
  ): Observable<Community[]> {

    let params = new HttpParams();

    if (communityid)
      params = params.append('communityid',communityid.toString());
    if (searchStr)
      params = params.append('search',searchStr);
    return this.http.get<Community[]>(`0/sr/4/access/communities/`,{
      params: params
    });

  }
}
