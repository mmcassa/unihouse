import { Component, output } from '@angular/core';
import { AbstractPositionDetail } from '../../abstract-position';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk';
import { TuiAppearance, TuiButton, TuiDataList, tuiDialog, TuiDropdown, TuiError, TuiHint, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { distinctUntilChanged } from 'rxjs';
import { SecurityUserGroup } from '../../../access.interface';
import { EmployeeInterface } from '../../../employees/interfaces/employee.interface';
import { MergePositionComponent } from '../merge-position/merge-position.component';
import { EmploymentPositionInterface } from '../../position.interface';
import { AsyncPipe } from '@angular/common';
import { PaginationWrapperComponent,PaginationOptions, DEFAULT_PAGING_OPTIONS } from '@unihouse/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiFieldErrorPipe, TuiChip, TuiTooltip, TuiSwitch, TuiInputInline } from '@taiga-ui/kit';
import { TuiHeader } from '@taiga-ui/layout';
import { TuiInputModule } from '@taiga-ui/legacy';
import { EmployeeTableComponent } from '../../../employees/components/employee-table/employee-table.component';
import { SecuritygroupChipListComponent } from '../../../securitygroups/securitygroup-chip-list/securitygroup-chip-list.component';
import { PositionLabelComponent } from '../position-label/position-label.component';
import { EmployeeFiltersComponent } from '../../../employees/components/employee-filters/employee-filters.component';
import { EmployeeFiltersInterface } from '../../../employees/interfaces/employee-filters.interface';
import { PositionEmployeeFilters } from '../../position.service';


interface UserPositionExt extends EmploymentPositionInterface {
  editing_title?: boolean;
}


@Component({
  selector: 'app-position-detail',
  imports: [
    AsyncPipe,
    TuiIcon,
    TuiButton,
    TuiError,
    TuiFieldErrorPipe,
    TuiHeader,
    TuiAppearance,
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
    EmployeeFiltersComponent,
    SecuritygroupChipListComponent,
    PositionLabelComponent,
    PaginationWrapperComponent,
  ],
  templateUrl: './position-detail.component.html',
  styleUrl: './position-detail.component.scss'
})
export class PositionDetailComponent extends AbstractPositionDetail {
  // user must be provided to load 
  
  // Used to notify that the position has been deleted
  removed = output<number>();
  
  // protected readonly employeeService = inject(EmployeeService);

  // inject services
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
  protected employee_filters!: Partial<EmployeeFiltersInterface>;
  protected employees_paging: PaginationOptions = DEFAULT_PAGING_OPTIONS; 


  protected readonly sizes = ['l', 'm', 's'] as const;
  protected size = this.sizes[2];  

  
  override ngOnInit() {
    super.ngOnInit();
    const tmp = this.position;
    if (tmp != undefined) {
      this._position = tmp;
      // Create Form
      this._position.editing_title = false;
      this._positionForm = new FormGroup({
        title: new FormControl(this._position.title,{updateOn: 'blur',validators: [Validators.required,Validators.maxLength(100)]}),
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
      
      this.get_employees();

      
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

  protected update_employee_filters(filters: EmployeeFiltersInterface) {
    this.employee_filters = filters;
    this.get_employees();
  }

  /**
   * Fetches a list of employees with the current positionid 
   * @returns void
   */
  protected get_employees() {
    const id = this._position?.id;
    const filters = this.employee_filters;
    if (typeof id !== 'number') {
      return;
    }
    if (typeof filters === 'undefined') {
      return
    }

    if (filters.positionid === undefined && typeof filters.positionid === 'number') {
      return;
    }
    this.positionService.get_employees(
      filters as PositionEmployeeFilters,
      this.employees_paging
    )
    .subscribe({
      next: res => {
        this.employees = res;
      }
    });
  }

}
