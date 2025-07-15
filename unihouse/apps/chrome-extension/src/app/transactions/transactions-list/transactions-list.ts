import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericListItem } from '@unihouse/core';
import { TuiAmountPipe } from '@taiga-ui/addon-commerce'


@Component({
  selector: 'app-transactions-list',
  imports: [CommonModule, GenericListItem, TuiAmountPipe],
  templateUrl: './transactions-list.html',
  styleUrl: './transactions-list.scss',
})
export class TransactionsList {
  transactions = input<any[]>([]);
  protected selected: any[] = [];
  updated = output<any[]>();

  constructor() {

  }
  

  protected on_toggled(toggle_type: boolean,value: any) {
    if (toggle_type) {
      this.selected.push(value);
    } else {
      let idx = this.selected.findIndex(x => { return x['TransactionID'] == value['TransactionID']});
      if (idx > -1)
        this.selected.splice(idx,1);
    }
    this.updated.emit(this.selected);
  }

}
