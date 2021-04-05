import { Component, OnInit, Inject, NgZone, ViewContainerRef, Input } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ApiService } from '../../../../../shared/services/api.service';
import { PrintService } from '../../../../../shared/services/print.service';
import { OrderDetail } from '../../../../../shared/models/order-detail.model';
import { Order } from '../../../../../shared/models/order.model';
@Component({
  selector: 'app-print-receipt',
  templateUrl: './print-receipt.component.html',
  styleUrls: ['./print-receipt.component.scss']
})
export class PrintReceiptComponent implements OnInit {
  order : Order;


  constructor(private apiService: ApiService, private ngZone: NgZone, private printService: PrintService, private viewContainerRef: ViewContainerRef,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private bottomSheetRef: MatBottomSheetRef<PrintReceiptComponent>) {
      this.order = data.currentOrder;
  }
  

  ngOnInit() {
  }

  printorderByIdNumber() {

    this.apiService.getOrderByIdNumber(this.order.idNumber).subscribe(r => {
      let newOrder = r;
      if (!newOrder.customer) newOrder.customer = {};
      this.ngZone.runTask(() => {
        this.printService.printOrder(this.viewContainerRef, { ...newOrder }, newOrder.customer);
      });


    });

  }

}
