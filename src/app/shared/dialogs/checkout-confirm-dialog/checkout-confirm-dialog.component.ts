import { Component, OnInit, Inject, ChangeDetectorRef, NgZone, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckoutCash } from '../../models/checkout-cash.model';
import { SnotifyService } from 'ng-snotify';
import { IncomeHeader } from '../../models/income-header.model';
import { ApiService } from '../../services/api.service';
import { Customer } from '../../models/customer.model';
import { BarcodeService } from '../../services/barcode.service';
declare var jquery: any;
declare var $: any;
import * as _ from 'lodash';
import { QuickOrderService } from '../../services/quick-order.service';
import { CurrencyFormatPipe } from '../../pipes/currencyformat.pipe';
import { ShopService } from '../../services/shop.service';
import { QzTrayService } from '../../services/qz-tray.service';
import { Utilities } from '../../services/utilities';
import { DateTimeService } from '../../services/date-time.service';
import { PrintService } from '../../services/print.service';
import { OnlineOfflineService } from '../../services/offline.service';
import { ViewContainerRef } from '@angular/core';
import { Member } from '../../models/member.model';
import { NgxSpinnerService } from 'ngx-spinner';
import {  delay} from 'rxjs/operators';
import {  of} from 'rxjs';
import { DashboardComponent } from '../../../layout/dashboard/dashboard.component';
import { AuthService } from '../../services/auth.service';
//    font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
;



@Component({
  selector: 'app-checkout-confirm-dialog',
  templateUrl: './checkout-confirm-dialog.component.html',
  styleUrls: ['./checkout-confirm-dialog.component.scss']
})
export class CheckoutConfirmDialogComponent implements OnInit {

  checkoutCash: CheckoutCash;
  incomeHeader: IncomeHeader;
  printerConnected = false;
  member: Member;
  currentCustomer: Customer;
  _quickCashes = [5000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 600000, 700000, 800000, 900000, 1000000];
  currencyMaskOptions = { prefix: '', suffix: 'đ ', thousands: '.', precision: 0, allowNegative: false };
  constructor(public viewContainerRef: ViewContainerRef, private offlineService: OnlineOfflineService, private qzTrayService: QzTrayService, public shopService: ShopService, public dialogRef: MatDialogRef<CheckoutConfirmDialogComponent>, private snotifyService: SnotifyService, private barcodeService: BarcodeService,
    @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService, private quickOrderService: QuickOrderService,
    private spinner: NgxSpinnerService, private authService: AuthService,
    private ngZone: NgZone, private ref: ChangeDetectorRef, public dateTimeService: DateTimeService, private printingService: PrintService) {
    
    this.checkoutCash = data.checkoutCash;
    this.incomeHeader = data.incomeHeader;
    this.currentCustomer = data.currentCustomer;
    this.member = data.member;

    // var mposCode = "12345";
    // console.log(this.authService.isConnected);
    //   this.authService.invoke2("SendDirectMessage", "MPOS-" + mposCode, JSON.stringify(data));

  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == 'F9') {
      event.stopPropagation();
      this.checkout();
      event.preventDefault();
      return;
    }
    if (event.key == 'F10') {
      this.spinner.show();
      event.stopPropagation();
      this.checkout(false);
      event.preventDefault();
      setTimeout(()=>{
        this.spinner.hide();
      },1500)

      return;
    }
  }

  ngOnInit() {
    //   if(!this.printerConnected){
    //     this.qzTrayService.getPrinters().subscribe(r=>{
    //         console.log(r);
    //         this.printerConnected = true;
    //       });
    // }
  }

  public get quickCashes() {
    return _.filter(this._quickCashes, i => {

      return i >= this.checkoutCash.moneyCake;
    })

  }

  selectQuick(quickPrice) {
    this.ngZone.run(() => {
      this.checkoutCash.moneyCustomer = quickPrice / 1000;
      this.ref.detectChanges();
      this.checkout();

    });

  }

  //isCheckOutEnable = true;

  checkout(printBill = true) {
      try{this.kickCashDrawer()}catch{}
    // if(!this.isCheckOutEnable){
    //   this.snotifyService.warning("Bạn đang thao tác quá nhanh!")
    //   return;
    // }

    // of().pipe(delay(2000)).subscribe(r=>{
    //   this.isCheckOutEnable = true;
    // });
    // this.isCheckOutEnable = false;

    if (!this.checkoutCash.moneyCustomer || this.checkoutCash.moneyCustomer.toString() == '999999999') {
      this.checkoutCash.moneyCustomer = this.checkoutCash.moneyCake / 1000;
    }
    if (((this.checkoutCash.moneyCustomer * 1000) - this.checkoutCash.moneyCake < 0) || !this.checkoutCash.moneyCustomer) {
      this.snotifyService.error("Tiền khách đưa chưa đủ", "");
      return;
    }

    try {
      var changeCash = (this.checkoutCash.moneyCustomer * 1000) - this.checkoutCash.moneyCake;
      if (changeCash > 0) {
        this.snotifyService.info("Tiền thừa: " + new CurrencyFormatPipe().transform(changeCash), "")
      }
    }
    catch (err) {

    }
    //this.ref.detectChanges();


    this.incomeHeader.dateCreated = new Date();
    if (this.member) {
      this.incomeHeader.memberId = this.member.id;
      _.each(this.incomeHeader.incomeTransactions, t => {
        t.memberId = this.member.id;
      })
    }

    if (printBill) {
      this.printElem();
    }

    this.incomeHeader.description = "Bán trong ngày " + this.incomeHeader.dateCreated.getDate() + "-" + (parseInt(this.incomeHeader.dateCreated.getMonth().toString()) + 1);
    this.updateBarcodes(this.incomeHeader.incomeTransactions);
    this.apiService.createIncomeCustomer({ "incomeHeader": this.incomeHeader, "customer": this.currentCustomer }).subscribe(r => {
      this.dialogRef.close(this.checkoutCash);
      DashboardComponent.productSoldEvent.emit(null);

    }, err => {
      //this.offlineService.addIncomeHeaderCustomer(err, { "incomeHeader": this.incomeHeader, "customer": this.currentCustomer });
      this.apiService.addToIndexedDb({ "incomeHeader": this.incomeHeader, "customer": this.currentCustomer });
    });
     this.dialogRef.close(this.checkoutCash);
  }

  updateBarcodes(transactions) {
    _.each(transactions, t => {
      if (t.barcode) {
        this.barcodeService.setIsSold(t.barcode);
      }
    })
  }




  printElem() {
    console.log(this.currentCustomer);
    this.printingService.printCheckOut(this.viewContainerRef, this.incomeHeader, this.currentCustomer, this.checkoutCash)
  }

  kickCashDrawer(){
    this.printingService.kickCashDrawer();
  }

}
