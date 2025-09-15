import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PositionLabelComponent } from '../../../positions/components/position-label/position-label.component';
import { EmployeeLabelComponent } from '../employee-label/employee-label.component';
import { EmployeePositionHistory } from '../../employee';
import { NamedTemplateDirective, DynamicTableComponent, AbstractDynamicTableManagerComponent, TableColumnOption } from '@unihouse/core';

@Component({
  selector: 'app-employee-position-history-table',
  imports: [
    CommonModule,
    DynamicTableComponent,
    EmployeeLabelComponent,
    NamedTemplateDirective,
    PositionLabelComponent,
  ],
  templateUrl: './employee-position-history-table.component.html',
  styleUrl: './employee-position-history-table.component.scss'
})
export class EmployeePositionHistoryTableComponent extends AbstractDynamicTableManagerComponent<EmployeePositionHistory> {
  protected ALLOWED_COLUMNS: (string|TableColumnOption)[] = [
      {title: 'Start Date', property: 'startdate'},
      { title: 'Username',property: 'employee'},
      {title: 'Position', property: 'position'},
      {title: 'End Date', property: 'enddate'},
      { title: 'End Reason',property: 'endreason'}
    ];

  
}
