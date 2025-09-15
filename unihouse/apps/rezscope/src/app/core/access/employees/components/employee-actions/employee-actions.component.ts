import { Component, inject, input, model, OnInit, output } from '@angular/core';
import { TuiAppearance, TuiButton, TuiDataList, TuiDropdown, TuiHint, TuiSizeL, TuiSizeS, TuiSizeXS, TuiTextfield } from '@taiga-ui/core';
import { EmployeeInterface } from '../../employee';
import { TuiStatus } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiInputModule } from '@taiga-ui/legacy';
import { GenericAction } from '@unihouse/core';
import { EmployeeService } from '../../employee.service';
import { TuiActiveZone } from '@taiga-ui/cdk';

@Component({
  selector: 'app-employee-actions',
  imports: [
    TuiActiveZone,
    TuiButton,
    TuiDropdown,
    TuiButton,
    TuiAppearance,
    TuiHint,
    TuiTable,
    TuiStatus,
    FormsModule,
    TuiInputModule,
    TuiTextfield,
    ReactiveFormsModule,
    TuiDataList,
    TuiDropdown
    
  ],
  templateUrl: './employee-actions.component.html',
  styleUrl: './employee-actions.component.scss'
})
export class EmployeeActionsComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);



  protected dropdown_open: boolean = false;
  protected actions: GenericAction[] = [];
  protected loaded_actions: boolean = false;

  employee = model.required<EmployeeInterface|EmployeeInterface[]>();
  onChange = output<EmployeeInterface>();
  size = input<TuiSizeL|TuiSizeXS>('xs');

  dropdown_size: TuiSizeS = 's';

  ngOnInit(): void {
    let employees = this.employee();
    if (Array.isArray(employees) && employees.length === 1)
      employees = employees[0]
    this.actions = this.employeeService.get_employee_actions(employees);
    this.loaded_actions = true;
  }

  protected execute(action: GenericAction) {
    if (action.action) {
      action.action().subscribe(
        {
          next: (v: any) => {
            this.onChange.emit(v);
            this.employee.set(v)
          }
        }
      );
    }
  }

}
