import { Component } from '@angular/core';
import { ScheduledChangesFiltersInterface, ScheduledChangeTypeEnum } from '../../interfaces/scheduled-changes-filter.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { TuiSelect, TuiInputDateRange, TuiSwitch, TuiDataListWrapper } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { ScheduledChangeTypeSelectorComponent } from '../scheduled-change-type-selector/scheduled-change-type-selector.component';
import { GenericFiltersComponent } from '@unihouse/core';

@Component({
  selector: 'app-scheduled-changes-filters',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ScheduledChangeTypeSelectorComponent,
    TuiDataListWrapper,
    TuiInputDateRange,
    TuiLabel,
    TuiSwitch,
    TuiSelect,
    TuiTextfield,
  ],
  templateUrl: './scheduled-changes-filters.component.html',
  styleUrl: './scheduled-changes-filters.component.scss'
})
export class ScheduledChangesFiltersComponent extends GenericFiltersComponent<ScheduledChangesFiltersInterface> {
  protected override filters = ['search','employmentchangetypeenum','overdue','changedate_range'];

  protected change_type_enums!: any;

  constructor() {
    super();
    const enums = Object.entries(ScheduledChangeTypeEnum).map(x => {return {id:Number.parseInt(x[0]), name: x[1]}})
    this.change_type_enums = enums.slice(0,enums.length/2);
  }

  private tuiDateParser(d: TuiDay) {
    return `${d.year}-${(d.month+1).toLocaleString('en-US',{minimumIntegerDigits: 2})}-${d.day.toLocaleString('en-US',{minimumIntegerDigits: 2})}`
  }
    
  protected override filters_formatter(val:any): ScheduledChangesFiltersInterface {
    if (! val.overdue) {
      val.overdue = null;
    }
    if (! (val.changedate_range == null) ) {
      val.changedate_range_after = this.tuiDateParser(val.changedate_range.from)
      val.changedate_range_before = this.tuiDateParser(val.changedate_range.to)
    }
    delete val.changedate_range;
    return val;
  }

}
