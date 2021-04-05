import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-vouchers-dialog',
  templateUrl: './new-vouchers-dialog.component.html',
  styleUrls: ['./new-vouchers-dialog.component.scss']
})
export class NewVouchersDialogComponent implements OnInit {
  newVouchersRequest: any ={};
  currencyMaskOptions ={prefix: '' , suffix: 'đ ', thousands: '.', precision:0 };
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.newVouchersRequest.shopId = data.shopId;
  }

  ngOnInit() {
  }

  resetVoucher(){
    this.newVouchersRequest.cash= undefined;
    this.newVouchersRequest.gift= undefined;
    this.newVouchersRequest.orderPercent= undefined;
  }
  

}
