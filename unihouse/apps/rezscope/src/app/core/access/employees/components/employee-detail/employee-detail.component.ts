import { Component, inject, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EmployeeInterface, EmployeePositionHistory } from '../../interfaces/employee.interface';
import { EmployeeActionsComponent } from '../employee-actions/employee-actions.component';
import { EmployeeLabelComponent } from '../employee-label/employee-label.component';
import { EmployeePositionHistoryTableComponent } from '../employee-position-history-table/employee-position-history-table.component';
import { TuiTitle } from '@taiga-ui/core';
import { TuiHeader } from '@taiga-ui/layout';
import { PositionLabelComponent } from '../../../positions/components/position-label/position-label.component';
import { EmployeeService } from '../../employee.service';
import { SecurityUserChangeLogTableComponent } from '../../../history/security-user-change-log-table/security-user-change-log-table.component';

@Component({
  selector: 'app-employee-detail',
  imports: [
    EmployeeActionsComponent,
    EmployeeLabelComponent,
    PositionLabelComponent,
    EmployeePositionHistoryTableComponent,
    SecurityUserChangeLogTableComponent,
    TuiTitle,
    TuiHeader,
  ],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit,OnChanges {
  private readonly employeeService = inject(EmployeeService);

  employee = input<EmployeeInterface>();

  history: EmployeePositionHistory[] = [];

  get emp(): EmployeeInterface | undefined {
    return this.employee();
  }

  constructor() {
  }
  ngOnInit(): void {
    this.fetch_history();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('employee' in changes) {
      this.fetch_history()
    }
  }

  protected fetch_history() {
    this.employeeService.get_employee_position_history_by_employee(this.employee()?.id ?? -1)
      .subscribe({
        next: objs => {this.history = objs;}
      });
  }
}
