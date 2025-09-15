import { Component, inject } from '@angular/core';
import { PaginationWrapperComponent, PaginationOptions } from '@unihouse/core';
import { EmployeePositionHistoryTableComponent, EmployeePositionHistory, EmployeeService } from 'apps/rezscope/src/app/core/access/employees';
import { SecurityUserChangeLogTableComponent } from 'apps/rezscope/src/app/core/access/history/security-user-change-log-table/security-user-change-log-table.component';

@Component({
  selector: 'app-sec-user-history-page',
  imports: [
      SecurityUserChangeLogTableComponent,
      EmployeePositionHistoryTableComponent,
      PaginationWrapperComponent,
    ],
  templateUrl: './sec-user-history-page.component.html',
  styleUrl: './sec-user-history-page.component.scss'
})
export class SecUserHistoryPageComponent {
  private readonly employeeService = inject(EmployeeService);

  protected position_history: EmployeePositionHistory[] = [];
  protected paging: PaginationOptions = {
      page: 0,
      page_size: 10,
      total_items: 0,
      total_pages: 1
    };
  

  constructor() {
    this.fetch_position_history();
  }
  
  protected fetch_position_history() {
    this.employeeService.get_employee_position_history(this.paging)
      .subscribe({
          next: d => { this.position_history = d; },
          error: err => {
            console.error('Failed to load employee position history data');
          }
        }
      );
  }
}
