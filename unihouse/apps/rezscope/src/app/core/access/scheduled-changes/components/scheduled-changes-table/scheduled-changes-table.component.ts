import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TuiBadge, TuiPulse } from '@taiga-ui/kit';
import { ScheduledChangeTypeAppearancePipe } from '../../pipes/scheduled-change-type-appearance.pipe';
import { TuiHint } from '@taiga-ui/core';
import { ScheduledChangeTypePipe } from '../../pipes/scheduled-change-type.pipe';
import { AbstractDynamicTableManagerComponent, DynamicTableComponent, NamedTemplateDirective, TableColumnOption } from '@unihouse/core';
import { ScheduledPositionChangeInterface } from '../../../access.interface';
import { EmployeeLabelComponent } from '../../../employees';
import { PositionLabelComponent } from '../../../positions';

@Component({
  selector: 'app-scheduled-changes-table',
  imports: [
    CommonModule,
    DatePipe,
    DynamicTableComponent,
    EmployeeLabelComponent,
    NamedTemplateDirective,
    PositionLabelComponent,
    ScheduledChangeTypeAppearancePipe,
    ScheduledChangeTypePipe,
    TuiBadge,
    TuiHint,
    TuiPulse
  ],
  templateUrl: './scheduled-changes-table.component.html',
  styleUrl: './scheduled-changes-table.component.scss'
})
export class ScheduledChangesTableComponent extends AbstractDynamicTableManagerComponent<ScheduledPositionChangeInterface> {
  protected currentDate: Date = new Date();
  protected ALLOWED_COLUMNS: (string|TableColumnOption)[] = [
    'id',
    {
      property: 'username',
      title: 'Employee'
    },
    {
      title: 'Position',
      property: 'positionname'
    },
    {
      title: 'Type',
      property: 'type'
    },
    {
      title: 'Date of Change',
      property: 'actiondatestart'
    },
    'datedetected'
  ];
}
