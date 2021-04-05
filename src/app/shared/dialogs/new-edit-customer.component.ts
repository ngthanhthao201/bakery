import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';
import { IncomeHeader } from "../models/income-header.model";
import * as _ from "lodash";
import { IncomeTransaction } from "../models/IncomeTransaction";
import { Utilities } from "../services/utilities";
import { ApiService } from "../services/api.service";
import { Customer } from "../models/customer.model";
import { SnotifyService } from "ng-snotify";
import { ShopService } from "../services/shop.service";



@Component({
    selector: 'income-dialog',
    templateUrl: 'new-edit-customer.component.html',
    styleUrls: ['new-edit-customer.component.scss'],
  })
  export class NewEditCustomerDialog {
    currentCustomer: Customer;
    customerTypes =[];
    constructor(
      public dialogRef: MatDialogRef<NewEditCustomerDialog>, private apiService: ApiService, private snotifyService: SnotifyService, 
      private shopService: ShopService,
      @Inject(MAT_DIALOG_DATA) public data: any) {  
        this.currentCustomer = data.currentCustomer;


        this.apiService.getCustomerTypes(shopService.currentShop.id).subscribe(r=>{
              this.customerTypes = r;
          })

       }
  
    onNoClick(): void {
      this.dialogRef.close();
    }

    linkCustomer(){
      this.apiService.linkCustomerShop(this.customerTypes[0].id,this.currentCustomer.id, this.shopService.currentShop.id, this.currentCustomer.customerShops[0].externalId).subscribe(r => {
        this.snotifyService.success('Liên kết thành công', '');
        }, err => {
            this.snotifyService.error(err._body, '');
        });
    }
  
  }