import { Component, input, model, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TableColumnOption } from '../generic-table';

@Component({
  selector: 'app-abstract-dynamic-table-manager',
  imports: [],
  template: '',
  styles: ''
})
export abstract class AbstractDynamicTableManagerComponent<T> implements OnInit, OnChanges {
  /** Columns available for the table */
  protected abstract ALLOWED_COLUMNS:(string|TableColumnOption)[];

  /** Visible columns */
  protected columns!: (string|TableColumnOption)[];
  
  /** Rows of data to show */
  data = model<T[]>([]);
  /** Columns to show, defaults to all */
  show = input<string[]>();
  /** Columns to hide, defaults to none */
  hide = input<string[]>([]);
  /** Selected objects `T` */
  selected = model<T[]>();

  ngOnInit(): void {
    this.columns = this.ALLOWED_COLUMNS;
    this.set_columns();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      this.selected.set([]);
    }
    if ('hide' in changes || 'show' in changes) {
      this.set_columns();
    }
    
  }

  /** Sets the visible columns list using the  */
  private set_columns() {
    let show = this.show() ?? [...this.ALLOWED_COLUMNS];
    let idx = -1;
    for (let c of this.hide()) {
      idx = show.findIndex(
        x => {
          return x === c || (typeof(x) !== 'string' && x.property === c)
        }
      );
      if (idx > -1) {
        show.splice(idx,1);
      }
    }
    this.columns = show;
  }  

  protected on_selected_updated(event: T[]) {
    this.selected.set(event);
  }

}
