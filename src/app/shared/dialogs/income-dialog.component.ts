import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';
import { IncomeHeader } from "../models/income-header.model";
import * as _ from "lodash";
import { IncomeTransaction } from "../models/IncomeTransaction";
import { Utilities } from "../services/utilities";
import { SnotifyService } from 'ng-snotify';

import { ApiService } from "../services/api.service";

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
    selector: 'income-dialog',
    templateUrl: 'income-dialog.component.html',
    styleUrls: ['expense-dialog.component.scss'],
    providers: [
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},]
  })
  export class IncomeDialog {
    incomeHeader: IncomeHeader
    filteredDescriptions: string[];
    descriptions: string[];
    currencyMaskOptions ={prefix: '' , suffix: 'đ ', thousands: '.', precision:0 };

    constructor(
      public dialogRef: MatDialogRef<IncomeDialog>, private apiService: ApiService,  private snotifyService: SnotifyService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        
        this.incomeHeader = data.incomeHeader;
        this.descriptions =  data.descriptions;
        this.filteredDescriptions = data.descriptions;
       }
  
    onNoClick(): void {
      this.dialogRef.close();
    }

    isCreateNew(){
     
      var result = !this.incomeHeader.id;
      return result;
    }

    getTotalHeaderAmount() {
      return _.sumBy(this.incomeHeader.incomeTransactions, 'amount');
    }

    addTransaction() {
      this.incomeHeader.incomeTransactions.push(new IncomeTransaction());
    }
  
    removeTransaction(index) {
      _.pullAt(this.incomeHeader.incomeTransactions, index);
    }

    removeTransactionWarning(index, incomeTransactionId) {
      // _.pullAt(this.expenseHeader.expenseTransactions, index);
      this.snotifyService.confirm("Bạn có chắc chắn muốn xóa giao dịch này?","",{
        buttons: [
          {
              text: "Ok",
              action: () => {
                this.apiService.removeIncomeTransaction(incomeTransactionId).subscribe(r=>{
                  this.snotifyService.success("Xóa giao dịch thành công","");
                  _.pullAt(this.incomeHeader.incomeTransactions, index);
                });
                  this.snotifyService.clear();
              }
          }, {
              text: "Cancel",
              action: () => {
                  this.snotifyService.clear();
              }
          }
      ]
        
      });
    }

    descriptionChanged(val){
      if(!val){
        return this.descriptions;
      }
      this.filteredDescriptions =   this.descriptions.filter(mp =>
        mp.toLowerCase().indexOf(val.toLowerCase()) > -1);
    }
  
  }