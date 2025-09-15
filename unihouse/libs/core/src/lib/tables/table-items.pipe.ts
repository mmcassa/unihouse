import { Pipe, PipeTransform } from '@angular/core';
import { TableItem } from './generic-table';

@Pipe({
  name: 'tableItems'
})
export class TableItemsPipe implements PipeTransform {

  transform(value: TableItem<any>[], ...args: unknown[]): any[] {
    return value.map(item => {
      const i = item.item
      i['$_selected'] = item.selected
      return i;
    });
  }

}
