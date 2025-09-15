import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { TuiLet, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiError, TuiLoader, TuiSizeL, TuiSizeS, TuiTextfield } from '@taiga-ui/core';
import { TuiChevron, TuiComboBox, TuiDataListWrapper, TuiFieldErrorPipe } from '@taiga-ui/kit';
import { Subject, debounceTime, filter, tap, switchMap, map } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { PositionLabelComponent } from '../position-label/position-label.component';
import { EmploymentPositionInterface } from '../../position.interface';
import { PositionService } from '../../position.service';

@Component({
  selector: 'app-position-selector',
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    TuiComboBox,
    TuiChevron,
    TuiDataListWrapper,
    TuiError,
    TuiFieldErrorPipe,
    TuiLet,
    TuiLoader,
    TuiTextfield,
    PositionLabelComponent
  ],
  templateUrl: './position-selector.component.html',
  styleUrl: './position-selector.component.scss'
})
export class PositionSelectorComponent implements OnInit {
  private readonly positionService = inject(PositionService);

  size = input<TuiSizeL | TuiSizeS>('m');
  filters = input<any>({staged: false});
  initial = input<EmploymentPositionInterface|number>();
  selected = output<EmploymentPositionInterface|null>();
  form = input<FormGroup>(new FormGroup([]));
  formControlName = input<string>('positionid');
  
 
  protected readonly stringify: TuiStringHandler<EmploymentPositionInterface> = (x) => 
    {
      return x.title  ?? '-'
    };

  protected readonly showLoader = signal(false);
  // Click on cleaner / datalist item triggers (input) events too
  protected readonly search$ = new Subject<string>();
  protected readonly items$ = this.search$.pipe(
      debounceTime(0), // ensure form control is updated after last input
      filter((x) => {
        return !this.form().get(this.formControlName())?.value;
      }), // click on datalist item should not trigger new api request
      tap(() => this.showLoader.set(true)),
      debounceTime(300),
      switchMap((query) => {
        return (query.length >= 1 ? 
          this.positionService.get_positions({ ...this.filters(),...{search: [query]}}) : 
          this.positionService.get_positions(this.filters())
        )
      }),
      map((x) => x),
      tap(() => this.showLoader.set(false)),
  );
 
    protected value: EmploymentPositionInterface | null = null;

    constructor() {
      
    }

    ngOnInit(): void {
      if (Object.keys(this.form().controls).length == 0) {
        this.form().addControl(this.formControlName(),new FormControl<any>(null))
      }
      this.form().get(this.formControlName())?.valueChanges.subscribe({
        next: (val) => {
          console.log(val);
          this.selected.emit(val);
          this.value=val;
        }
      });
      const init = this.initial()
      if (init != undefined) {
        if (typeof init !== 'number')
          this.value = init;
        else {
          this.positionService.get_position(init).subscribe({ next: x => this.value = x})
        }
      }
    }
}
