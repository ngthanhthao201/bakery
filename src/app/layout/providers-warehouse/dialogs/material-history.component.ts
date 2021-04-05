import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {FormControl} from '@angular/forms';

import * as _moment from 'moment';
import * as _ from 'lodash';
import { Material } from "../../../shared/models/material.model";

@Component({
  selector: 'material-history-dialog',
  templateUrl: 'material-history.component.html',
  styleUrls: ['./material-history.component.scss'],
})
export class MaterialHistoryDialog {
  rows = [];
  material: Material;

  constructor(
    public dialogRef: MatDialogRef<MaterialHistoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.material = data.material;

      this.material.materialBuyingHistories = _.sortBy(this.material.materialBuyingHistories, ['createdDate']).reverse();

      this.rows = this.material.materialBuyingHistories;


  }



  public ngAfterViewInit(): void {

  }

  ngOnInit() {
    


  }



}