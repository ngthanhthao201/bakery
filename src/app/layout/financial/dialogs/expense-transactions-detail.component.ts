import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {FormControl} from '@angular/forms';

import * as _moment from 'moment';
import * as _ from 'lodash';
import { ApiService } from "../../../shared/services/api.service";
import { ExpenseTransaction } from "../../../shared/models/expense-transaction.model";
import { ExpenseHeader } from "../../../shared/models/expense-header.model";

@Component({
  selector: 'expense-transactions-dialog',
  templateUrl: 'expense-transactions-detail.component.html',
  styleUrls: ['./expense-transactions-detail.component.scss'],
})
export class ExpenseTransactionsDetailDialog {
    rows=[];
    expenseHeader: ExpenseHeader;
  constructor( private apiService: ApiService,
    public dialogRef: MatDialogRef<ExpenseTransactionsDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.apiService.getExpenseHeaderById(data.expenseHeaderId).subscribe(r=>{
        this.expenseHeader = r;
        this.rows = this.expenseHeader.expenseTransactions;
      })
  }



  public ngAfterViewInit(): void {

  }

  ngOnInit() {
    


  }



}