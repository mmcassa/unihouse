import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericListItem } from '@unihouse/core';


@Component({
  selector: 'app-transactions-list',
  imports: [CommonModule, GenericListItem],
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
    console.log(toggle_type,value)
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
