import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import * as _moment from 'moment';
import * as _ from 'lodash';
import { PriceChip } from "../models/price-chip.model";
import { SaleType } from "../models/sale-type.enum";



@Component({
  selector: 'new-edit-price-dialog',
  templateUrl: 'new-edit-price-dialog.component.html',
  styleUrls: ['./new-edit-price-dialog.component.scss'],

})


export class NewEditPriceDialog {
  currentShop: any = {};
  priceChip: PriceChip;
  currencyMaskOptions = { prefix: '', suffix: 'đ ', thousands: '.', precision: 0 };
  percentMaskOptions = { prefix: '', suffix: '% ', thousands: '.', precision: 0 };
  type: any;
  public SaleType = SaleType;
  isFocus: boolean = false;

  @ViewChild('priceChipInput', { static: true}) el: ElementRef;

  constructor(public dialogRef: MatDialogRef<NewEditPriceDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.priceChip = new PriceChip();
    this.type = data.type;

  }



  ngAfterViewInit() {
    // $(this.el.nativeElement).blur();

  }

  ngOnInit() {
  }

  ok() {
    this.dialogRef.close(this.priceChip);
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }


}
 
