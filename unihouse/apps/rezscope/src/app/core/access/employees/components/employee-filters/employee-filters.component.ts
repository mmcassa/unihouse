import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeFiltersInterface } from '../../interfaces/employee-filters.interface';
import { EmploymentPositionInterface } from '../../../positions/position.interface';
import { TuiError, TuiTextfield } from '@taiga-ui/core';
import { TuiSearch } from '@taiga-ui/layout';
import { TuiFieldErrorPipe, TuiSwitch } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { GenericFiltersComponent } from '@unihouse/core';
import { PositionSelectorComponent } from '../../../positions';

@Component({
  selector: 'app-employee-filters',
  imports: [
    CommonModule,
    PositionSelectorComponent,
    ReactiveFormsModule,
    TuiError,
    TuiFieldErrorPipe,
    TuiSearch,
    TuiSwitch,
    TuiTextfield,
  ],
  templateUrl: './employee-filters.component.html',
  styleUrl: './employee-filters.component.scss'
})
export class EmployeeFiltersComponent extends GenericFiltersComponent<EmployeeFiltersInterface> {
  protected override filters = ['search','_all','positionid'];

  protected on_position_selected(event: EmploymentPositionInterface | number | undefined) {
    this.form.get('positionid')?.setValue(event ? (typeof event === 'number' ? event : event.id) : undefined);
  }
}
