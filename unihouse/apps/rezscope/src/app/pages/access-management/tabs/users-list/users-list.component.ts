import { Component, inject, model } from '@angular/core';
import { EmployeeInterface } from '../../../../core/access/employees/employee';
import { PaginationOptions } from '@unihouse/core';
import { PaginationWrapperComponent } from '@unihouse/core';
import { EmployeeTableComponent } from '../../../../core/access/employees/components/employee-table/employee-table.component';
import { AddEmployeeButtonComponent } from '../../../../core/access/employees/components/add-employee-button/add-employee-button.component';
import { EmployeeFiltersInterface } from '../../../../core/access/employees/interfaces/employee-filters.interface';

import { TuiButton, TuiDataList, TuiDropdown, TuiGroup, TuiTextfield } from '@taiga-ui/core';
import { TuiExpand } from '@taiga-ui/experimental';
import { TuiChevron } from '@taiga-ui/kit';
import { EmployeeFiltersComponent } from '../../../../core/access/employees/components/employee-filters/employee-filters.component';
import { EmployeeService } from '../../../../core/access/employees/employee.service';
import { TuiObscured } from '@taiga-ui/cdk';
import { EmployeeActionsComponent } from '../../../../core/access/employees/components/employee-actions/employee-actions.component';

interface ActionsMenu {
  name: string;
  command: () => any;
  disabled?: boolean;
  
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    AddEmployeeButtonComponent,
    EmployeeActionsComponent,
    EmployeeTableComponent,
    EmployeeFiltersComponent,
    PaginationWrapperComponent,
    TuiButton,
    TuiDataList,
    TuiChevron,
    TuiDropdown,
    TuiExpand,
    TuiGroup,
    TuiObscured,
    TuiTextfield,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {

  // user must be provided to load 
  filters = model<EmployeeFiltersInterface>({});
  private readonly employeeService = inject(EmployeeService);
  protected readonly additional_actions: ActionsMenu[] = [
    {
      name: 'Import Employees',
      command: () => this.open_bulk_import(),
      disabled: false
    }
  ];
  protected show_additional_actions: boolean = false;
  protected show_filters: boolean = false;

  protected show_bulk_actions: boolean = false;

  protected paging: PaginationOptions = {
      page: 0,
      total_items: 0,
      total_pages: 1,
      page_size: 20
  }

  protected users: EmployeeInterface[] = [];
  protected selected: EmployeeInterface[] = [];

  protected readonly sizes = ['l', 'm', 's'] as const;
  protected size = this.sizes[2];

  constructor() {
    this.fetch_data();
  }
  
  protected search_updated(employee_filters: EmployeeFiltersInterface|null) {
    if (employee_filters)
      this.filters.set(employee_filters)
    this.fetch_data();

  }

  protected fetch_data() {
      this.employeeService.get_employees(
        this.filters(),
        this.paging
      )
        .subscribe({
            next: d => { this.users = d; },
            error: err => {
              console.error('Failed to load position data');
            }
          }
        );
  }

  protected open_entry_actions() {
    this.show_bulk_actions = !this.show_bulk_actions;
  }

  protected onObscured(obscured: boolean): void {
        if (obscured) {
            this.show_bulk_actions = false;
        }
    }
 
    protected onActiveZone(active: boolean): void {
        this.show_bulk_actions = active && this.show_bulk_actions;
    }

  protected open_bulk_import() {
    this.employeeService.open_bulk_import_employees().subscribe((val) => {
      console.log(val)
    })
  }

  protected call_action(f: () => any) {
    f();
  }
}
