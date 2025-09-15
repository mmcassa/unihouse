import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EmploymentPositionInterface } from '../../position.interface';
import { PositionLabelComponent } from '../position-label/position-label.component';
import { DynamicTableComponent, NamedTemplateDirective, AbstractDynamicTableManagerComponent, TableColumnOption } from '@unihouse/core';

@Component({
  selector: 'app-position-table',
  imports: [
    CommonModule,
    DynamicTableComponent,
    NamedTemplateDirective,
    PositionLabelComponent,
  ],
  templateUrl: './position-table.component.html',
  styleUrl: './position-table.component.scss'
})
export class PositionTableComponent extends AbstractDynamicTableManagerComponent<EmploymentPositionInterface> {
  protected ALLOWED_COLUMNS: (string|TableColumnOption)[] = [
    'id',
    {property: 'title',title: 'Position'},
    {property: 'department', title: 'Department'},
    {property: 'description', title: 'Description'},
    {property: 'stafftype', title: 'Position Type'}
  ]
  
}
