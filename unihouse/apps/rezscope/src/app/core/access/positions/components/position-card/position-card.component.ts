import { Component, inject, input, output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk';
import {  tuiDialog, TuiAppearance, TuiButton, TuiDataList, TuiDropdown, TuiHint, TuiIcon, TuiSurface, TuiTextfield, TuiError } from '@taiga-ui/core';
import { TuiBadge, TuiChip, TuiFieldErrorPipe, TuiInputInline, TuiSwitch, TuiTooltip, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { MergePositionComponent } from '../merge-position/merge-position.component';
import { EmploymentPositionInterface } from '../../position.interface';
import { SecurityUserGroup } from '../../../access.interface';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { TuiInputModule } from '@taiga-ui/legacy';
import { EmployeeTableComponent } from '../../../employees/components/employee-table/employee-table.component';
import { EmployeeInterface } from '../../../employees/employee';
import { SecuritygroupChipListComponent } from '../../../securitygroups/securitygroup-chip-list/securitygroup-chip-list.component';
import { AsyncPipe } from '@angular/common';
import { distinctUntilChanged } from 'rxjs';
import { PositionService } from '../../position.service';
import { EmployeeService } from '../../../employees/employee.service';
import { PaginationWrapperComponent, PaginationOptions, DEFAULT_PAGING_OPTIONS } from '@unihouse/core';


interface UserPositionExt extends EmploymentPositionInterface {
  editing_title?: boolean;
}

@Component({
  selector: 'app-position-card',
  imports: [
    AsyncPipe,
    TuiIcon,
    TuiButton,
    TuiCardLarge,
    TuiBadge,
    TuiError,
    TuiFieldErrorPipe,
    TuiHeader,
    TuiAppearance,
    TuiSurface,
    TuiChip,
    TuiTooltip,
    TuiSwitch,
    TuiHint,
    TuiTable,
    FormsModule,
    TuiInputModule,
    TuiTextfield,
    TuiInputInline,
    ReactiveFormsModule,
    TuiDataList,
    TuiDropdown,
    EmployeeTableComponent,
    SecuritygroupChipListComponent,
    PaginationWrapperComponent,
  ],
  providers: [
    tuiValidationErrorsProvider({
      maxLength: ({requiredLength}: {requiredLength: string}) => `Max. ${requiredLength} chars`
    })
  ],
  templateUrl: './position-card.component.html',
  styleUrl: './position-card.component.scss'
})
export class PositionCardComponent {
  // user must be provided to load 
  position = input<EmploymentPositionInterface>();
  // Used to notify that the position has been deleted
  removed = output<number>();

  // inject services
  private readonly positionService = inject(PositionService);
  private readonly employeeService = inject(EmployeeService);
  private readonly merge_dialog = tuiDialog(MergePositionComponent, {
        dismissible: true,
        label: 'Merge Position',
    });

  protected _position!: UserPositionExt;

  protected _groups: SecurityUserGroup[] = [];

  protected _positionForm!: FormGroup;
  protected _positionTitleForm!: FormGroup;
  protected positionTitleUpdateError?: TuiValidationError;
  protected positionUpdateError?: TuiValidationError;

  protected employees: EmployeeInterface[] = [];
  protected show_inactive_employees: boolean = false;
  protected employees_paging: PaginationOptions = DEFAULT_PAGING_OPTIONS; 


  protected readonly sizes = ['l', 'm', 's'] as const;
  protected size = this.sizes[2];  

  
  ngOnInit() {
    const tmp = this.position();
    if (tmp != undefined) {
      this._position = tmp;
      this.get_employees();
      // Create Form
      this._position.editing_title = false;
      this._positionForm = new FormGroup({
        code: new FormControl(this._position.code,{updateOn: 'blur',validators: [Validators.maxLength(10)]}),
        is_prostaff: new FormControl(this._position.is_prostaff),
        has_community: new FormControl(this._position.has_community),
        staged: new FormControl(this._position.staged),
        archive: new FormControl(this._position.archive),
        department: new FormControl(this._position.department,{updateOn: 'blur',validators: [Validators.maxLength(30)]})
      });
      this._positionTitleForm = new FormGroup({
        title: new FormControl(this._position.title,Validators.required)
      });
      this.track_form_changes();

      this._positionForm.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
            this._positionForm.markAsTouched();
        });
      
      
      this.positionService.get_position_securitygroups(this._position.id ?? -1).subscribe({
        next: res => {
          this._groups = res;
        }
      });

      
    }
  }

  private track_form_changes() {
    this._positionForm.valueChanges.subscribe({
        next: (res) => {
          if (this._positionForm.errors) {
            this.positionUpdateError = new TuiValidationError(this._positionForm.errors);
            return;
          }

          this.positionUpdateError = undefined;
          this.patchPosition();
        }, error: (err) => {
          this.positionUpdateError = new TuiValidationError(err);
        }
    });
  }

  protected get codeEmpty(): boolean {
    return this._positionForm.get('code')!.value === '' || this._positionForm.get('code')!.value == null;
  }

  protected get departmentEmpty(): boolean {
    return this._positionForm.get('department')!.value === '' || this._positionForm.get('department')!.value == null;
  }

  protected get titleEmpty(): boolean {
    return this._positionTitleForm.get('title')!.value === '' || this._positionForm.get('title')!.value == null;
  }
  /** Executes a PATCH request to adjust the title of the position if the current value is different that the existing one */
  protected savePositionTitle(pos: UserPositionExt) {
    pos.editing_title = false;    
    if (this._positionTitleForm.get('title')!.value != this._position!.title){
      this.positionService.upd_position_title(pos.id ?? -1,this._positionTitleForm.get('title')!.value)
        .subscribe({
          next: (res) => {

            // this.alerts.open('Title updated successfully',{label: 'Position Updated',appearance: "success",autoClose: 5000})
            this.positionTitleUpdateError = undefined;
            this._position.title = res.title;
          }, error: (err) => {
            this.positionTitleUpdateError = new TuiValidationError('Failed to update position title');
          }
      });
    }
  }

  /**
   * 
   * @returns 
   */
  private patchPosition() {
    if (this._position != undefined) {
      if (! this._positionForm.valid) {
        this._positionForm.markAllAsTouched();
        return
      }
      this.positionService.upd_position(this._position,this._positionForm.value).subscribe();
    }
  }

  /**
   * Clears the position's staged bit
   */
  protected approvePosition() {
    const id = this._position.id;
    if (id == null) {
      return;
    }
    this.positionService.upd_position_set_approved(id).subscribe({
      next: () => this._position.staged = false
    })
  }

  protected mergePosition() {
    this.merge_dialog(this._position).subscribe();
  }

  protected removePosition() {
    this.positionService.del_position(this._position).subscribe({
      next: () => this.removed.emit(0)
    })
  }

  protected removeGroup(group:SecurityUserGroup) {
    this.positionService.position_remove_group(this._position,group).subscribe();
  }

  /**
   * Fetches a list of employees with the current positionid 
   * @returns void
   */
  protected get_employees() {
    const id = this._position?.id;
    if (typeof id !== 'number') {
      return;
    }
    this.employeeService.get_employees({'positionid': id},
      this.employees_paging
    )
    .subscribe({
      next: res => {
        this.employees = res;
      }
    });
  }
}
