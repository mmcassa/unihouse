import { Component, signal } from '@angular/core';
import { EmployeeInterface } from '../../employee';
import { CommonModule } from '@angular/common';
// import { EmployeeActionsComponent } from '../employee-actions/employee-actions.component';
import { PositionLabelComponent } from '../../../positions/components/position-label/position-label.component';
import { EmployeeLabelComponent } from '../employee-label/employee-label.component';
import { DynamicTableComponent, NamedTemplateDirective, AbstractDynamicTableManagerComponent, TableColumnOption } from '@unihouse/core';


@Component({
  selector: 'app-employee-table',
  imports: [
    CommonModule,
    DynamicTableComponent,
    // EmployeeActionsComponent,
    EmployeeLabelComponent,
    NamedTemplateDirective,
    PositionLabelComponent
    
  ],
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.scss'
})
export class EmployeeTableComponent extends AbstractDynamicTableManagerComponent<EmployeeInterface> {
  protected ALLOWED_COLUMNS:(string|TableColumnOption)[] = [
    'id',
    { title: 'Name',property: 'fullname'},
    { title: 'Username',property: 'username'},
    { title: 'Description',property: 'description'},
    {title: 'Position', property: 'positionid'},
    // { title: 'Actions',property: '$actions'}
  ];

  item_as_signal(item: any) {
    return signal(item)
  }
}
