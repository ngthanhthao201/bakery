import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {FormControl} from '@angular/forms';

import * as _moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'income-day-detail-dialog',
  templateUrl: 'income-day-detail.component.html',
  styleUrls: ['./income-day-detail.component.scss'],
})
export class IncomeDayDetailDialog {
  incomeGroupByDay: any;
  constructor(
    public dialogRef: MatDialogRef<IncomeDayDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.incomeGroupByDay = data.incomeGroupByDay;
  }



  public ngAfterViewInit(): void {

  }

  ngOnInit() {
    


  }

  getTotal(incomes){
    return _.sumBy(incomes, 'amount');
  }


}