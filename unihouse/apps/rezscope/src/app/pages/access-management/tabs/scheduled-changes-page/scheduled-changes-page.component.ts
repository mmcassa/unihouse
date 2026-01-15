import { CommonModule } from '@angular/common';
import { Component, inject, model, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiExpand, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiDataListWrapper, tuiItemsHandlersProvider, TuiSelect } from '@taiga-ui/kit';
import { TuiHeader } from '@taiga-ui/layout';
import { PaginationOptions, ObservableButton, ObservableButtonWithDropdownComponent, PaginationWrapperComponent, ObservableButtonFunctionOptions } from '@unihouse/core';
import { StarrezAccessService } from 'apps/rezscope/src/app/core/access';
import { ScheduledPositionChangeInterface } from 'apps/rezscope/src/app/core/access/access.interface';
import { ScheduledChangesTableComponent, ScheduledChangesFiltersComponent, ScheduledChangesFiltersInterface } from 'apps/rezscope/src/app/core/access/scheduled-changes';
import { Observable, tap } from 'rxjs';

const initial_paging: PaginationOptions = {
      page: 0,
      page_size: 10,
      total_items: 0,
      total_pages: 1
  }


@Component({
  selector: 'app-scheduled-changes-page',
  imports: [
    CommonModule,
    FormsModule,
    ObservableButton,
    ObservableButtonWithDropdownComponent,
    PaginationWrapperComponent,
    ReactiveFormsModule,
    ScheduledChangesTableComponent,
    ScheduledChangesFiltersComponent,
    TuiButton,
    TuiDataListWrapper,
    TuiExpand,
    TuiHeader,
    TuiSelect,
    TuiTextfield,
    TuiTitle,
  ],
  templateUrl: './scheduled-changes-page.component.html',
  styleUrl: './scheduled-changes-page.component.scss',
  providers: [
    tuiItemsHandlersProvider({
      stringify: (x: any) => x.name,
      identityMatcher: (a: any, b: any) => a.id === b.id,
    })
  ]
})
export class ScheduledChangesPageComponent {
  private readonly accessService = inject(StarrezAccessService);
  protected paging: PaginationOptions = structuredClone(initial_paging);
  protected show_filters: boolean = true;

  require_action: ScheduledPositionChangeInterface[] = [];
  selected: ScheduledPositionChangeInterface[] = [];
  filters = model<ScheduledChangesFiltersInterface>({});

  actions: ObservableButtonFunctionOptions[] = [
    {
      callback_fnc: () => this.open_bulk_actions(),
      button_label: 'Bulk Actions'
    },
    {
      callback_fnc: () => this.execute(),
      button_label: 'Execute Changes'
    },
    {
      callback_fnc: () => this.open_import(),
      button_label: 'Import Changes'
    },{
      callback_fnc: () => this.cancel(),
      callback_args: [this.selected],
      button_label: 'Cancel Changes'
    },{
      callback_fnc: () => this.delete(),
      callback_args: [this.selected],
      button_label: 'Delete Changes'
    }
  ]

  
  constructor() {
    this.fetch_data();
  }

  protected detect = () => {
    return this.accessService.detect_new_scheduled_changes()
    .pipe(tap({
      next: res => this.fetch_data()
    }));
  }

  protected cancel = () => {
    const items = this.selected;
    if (items.length === 0) {
      return new Observable<any>();
    } else if (items.length === 1) {
      return this.accessService.cancel_scheduled_change(items[0].id)
        .pipe(
          tap({ next: () => this.fetch_data() })
        )
    } else {
      return this.accessService.cancel_scheduled_changes(items.map(x => x.id))
        .pipe(
          tap({ complete: () => this.fetch_data() })
        )
    }
  }

  protected delete = () => {
    const items = this.selected;
    if (items.length === 0) {
      return new Observable<any>();
    } else if (items.length === 1) {
      return this.accessService.del_scheduled_change(items[0].id)
        .pipe(
          tap({ next: () => this.fetch_data() })
        )
    } else {
      return this.accessService.del_scheduled_changes(items.map(x => x.id))
        .pipe(
          tap({ complete: () => this.fetch_data() })
        )
    }
  }

  protected execute = () => {
    const items = this.selected;
    if (items.length === 1) {
      return this.accessService.execute_scheduled_change(items[0].id)
      .pipe(
          tap({ next: () => this.fetch_data() })
        )
    } else if (items.length > 1) {
      return this.accessService.execute_scheduled_changes(items.map(x => x.id))
      .pipe(
          tap({ next: () => this.fetch_data() })
        )
    } 
    return new Observable<any>();
  }

  protected open_bulk_actions = () => {
    return this.accessService.open_bulk_edit_scheduled_changes(this.selected)
      .pipe(
          tap({ next: (res) => {if (res) this.fetch_data()} })
        )
  }

  protected open_import = () => {
    return this.accessService.open_import_scheduled_changes();
  }

  protected search_updated(filters: ScheduledChangesFiltersInterface|null) {
      if (filters)
        this.filters.set(filters)
      this.fetch_data();

  }

  protected pre_load_fetch_data() {
    return this.accessService.get_scheduled_changes(
      this.paging,
      this.filters()
    ).pipe(tap({
          next: d => {
            
            this.require_action = d;
          },
          error: err => {
            console.error('Failed to load scheduled changes');
          }
        }));
  }

  protected fetch_data() {
    
    this.pre_load_fetch_data()
      .subscribe();
  }
}
