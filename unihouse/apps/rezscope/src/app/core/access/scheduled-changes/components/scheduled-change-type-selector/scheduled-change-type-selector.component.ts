import { Component, input, OnInit, output } from '@angular/core';
import { ScheduledChangeTypeEnum } from '../../interfaces/scheduled-changes-filter.interface';
import { TuiError, TuiSizeL, TuiSizeS, TuiTextfield } from '@taiga-ui/core';
import { TuiChevron, TuiDataListWrapper, TuiFieldErrorPipe, TuiSelect } from '@taiga-ui/kit';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TuiStringHandler } from '@taiga-ui/cdk';

@Component({
  selector: 'app-scheduled-change-type-selector',
  imports: [
    AsyncPipe,
    CommonModule,
    ReactiveFormsModule,
    TuiChevron,
    TuiDataListWrapper,
    TuiError,
    TuiFieldErrorPipe,
    TuiTextfield,
    TuiSelect,
  ],
  templateUrl: './scheduled-change-type-selector.component.html',
  styleUrl: './scheduled-change-type-selector.component.scss'
})
export class ScheduledChangeTypeSelectorComponent implements OnInit {
  protected change_type_array!: number[];

  size = input<TuiSizeL|TuiSizeS>('s');
  form = input<FormGroup>(new FormGroup([]));
  formControlName = input<string>('employmentchangetypeenum');
  onUpdate = output<number|null>();

  protected value: number | null = null;

  constructor() {
    this.change_type_array = Object.values(ScheduledChangeTypeEnum).filter((value) => typeof value === 'number');
    
  }

  ngOnInit(): void {
    if (Object.keys(this.form().controls).length == 0) {
      this.form().addControl(this.formControlName(),new FormControl<any>(null))
    }
    this.form().get(this.formControlName())?.valueChanges.subscribe({
      next: (val) => {
        this.onUpdate.emit(val);
        this.value=val;
      }
    })
  }

  protected change_type(id: number) {
    return ScheduledChangeTypeEnum[id];
  }

  protected readonly stringify: TuiStringHandler<number> = (x) => 
      {
        return this.change_type(x);
      };


}
