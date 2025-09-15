import { Component, ElementRef, inject, TemplateRef, viewChild } from '@angular/core';
import { TuiAlertService, TuiAppearance, TuiButton, TuiDataList, TuiDialogContext, TuiDialogService, TuiHint, TuiIcon, TuiLabel, TuiLoader, TuiSelect, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import { TuiCheckbox, TuiChip, TuiDataListWrapper, tuiItemsHandlersProvider, TuiTooltip } from '@taiga-ui/kit';
import { TuiContext, TuiLet, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiSelectModule } from '@taiga-ui/legacy';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { PositionLabelComponent } from '../position-label/position-label.component';
import { PositionService } from '../../position.service';
import { SecurityUserGroupCompare } from '../../../access.interface';
import { EmploymentPositionInterface } from '../../position.interface';

export interface MergePositionDialogInput {
  from: EmploymentPositionInterface;
}

export interface MergePositionDialogOutput {
  merge_users: boolean;
  users_confirm_position: boolean;
  add_groups?: number[];
  remove_groups?: number[];
  update_user_groups: boolean;
}
/**  If exists_on_merge is **true**, then the group exists on the **new** position and not on the old, inverse if false.
 * 
 * */


const STRINGIFY_POSTION: TuiStringHandler<EmploymentPositionInterface> = (item: EmploymentPositionInterface) =>
  `${item.title} (${item.code ?? '-'})`

@Component({
  selector: 'app-merge-position',
  standalone: true,
  imports: [
    TuiButton,
    TuiCheckbox,
    TuiLabel,
    TuiTitle,
    TuiTextfield,
    PositionLabelComponent,
    ReactiveFormsModule,
    TuiLet,
    TuiLoader,
    TuiDataList,
    TuiDataListWrapper,
    TuiSelectModule,
    AsyncPipe,
    TuiChip,
    TuiIcon,
    TuiHint,
    TuiTooltip,
    TuiAppearance],
  templateUrl: './merge-position.component.html',
  styleUrl: './merge-position.component.scss',
  providers: [tuiItemsHandlersProvider({stringify:STRINGIFY_POSTION})]
})
export class MergePositionComponent {
  // Dialog info
  dialog_content = viewChild<ElementRef>('#dialogContent')
  private readonly positionService = inject(PositionService);
  private readonly fb = inject(FormBuilder);
  private readonly dialogs = inject(TuiDialogService);
  public readonly context = injectContext<TuiDialogContext<number, EmploymentPositionInterface|null>>();
  private readonly alert = inject(TuiAlertService);
  
  // Merge Options 
  protected loading_positions: boolean = false;
  protected loaded_positions: boolean = false;
  private merge_pos_sub: BehaviorSubject<EmploymentPositionInterface[]>  = new BehaviorSubject([] as EmploymentPositionInterface[]);
  protected merge_positions?: Observable<EmploymentPositionInterface[]> =this.merge_pos_sub.asObservable();
  protected select_positions?: EmploymentPositionInterface;
  protected selected_positionid = new FormControl<number | null>(null);
  protected form: FormGroup;
  // Groups
  protected loading_group_diffs: boolean = false;
  protected loaded_group_diffs: boolean = false;
  protected group_diffs: SecurityUserGroupCompare[] = [];

  

  constructor() {
    this.form = this.fb.group({
      position: [null,Validators.required],
      merge_users: [{value: true,disabled: true}],
      users_confirm_position: [{value: false,disabled: true}],
      update_user_groups: [{value: false,disabled: true}],
    });
    this.form.get('position')?.valueChanges.subscribe((x) => {
      if (x != null) {
        this.form.get('merge_users')?.enable();
      }
      this.fetchDifferingGroups(x);
    });
    this.form.get('merge_users')?.valueChanges.subscribe((x) => {
      if (x) {
        this.form.get('users_confirm_position')?.enable();
        this.form.get('update_user_groups')?.enable();
      } else {
        this.form.get('users_confirm_position')?.disable();
        this.form.get('update_user_groups')?.enable();
      }
    });
    this.fetchPositions();
    
  }

  protected get title(): string {
    return this.context.data.title || '?'
  }

  @tuiPure
  protected stringify(items: readonly EmploymentPositionInterface[]
    ): TuiStringHandler<TuiContext<number>> {
      const map = new Map(items.map(({id, title}) => [id, title] as [number, string]));
 
      return ({$implicit}: TuiContext<number>) => map.get($implicit) || '';
  }

  /**
   * Gets the list of positions that are not equal to the merging positionid 
   */
  private fetchPositions() {
    const id = this.context.data.id
    if (typeof id !== 'number') {
      console.log('no position id provided')
      return;
    }
    this.loaded_positions = false;
    this.loading_positions = true;
    this.positionService.get_positions({'id_ne' : id})
      .subscribe({
        next: (res) => {
          this.merge_pos_sub.next(res);
          this.loaded_positions = true;
        }, complete: () => {
          this.loading_positions = false
        }
      });
  }

  /**
   * Gets the list of differing groups 
   * @param new_position_id id of the selected position to merge with
   */
  private fetchDifferingGroups(new_position_id: number) {
    this.loaded_group_diffs = true;
    const id = this.context.data.id
    if (typeof id !== 'number') {
      console.log('no position id provided')
      return;
    }
    this.positionService.get_position_groups_comparison(
        id,
        new_position_id
      )
      .subscribe({
        next: (res) => {
          let groups: SecurityUserGroupCompare[] = res.map(x => 
            ({...x,apply_change: false})
          );
          this.group_diffs = groups;
          this.loaded_group_diffs = true;
        }, complete: () => {
          this.loading_group_diffs = false;
        }
      });
  }

  protected showDialog(content: TemplateRef<TuiDialogContext>): void {
    this.dialogs.open(content, {dismissible: true}).subscribe();

}

  protected submit(val: boolean): void {
    this.context.completeWith(-1);
    
  }

  protected postMerge(): void {
    const id = this.context.data.id;
    if (typeof id !== 'number') {
      return;
    }

    if (! this.form.valid) {
      this.form.markAllAsTouched();
      return
    }
    let addList: number[] = [];
    let removeList: number[] = [];
    let new_pos: number = this.form.get('position')?.value;
    for (let i of this.group_diffs) {
      if (i.apply_change) {
        if (i.exists_on_merge) {
          removeList.push(i.id);
        } else {
          addList.push(i.id);
        }
      }
    }

    this.positionService.merge_position(
      id,
      new_pos,
      this.form.get('merge_users')?.value,
      this.form.get('users_confirm_position')?.value,
      addList,removeList,
      this.form.get('update_user_groups')?.value,
    ).subscribe({
        next: (res) => {
          this.context.completeWith(new_pos);
        }, error: (err) => {
          this.alert.open('Error occurred while attempting to change the position.',{label: 'Position Update Failed',appearance: "error",autoClose: 5000})
        }, complete: () => {

        }
      })
  }
}
