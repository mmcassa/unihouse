import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericListItem } from '@unihouse/core';
import { TuiAmountPipe } from '@taiga-ui/addon-commerce'
import { TuiCheckbox, TuiChip } from '@taiga-ui/kit';
import { TuiButton, TuiLabel } from '@taiga-ui/core';


@Component({
  selector: 'app-transactions-list',
  imports: [
    CommonModule, 
    GenericListItem, 
    TuiAmountPipe, 
    TuiLabel, 
    TuiButton,
    TuiChip
  ],
  templateUrl: './transactions-list.html',
  styleUrl: './transactions-list.scss',
})
export class TransactionsList {
  transactions = input<any[]>([]);
  protected selected: any[] = [];
  updated = output<any[]>();

  constructor() {

  }

  protected toggle_all() {
    const prev_selected = this.selected.flatMap(x => x['TransactionID']);
    const new_selected = [...this.transactions()];
    let idx;
    prev_selected.forEach( p => {
      idx = new_selected.findIndex(x => { return x['TransactionID'] == p});
      if (idx > -1)
        new_selected.splice(idx,1);
    }
    )
    this.selected = new_selected;
    this.updated.emit(this.selected);


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
