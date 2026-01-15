import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiFieldErrorPipe, TuiSelect, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { PositionSelectorComponent } from '../../../positions/components/position-selector/position-selector.component';
import { EmployeeService } from '../../employee.service';
import { TuiButton, TuiError, TuiLabel, TuiSizeL, TuiSizeS, TuiTextfield } from '@taiga-ui/core';
import { EmployeeInterface } from '../../interfaces/employee.interface';
import { EmploymentPositionInterface } from '../../../positions/position.interface';
import { AsyncPipe } from '@angular/common';
import { tuiIsFalsy, TuiValidationError } from '@taiga-ui/cdk';
import { of, interval, scan, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-employee',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiSelect,
    PositionSelectorComponent,
    TuiTextfield,
    TuiLabel,
    TuiButton,
    TuiError,
    TuiFieldErrorPipe
  ],
  providers: [
    tuiValidationErrorsProvider({
            required: 'Value is required',
            min: 'Please select a valid position'
        }),
  ],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent {
  fb = inject(FormBuilder);
  employeeService = inject(EmployeeService);

  size = input<TuiSizeL|TuiSizeS>('m');

  results = output<EmployeeInterface|null>();

  submission_error: TuiValidationError|null = null;

  protected form;

  constructor() {
    this.form = this.fb.group({
      'positionid' : new FormControl<EmploymentPositionInterface|null>(null,[Validators.required,Validators.min(0)]), // [null,[Validators.required,Validators.min(0)]],
      'fullname' : ['',Validators.required],
      'username' : ['',Validators.required],
      'secuserid' : [null]

    });
  }

  private transform_value(val:any): Partial<EmployeeInterface> {
    val.positionid = val.positionid.id
    const emp = val as Partial<EmployeeInterface>;
    
    return emp;
  }

  protected submit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
    }
    const emp = this.transform_value(this.form.value);

    this.employeeService.create_employee(emp).subscribe({
      next: (e) => {
        this.results.emit(e);
        this.submission_error = null;
      }, error: (err) => {
        this.submission_error = new TuiValidationError(err);
      }
    })
  }
}
