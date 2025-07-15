import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiDataList, TuiHint, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import {TuiStepper, TuiTextarea, TuiTooltip} from '@taiga-ui/kit';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TransactionsList } from './transactions-list/transactions-list';
import { Transaction } from './transactions';
import { StarrezTabTracker } from '../core/starrez/starrez-tab-tracker.service';

@Component({
  selector: 'app-bulk-delete-transactions',
  imports: [
    CommonModule,
    TuiTitle,
    TuiButton,
    TuiStepper,
    TuiIcon,
    TuiTextfield,
    TuiTextarea,
    TuiDataList,
    ReactiveFormsModule,
    TransactionsList
  ],
  templateUrl: './bulk-delete-transactions.html',
  styleUrl: './bulk-delete-transactions.scss',
})
export class BulkDeleteTransactions {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private tab_tracker = inject(StarrezTabTracker);
  protected form: FormGroup;
  protected loading_transactions: boolean = false;
  protected pending_submit_complete: boolean = false;
  protected sr_parsed_transactions: any[] = [];
  protected selected_transactions: any[] = [];

  constructor() {
    this.form = this.fb.group({
      "transactions" : []
    })
  }

  protected async load_transactions() {
    let transactions = this.form.controls['transactions'].value; 

    if (transactions !== undefined && typeof transactions == 'string' && transactions.length > 0) {
      this.form.controls['transactions'].setValue(transactions.replace('/[\r\n]/g',''));
      transactions = transactions.split(',');
    } else {
      // throw error
      return;
    }
    let query: string = '';
    if (Array.isArray(transactions) )
    query = `SELECT transactionid, description, comments,chargeitem,chargegroup,amount 
        FROM transaction where transactionid in ( ${transactions.join(',')} )`
    this.http.post<any[]>(`https://uga.starrezhousing.com/StarRezREST/services/query/`,query).subscribe({
      next: (res) => {
        console.log(res);
        this.sr_parsed_transactions = res;
      }, error: err => {
        console.log(err);
      }    })
  } 


  protected fetch_transactions_from_page() {
    const ext = this.tab_tracker.get_tab_url_extension();
    console.log(ext);
    const match = ext.match('!(group):([0-9]+):transactions$');
    let query;
    console.log(match?.length)
    if (match !== null && match.length === 3) {

      query = `SELECT transactionid, description, comments,chargeitem,chargegroup,amount 
        FROM transaction where entryid IN (SELECT EntryID FROM Entry JOIN EntryGroup WHERE EntryStatusEnum = 50 AND EntryGroup.GroupID = ${match[2].toString()})`
        console.log(query);
      this.http.post<any[]>(`https://uga.starrezhousing.com/StarRezREST/services/query/`,query).subscribe({
        next: (res) => {
          console.log(res);
          this.sr_parsed_transactions = res;
        }, error: err => {
          console.log(err);
        }    })
    } else {
      return;
    }
  }

  protected submit_selected() {
    this.selected_transactions.forEach( t => {
      let to: Transaction = new Transaction({'id' : t['TransactionID']});
      this.http.post(`https://uga.starrezhousing.com/StarRezREST/services/delete/transaction/${to.id}`,null).subscribe({
        next: res => {
          // pop deleted from sr_transactions
        }, error: err => {
          console.error('test',err)
        }
      });
    });

  }
}
