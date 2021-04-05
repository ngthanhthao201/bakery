import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {FormControl} from '@angular/forms';

import * as _moment from 'moment';
import * as _ from 'lodash';
import { ShopService } from "../../../shared/services/shop.service";

@Component({
  selector: 'transactions-dialog',
  templateUrl: 'transactions-detail.component.html',
  styleUrls: ['./transactions-detail.component.scss'],
})
export class TransactionsDetailDialog {
  rows = [];
  columns = [
    { name: 'Description' },
    { name: 'Amount' }
  ];

  header:any;

  constructor(
    public dialogRef: MatDialogRef<TransactionsDetailDialog>, public shopService: ShopService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      data.transactions = _.sortBy(data.transactions, ['createdDate']).reverse();
      this.rows = data.transactions;
      this.header = data.header;
  }



  public ngAfterViewInit(): void {

  }

  ngOnInit() {
    


  }



}