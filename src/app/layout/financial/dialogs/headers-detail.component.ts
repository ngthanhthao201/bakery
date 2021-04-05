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
  selector: 'headers-dialog',
  templateUrl: 'headers-detail.component.html',
  styleUrls: ['./headers-detail.component.scss'],
})
export class HeadersDetailDialog {
  rows = [];
  columns = [
    { name: 'Description' },
    { name: 'Amount' }
  ];
  constructor(
    public dialogRef: MatDialogRef<HeadersDetailDialog>,
    public shopService: ShopService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log(data.headers)
      data.headers = _.sortBy(data.headers, ['dateCreated']).reverse();
      this.rows = data.headers;
  }



  public ngAfterViewInit(): void {

  }

  ngOnInit() {
    


  }



}