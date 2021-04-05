import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { IncomeTransaction } from '../../../../shared/models/IncomeTransaction';
import { ShopService } from '../../../../shared/services/shop.service';
import { ApiService } from '../../../../shared/services/api.service';
import { ReportTransactionDetail } from '../report-transaction-detail/report-transaction-detail';
import { Utilities } from '../../../../shared/services/utilities';

@Component({
  selector: 'app-general-report',
  templateUrl: './general-report.component.html',
  styleUrls: ['./general-report.component.scss']
})
export class GeneralReportComponent implements OnInit {

  selectedDate: Date = new Date();
  totalProductBarcodeIncome: number = 0;
  totalHardProductBarcodeIncome: number =0;
  totalOther: number =0;
  otherTransactions: Array<IncomeTransaction> = [];
  constructor(public shopService: ShopService,
      private apiService: ApiService, private bottomSheet: MatBottomSheet,) {

  }

  ngOnInit() {
    this.initData();
  }

  // myFilter = (d: Date): boolean => {
  //   return _moment(d).isBefore(new Date());
  // }

  myFilter = (d: Date): boolean => {
    return Utilities.withInMonthFilter(d);
}


  dateChange(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
    
    this.ngOnInit();
  }

  
  initData(){

    this.totalProductBarcodeIncome = 0;
    this.totalHardProductBarcodeIncome =0;
    this.totalOther =0;
    this.otherTransactions = [];

    this.apiService.getIncomeHeadersByShop(this.shopService.currentShop.id, _moment(this.selectedDate).startOf('day').toDate(), _moment(this.selectedDate).endOf('day').toDate()).subscribe(r => {
    if(r){
      _.each(r, ih=>{
        _.each(ih.incomeTransactions, t=>{
          if(!t) return ;
          if(t.barcode && (t.barcode.startsWith('$') || t.barcode.startsWith('0'))  ){
            this.totalProductBarcodeIncome+= t.amount;
          }else if(t.barcode && t.barcode.startsWith('C')){
            this.totalHardProductBarcodeIncome += t.amount;
          }else if(!t.barcode || t.barcode === ''){
            this.totalOther+= t.amount;
            this.otherTransactions.push(t);
          }
  
        })
      })

    }

    });

  }

  viewDetail(){

  }

  viewDetailTransaction(incomeTransactions){
    this.bottomSheet.open(ReportTransactionDetail, {
      data: {  
        incomeTransactions: incomeTransactions     
      },
    });
  }


  selectedIndexChanged(){

  }


}
