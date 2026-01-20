import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { SecurityUserHistory } from '../history/securityuser-history.interface';
import { BulkEmployeeImportComponent } from './components/bulk-employee-import/bulk-employee-import.component';
import { ChangeUserPositionComponent } from './components/change-user-position/change-user-position.component';
import { EmployeeInterface, EmployeePositionHistory } from './interfaces/employee.interface';
import { DrawerService, DialogService, alertsPipe2, PaginatedAPIDataInterface, PaginationOptions, GenericAction, alertsPipe, set_paging_params, parsePagedData } from '@unihouse/core';
import { add_filters_to_params } from 'libs/core/src/lib/http/params';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly alerts = inject(TuiAlertService);
  private readonly drawer = inject(DrawerService);
  private readonly http = inject(HttpClient);
  private readonly dialog = inject(DialogService);
  private employees = new Map<number, BehaviorSubject<EmployeeInterface| null>>(); // TODO: convert get_employee/s functions to use this as a stream for the rest of 

  constructor() { }

  open_change_employee_position(
    employee: EmployeeInterface | EmployeeInterface[]
  ) {
    return this.dialog.openDialog(
      ChangeUserPositionComponent,
      'Change User Position',
      employee,
      'm'
    )
        
  }

  open_bulk_import_employees(): Observable<any> {
    return this.dialog.openDialog(
      BulkEmployeeImportComponent,
      `Bulk Import - Employees`,
      undefined,
      'l',
      true
    )
  }

  open_employee_drawer(
    employee: EmployeeInterface
  ): void {
    this.drawer.open({
      componentId: 'employee',
      data: {"employee" : employee}
    })
  }

  create_employee(employee: Partial<EmployeeInterface>) {
    // TODO: add validation for partial employee
    return this.http.post<EmployeeInterface>(`0/sr/4/access/users/`,employee)
        .pipe(
          alertsPipe2(
            this.alerts,
            {
              on_success_label: 'Employee Created',
              on_success_message : `${employee.fullname} has been created!`,
              on_fail_label: 'Failed to Create',
              on_fail_http_error_details: true
            }
          )
        )
  }

  get_employee(id: number) {
    return this.http.get<EmployeeInterface>(`0/sr/4/access/users/${id}/`);
  }

  get_employee_by_secuserid(id: number): Observable<EmployeeInterface> {
    let params = add_filters_to_params({ 'secuserid' : id,'_all':1})
    return this.http.get<PaginatedAPIDataInterface<EmployeeInterface>>(
      `0/sr/4/access/users/`,
      {params: params})
      .pipe(
        map(x => {
          let val = x.results
          if (val.length === 1) {
            return val[0];
          } else {
            throw Error('No user found');
          }
      })
    );
  }
  
  
  get_employees(
    filters?: any,
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

  get_employee_actions(
    employees: EmployeeInterface | EmployeeInterface[],
  ): GenericAction[] {

    const actions: GenericAction[] = [] as GenericAction[];
      
    actions.push({
      action: () => this.open_change_employee_position(employees),
      title: 'Change Position',
      icon: '@tui.shuffle',
      description: 'Update an employee\'s access by changing their position.',
      appearance: 'flat-info'
    })

    if (Array.isArray(employees)) {
      // bulk employee actions
      // remove access

      // restore access

      //

    } else {
      // individual actions
      if (! employees.is_test_user) {
        actions.push({
          title: 'Set as Test User',
          icon: '@tui.bot',
          action: () => this.upd_employee_set_bot_user(employees),
          description: "Sets an employee to be a testing or bot user in Rezscope.",
          appearance: 'flat-warning'
        })
      }
      if (employees.is_normal) {
        actions.push(...[
            {
              title: 'Remove Access',
              icon: '@tui.circle-x',
              description: 'Removes an Employee\'s StarRez access.',
              action: () => this.upd_employee_remove_access(employees),
              appearance: 'flat-destructive'
          }
        ])
      } else {
        actions.push(...[
            {
              title: 'Restore Access',
              icon: '@tui.circle-check',
              description: 'Restores an Employee\'s StarRez access.',
              action: () => this.upd_employee_restore_access(employees),
              appearance: 'flat-positive'
          }
        ])
      }
    }
    return actions;
  }

  private employee_list_stringify(employees: EmployeeInterface[]) {
    const output_str = ""
    
    employees.forEach((e,i) => {
      if (i < 10){
        output_str.concat(`\n\t${e.fullname ?? e.username}`);
      }else{
          
      }
    });
    if (employees.length >= 10)
      output_str.concat(`\n\tand ${employees.length - 9} others`);
    
    return output_str;
  }

  get_security_user_history(
    paging_options?: Partial<PaginationOptions>
  ): Observable<SecurityUserHistory[]> {
    return this.http.get<PaginatedAPIDataInterface<SecurityUserHistory>>(
      `0/sr/4/access/log/`, 
      {
        params: set_paging_params(paging_options)
      }
      )
      .pipe( parsePagedData(paging_options ));
  }

  get_employee_position_history(
    paging_options?: Partial<PaginationOptions>
  ): Observable<EmployeePositionHistory[]> {
    return this.http.get<PaginatedAPIDataInterface<EmployeePositionHistory>>(
      `0/sr/4/access/history/`, 
      {
        params: set_paging_params(paging_options)
      }
      )
      .pipe( parsePagedData(paging_options ));
  }

  get_employee_position_history_by_employee(
    employeeid: number
    // paging_options?: Partial<PaginationOptions>
  ): Observable<EmployeePositionHistory[]> {
    return this.http.get<EmployeePositionHistory[]>(
      `0/sr/4/access/users/${employeeid}/history/`
      );
  }

  upd_employee(
    id: number,
    updates: Partial<EmployeeInterface>
  ): Observable<EmployeeInterface> {
    return this.http.patch<EmployeeInterface>(`0/sr/4/access/users/${id}/`,{ params: updates });
  }

  upd_employees_remove_access(
    employees: EmployeeInterface[],
  ): Observable<EmployeeInterface[]> {
    return this.dialog.openApproveDialog("Confirm Access Removal",{
          details: `Remove access from: ${this.employee_list_stringify(employees)}\n`,
          true_text: "Confirm",
          false_text: "Cancel"
        }
      )
      .pipe(
        switchMap((confirmed) => {
          if (confirmed) {
            // TODO: add data and make post
            return this.http.post<EmployeeInterface[]>(`0/sr/4/access/users/removeAccess/`,employees.map(x => x.id))
                        .pipe();
          } else {
            return [];
          }
        })
      );
  }

  upd_employee_remove_access(
    employee: EmployeeInterface
  ): Observable<EmployeeInterface> {
    return this.dialog.openApproveDialog("Remove Access",{
          details: `Are you sure you want to remove access from: ${employee.fullname}?\n`,
          true_text: "Confirm",
          false_text: "Cancel"
        }
      )
      .pipe(
        switchMap((confirmed) => {
          if (confirmed) {
            // TODO: add data and make post
            return this.http.get<EmployeeInterface>(`0/sr/4/access/users/${employee.id ?? -1}/removeAccess/`)
              .pipe(
                alertsPipe(this.alerts,
                  'Employee Access Removed',
                  "Access Update Failed",
                  true,
                  'Failed to update access for employee',
                  "User access to StarRez has been removed",
                )
              );
          }
          throw new Error();
        })
      );
  }

  upd_employee_restore_access(
    employee: EmployeeInterface
  ): Observable<EmployeeInterface> {
    return this.dialog.openApproveDialog("Restore Access",{
          details: `Are you sure you want to restore access to: ${employee.fullname}?\n`,
          true_text: "Confirm",
          false_text: "Cancel"
        }
      )
      .pipe(
        switchMap((confirmed) => {
          if (confirmed) {
            // TODO: add data and make post
            return this.http.get<EmployeeInterface>(`0/sr/4/access/users/${employee.id ?? -1}/restoreAccess/`)
              .pipe(
                alertsPipe(this.alerts,
                  'Employee Access Restored',
                  "Access Update Failed",
                  true,
                  'Failed to update access for employee',
                  "User access to StarRez has been restored",
                )
              );
          }
          throw new Error();
        })
      );
  }

  upd_employee_set_bot_user(
    employee: EmployeeInterface
  ): Observable<EmployeeInterface> {
    return this.dialog.openApproveDialog("Set as Test User",{
          details: `Set user as a test user: ${employee.fullname}?\n`,
          true_text: "Confirm",
          false_text: "Cancel"
        }
      )
      .pipe(
        switchMap((confirmed) => {
          if (confirmed) {
            // TODO: add data and make post
            return this.http.post<EmployeeInterface>(`0/sr/4/access/users/${employee.id ?? -1}/bot-user/`,null)
              .pipe(
                alertsPipe(this.alerts,
                  'Test user added',
                  'Failed to Update',
                  true,
                  'Employee was not updated as a testing user.',
                )
              )
          }
          throw new Error();
        })
      );
  }  

  bulk_change_employee_position(
    employee_ids: number[],
    position_id: number
  ): Observable<EmployeeInterface[]> {
    return this.http.post<EmployeeInterface[]>(`0/sr/4/access/users/position/`,
      {
        "ids": employee_ids,
        "new_positionid" : position_id
      })
      .pipe(
        alertsPipe2(
          this.alerts,
          {
            on_success_label: 'Bulk Position Update',
            on_fail_label: 'Bulk Position Update Failed',
            on_fail_http_error_details: false,
            on_fail_error_message: 'An error occurred while attempting to bulk update employees',
            on_success_message: `Successfully updated ${employee_ids.length} employee's position.`}
        )
      )
  }
  change_user_position(
    user_id: number,
    position_id: number
  ): Observable<any> {
    return this.http.post<any>(
      `0/sr/4/access/users/${user_id}/position/`,
      {"new_positionid" : position_id}
      ).pipe(
        alertsPipe2(
          this.alerts,
          {
            on_success_label: 'Position Changed',
            on_fail_label: 'Position Change Failed',
            on_fail_http_error_details: false,
            on_fail_error_message: '',
            on_success_message: `Successfully updated employee's position.`}
        )
    );
  }
}
