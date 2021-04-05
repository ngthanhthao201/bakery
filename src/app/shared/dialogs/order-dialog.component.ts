import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {FormControl} from '@angular/forms';

import * as _moment from 'moment';
import * as _ from 'lodash';
import { ApiService } from "../services/api.service";
import { Observable } from "rxjs/Observable";
import { Product } from "../models/product.model";
import { startWith, map } from "rxjs/operators";
import { Order } from "../models/order.model";

const moment = _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },

};

@Component({
  selector: 'order-dialog',
  templateUrl: 'order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})
export class OrderDialog {
  currentShop: any = {};
  productCategories: any = [];

  productCtrl: FormControl;
  filteredProducts: Observable<any[]>;

  products: Product[] = [];

  constructor(private apiService: ApiService,
    public dialogRef: MatDialogRef<OrderDialog>,
    @Inject(MAT_DIALOG_DATA) public order: Order) {
      this.productCtrl = new FormControl();
  }



  filterProducts(name: string) {
    try{
    return this.products.filter(product =>
      product.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }
    catch(err){}
  }

  public ngAfterViewInit(): void {

  }

  ngOnInit() {
    
    this.currentShop = JSON.parse(localStorage.getItem('currentShop'));
    if (this.currentShop.id) {
    }

  }



  displayFn(value: any): string {  
    return value && typeof value === 'object' ? value.name : value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}