import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {FormControl} from '@angular/forms';

import * as _moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'provider-history-dialog',
  templateUrl: 'provider-history.component.html',
  styleUrls: ['./provider-history.component.scss'],
})
export class ProviderHistoryDialog {
  rows = [];
  columns = [
    { name: 'Description' },
    { name: 'Amount' }
  ];
  constructor(
    public dialogRef: MatDialogRef<ProviderHistoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

       data.materialBuyingHistories = _.sortBy(data.materialBuyingHistories, ['createdDate']).reverse();
      this.rows = data.materialBuyingHistories;

  }



  public ngAfterViewInit(): void {

  }

  ngOnInit() {
    


  }



}