import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
import { ExpenseHeader } from "../models/expense-header.model";
import { ExpenseTransaction } from "../models/expense-transaction.model";
import { FormControl, Validators } from "@angular/forms";
import { MaterialProvider } from "../models/material-provider.model";
import * as _ from "lodash";
import { MaterialBuyingHistory } from "../models/material-buying-history.model";
import { Material } from "../models/material.model";
import { ApiService } from "../services/api.service";
import { SnotifyService } from 'ng-snotify';

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map'
import { PrintService } from "../services/print.service";

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
  selector: 'other-expense-dialog',
  templateUrl: 'other-expense-dialog.component.html',
  styleUrls: ['other-expense-dialog.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})
export class OtherExpenseDialog {

  expenseType: any;
  displayedColumns = ['providerName', 'name', 'unitPrice', 'quantity', 'fee','amount', 'actions'];

  expenseHeader: ExpenseHeader;
  materialProviders: MaterialProvider[];
  filteredMaterialProviders: MaterialProvider[];
  currencyMaskOptions ={prefix: '' , suffix: 'đ ', thousands: '.', precision:0 };
  myControl: FormControl = new FormControl();
  constructor(
    public dialogRef: MatDialogRef<OtherExpenseDialog>, private apiService: ApiService, private snotifyService: SnotifyService,
    private printService: PrintService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
    this.expenseType = '1';
    this.expenseHeader = this.data.expenseHeader;
    this.materialProviders = this.data.materialProviders;
      if(!this.expenseHeader && this.data.expenseHeaderId){
        this.apiService.getExpenseHeaderById(this.data.expenseHeaderId).subscribe(r=>{
          this.expenseHeader = r;
          if(r.materialProvider){
            this.expenseType = '1';
          }else{
            this.expenseType = '2';
          }
        });
      }

      this.filteredMaterialProviders = this.data.materialProviders;
      

  }

  filterMaterialProviders(val: string): MaterialProvider[] {
    return this.materialProviders.filter(mp =>
      mp.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
  }

  isCreateNew(){
     
    var result = !this.expenseHeader.id;
    return result;
  }

  updateAmount(expenseTransaction: ExpenseTransaction, unitPrice: number, quantity: number) {
    
    expenseTransaction.amount = unitPrice * quantity;
    if(expenseTransaction.fee){
      expenseTransaction.amount += (expenseTransaction.amount*expenseTransaction.fee/100);
    }
    
  }

  displayFn(value: any): string {
    return (value && typeof value === 'object') ? value.name : value;
  }

  displayMaterialFn(history: any): string {
    if (history && history.material && history.material.name){
      return history.material.name;
    }
    
    return "";
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addTransaction() {
    var newT = new ExpenseTransaction(this.expenseHeader.shopId);
    
    if(!this.isCreateNew()){
      newT.materialBuyingHistory.materialProviderId = this.expenseHeader.materialProvider.id;
      //newT.expenseHeaderId = this.expenseHeader.id;
    }
    this.expenseHeader.expenseTransactions.push(newT);
    
  }

  

  getTotalHeaderAmount() {
    return _.sumBy(this.expenseHeader.expenseTransactions, 'amount') || 0;
  }

  removeTransaction(index) {
    _.pullAt(this.expenseHeader.expenseTransactions, index);
  }

  removeTransactionWarning(index, expenseTransactionId) {
    // _.pullAt(this.expenseHeader.expenseTransactions, index);
    this.snotifyService.confirm("Bạn có chắc chắn muốn xóa giao dịch này?","",{
      buttons: [
        {
            text: "Ok",
            action: () => {
              this.apiService.removeExpenseTransaction(expenseTransactionId).subscribe(r=>{
                this.snotifyService.success("Xóa giao dịch thành công","");
                _.pullAt(this.expenseHeader.expenseTransactions, index);
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

  providerChanged(header, provider) {
    if (!provider.id) {
      header.materialProvider = new MaterialProvider(this.expenseHeader.shopId);
      header.materialProvider.name = provider;

      this.filteredMaterialProviders =  this.filterMaterialProviders(provider);
    }
  }

  materialChanged(history, material) {
    if (!material.id) {
      history.material = new Material(this.expenseHeader.shopId);
      history.material.materialProviderId = this.expenseHeader.materialProvider.id;
      history.material.name = material;
    }
  }

  setUnitPrice(price, element){
    element.materialBuyingHistory.unitPrice = price;
  }

  save(){
    _.each(this.expenseHeader.expenseTransactions, (t) => {
      if (
          t.materialBuyingHistory &&
          t.materialBuyingHistory.material &&
          t.materialBuyingHistory.material.id
      ) {
          t.materialBuyingHistory.materialId =
              t.materialBuyingHistory.material.id;
          t.materialBuyingHistory.material = undefined;
      }
  });

  var newExpense = this.expenseHeader;

  this.apiService
      .createExpenseHeader(newExpense)
      .subscribe((r) => {
          this.snotifyService.success("Tạo CHI thành công", "");
      });
  this.printService.printMessage(
      "CHI tổng cộng " +
          (_.sumBy(newExpense.expenseTransactions, "amount") || 0)
  );

  this.printService.kickCashDrawer();
  this.dialogRef.close();

  }

}