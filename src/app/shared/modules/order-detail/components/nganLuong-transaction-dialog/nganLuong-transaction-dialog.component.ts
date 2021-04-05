import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
import * as _ from 'lodash';
import { Router } from "@angular/router";
import { Order } from "../../../../models/order.model";
import { ApiService } from "../../../../services/api.service";
import { OrderService } from "../../../../../layout/orders/services/order.service";
import { OrderStatus } from "../../../../models/order-status.enum";
import { DriverRun } from "../../../../models/driver-run.model";
import { ShopService } from "../../../../services/shop.service";
import { Driver } from "../../../../models/driver.model";
import { NganLuongTransaction } from "../../../../models/nganLuong-transaction.model";
import { NganLuongStatus } from "../../../../models/nganLuong-status.enum";
import { MemberService } from "../../../../services/member.service";
import { NganLuongType } from "../../../../models/nganLuong-type.enum";
import { SnotifyService } from "ng-snotify";
import { ClipboardService } from "ngx-clipboard";

@Component({
  selector: 'nganLuong-transaction-dialog',
  templateUrl: 'nganLuong-transaction-dialog.component.html',
  styleUrls: ['./nganLuong-transaction-dialog.component.scss'],
})
export class NganLuongTransactionDialog {
  order: Order;
  newNganLuongTransaction: NganLuongTransaction = new NganLuongTransaction();
  currencyMaskOptions = { prefix: '', suffix: 'đ ', thousands: '.', precision: 0 };
  paymentUrl = "";

  constructor(private apiService: ApiService, private snotifyService: SnotifyService, private clipboardService: ClipboardService,
    private shopService: ShopService, private orderService: OrderService, public memberService: MemberService,
    public dialogRef: MatDialogRef<NganLuongTransactionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.order = data.order;
    if(this.order.nganLuongTransaction && this.order.nganLuongTransaction.orderCode){
      this.paymentUrl = "https://tiembanhngon.com/payment?code=" + this.order.nganLuongTransaction.orderCode;
    }
  }

  ngOnInit() {
    this.newNganLuongTransaction.amount = this.order.netAmount + this.order.fee - this.order.deposit;
  }

  ok() {
    this.newNganLuongTransaction.orderId = this.order.id;
    this.newNganLuongTransaction.shopId = this.shopService.currentShop.id;
    this.newNganLuongTransaction.memberId = this.memberService.currentMember.id;
    this.newNganLuongTransaction.customerId = this.order.customerId;
    this.newNganLuongTransaction.nganLuongType = NganLuongType.CustomerFullPayment;
    this.apiService.createNganLuongTransaction(this.newNganLuongTransaction).subscribe(r => {
      this.snotifyService.success("Tạo thanh toán thành công","")
      this.order.nganLuongTransactionOrderCode = r.orderCode;
      this.paymentUrl = "https://tiembanhngon.com/payment?code=" + r.orderCode;
    });

  }

  copyLink(){
    this.clipboardService.copyFromContent(this.paymentUrl);
    this.snotifyService.success("Sao chép thành công")
    this.dialogRef.close();
  }

  shareLink(){
    this.dialogRef.close();

  }

}