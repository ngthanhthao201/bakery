import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
declare var $: any;
import { SnotifyService } from 'ng-snotify';
import { BarcodeService } from '../../../../services/barcode.service';
import { QuickOrderService } from '../../../../services/quick-order.service';
import { ApiService } from '../../../../services/api.service';
import { ProductBarcode } from '../../../../models/product-barcode.model';
import { OrderDetail } from '../../../../models/order-detail.model';
import { OrderDetailService } from '../../services/order-detail.service';


@Component({
  selector: 'app-link-barcode',
  templateUrl: './link-barcode.component.html',
  styleUrls: ['./link-barcode.component.scss']
})
export class LinkBarcodeComponent implements OnInit {
  currentOrder: any;
  isInputCake: boolean;
  newProductBarcode: ProductBarcode = {} as any;
  existingOd: any;
  firstEmptyOdId: number;

  constructor(public dialogRef: MatDialogRef<LinkBarcodeComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private barcodeService: BarcodeService,
    public quickOrderService: QuickOrderService, public dialog: MatDialog, private snotifyService: SnotifyService, private apiService: ApiService, private orderDetailService: OrderDetailService) {
    this.currentOrder = data.currentOrder;
    this.findFisrtEmptyOdId();
  }

  findFisrtEmptyOdId() {
    _.each(this.currentOrder.orderDetails, od => {
      if (od.barcode == null) {
        this.firstEmptyOdId = od.id;
        return false;
      }
    });

  }

  ngOnInit() {
    var currentPage = this;
    $(document).scannerDetection({

      //https://github.com/kabachello/jQuery-Scanner-Detection

      timeBeforeScanTest: 200, // wait for the next character for upto 200ms
      avgTimeByChar: 40, // it's not a barcode if a character takes longer than 100ms
      preventDefault: false,
      endChar: [13],
      onComplete: function (barcode, qty) {
        currentPage.processBarcodeWithoutScanned(barcode, currentPage);
      } // main callback function
      ,
      onError: function (string, qty) {

      }
    });
  }

  processBarcodeWithoutScanned(barcode, currentPage) {
    var getIndex = barcode.slice(-3);
    var getDate = barcode.slice(-7, -3);
    var getCategoryBarcodeId = barcode.slice(-9, -7);
    var getPrice = barcode.slice(- (barcode.length - 1), - 9);


    this.newProductBarcode.shopId = this.barcodeService.currentShop.id;
    this.newProductBarcode.productCategoryName = this.barcodeService.getCategoryName(getCategoryBarcodeId);
    this.newProductBarcode.productCategoryBarcodeId = getCategoryBarcodeId;
    this.newProductBarcode.price = parseInt(getPrice) * 1000;
    this.newProductBarcode.barcode = barcode;

    this.existingOd = _.find(this.currentOrder.orderDetails, { barcode: null, unitPrice: this.newProductBarcode.price }) as any;
    var existingOdBarcode = _.find(this.currentOrder.orderDetails, { barcode: this.newProductBarcode.barcode }) as any;

    if (this.existingOd) {
      if (existingOdBarcode) {
          this.snotifyService.error("Mã code đã được dùng!", "");
      }
      else {
        this.existingOd.description = this.newProductBarcode.productCategoryName;
        this.existingOd.quantity = 1;
        this.existingOd.barcode = this.newProductBarcode.barcode;
        this.findFisrtEmptyOdId();
        // return false;
      }
    }
  }

  updateOrder() {

    this.orderDetailService.updateOrderDetail(this.existingOd).subscribe(r => {
      if (r) {
        this.currentOrder = r;
        console.log(this.currentOrder);
      }
    })

  }
}
