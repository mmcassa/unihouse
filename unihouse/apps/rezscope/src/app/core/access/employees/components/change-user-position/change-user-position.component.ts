import { Component, inject } from '@angular/core';
import { TuiAlertService, TuiAppearance, TuiButton, TuiDataList, TuiDialogContext, TuiHint, TuiLabel, TuiLoader, TuiSelect, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeInterface } from '../../interfaces/employee.interface';
import { PositionLabelComponent } from '../../../positions/components/position-label/position-label.component';
import { PositionSelectorComponent } from '../../../positions/components/position-selector/position-selector.component';
import { EmployeeService } from '../../employee.service';
import { EmploymentPositionInterface } from '../../../positions/position.interface';

/**  If exists_on_merge is **true**, then the group exists on the **new** position and not on the old, inverse if false.
 * 
 * */

@Component({
  selector: 'app-change-user-position',
  standalone: true,
  imports: [
    PositionLabelComponent,
    PositionSelectorComponent,
    TuiButton,
    TuiTextfield,
    ReactiveFormsModule,
    TuiDataList,
    TuiDataListWrapper,
    TuiHint,
    TuiAppearance
],
  templateUrl: './change-user-position.component.html',
  styleUrl: './change-user-position.component.scss'
})
export class ChangeUserPositionComponent {
 // Dialog info
  public readonly context = injectContext<TuiDialogContext<number, EmployeeInterface|EmployeeInterface[]|null>>();
  private readonly employeeService = inject(EmployeeService);
  private readonly alert = inject(TuiAlertService);
  private readonly fb = inject(FormBuilder);

  protected form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      user_id: [this.context.id,Validators.required],
      position: [null,Validators.required]
    });
    this.form.get('position')?.valueChanges.subscribe((x) => {
    });
  }

  protected get current_positionid(): number {
    return Array.isArray(this.context.data) ? -1 : (this.context.data.positionid ?? -1);
  }

  protected position_selected(position: EmploymentPositionInterface|undefined|null) {
    this.form.get('position')?.setValue(position ? position.id : null);
  }

  protected postMerge(): void {
    if (! this.form.valid) {
      this.form.markAllAsTouched();
      return
    }
    if (Array.isArray(this.context.data)) {
      this.employeeService.bulk_change_employee_position(
        this.context.data.map(x => x.id).filter(x => x !== undefined),
        this.form.controls['position']?.value
      ).subscribe({
        next: (res) => {
          this.context.completeWith(Number(this.form.get('position')?.value ?? -1));
        },
      })
    } else {
      this.employeeService.change_user_position(this.context.data.id ?? -1,this.form.controls['position']?.value,).subscribe({
        next: (res) => {
          this.context.completeWith(Number(this.form.get('position')?.value.pk ?? -1));
        }, error: (err) => {
          
        }, complete: () => {

        }
      })
    }
  }
} 
