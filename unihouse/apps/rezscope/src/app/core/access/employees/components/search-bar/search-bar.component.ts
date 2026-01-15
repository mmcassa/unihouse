import { Component, ContentChildren, input, output, QueryList, signal } from '@angular/core';
import { NamedTemplateDirective } from '@unihouse/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { tuiCountFilledControls } from '@taiga-ui/cdk';
import { debounceTime, map } from 'rxjs';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapper, TuiSwitch } from '@taiga-ui/kit';
import { TuiSearch } from '@taiga-ui/layout';
import { PositionSelectorComponent } from '../../../positions';
import { EmploymentPositionInterface } from '../../../positions/position.interface';
import { EmployeeFiltersInterface } from '../../interfaces/employee-filters.interface';

@Component({
  selector: 'app-search-bar',
  imports: [
    PositionSelectorComponent,
    ReactiveFormsModule,
    TuiButton,
    TuiDataListWrapper,
    TuiSearch,  
    TuiSwitch,
    TuiTextfield,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  @ContentChildren(NamedTemplateDirective) templates!: QueryList<NamedTemplateDirective>;
  

  placeholder = input<string>('Search');
  onUpdate = output<EmployeeFiltersInterface | string>();

  protected on_update() {
  }

  protected on_position_selected(event: EmploymentPositionInterface | number | null) {
    this.form.get('positionid')?.setValue(event ? (typeof event === 'number' ? event : event.id) : undefined);
  }
   protected readonly form = new FormGroup({
        search: new FormControl(),
        // select: new FormControl(),
        // date: new FormControl(),
        // switch: new FormControl(),
        // filter: new FormControl(),
        // segmented: new FormControl(),
        _all: new FormControl(),
        positionid: new FormControl()
    });
 
    protected readonly items = [];
    protected readonly filters = ['Python', 'JavaScript', 'TypeScript'];
    protected readonly segments = [null, 'Unread', 'Archived'];
 
    protected readonly count = signal(0);
        
    constructor() {
      // On Changes
      this.form.valueChanges.pipe(
        debounceTime(500),
        map((changes) => {
          this.onUpdate.emit(this.form.value);
          const x = tuiCountFilledControls(this.form); 
          this.count.set(x);
          return x;
        })
      ).subscribe();
      
    }
}

