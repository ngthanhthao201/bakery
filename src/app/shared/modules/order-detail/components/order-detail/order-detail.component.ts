import { Component, OnInit, Input, Inject, ViewContainerRef } from '@angular/core';
import { routerTransition } from '../../../../../router.animations';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnotifyService } from 'ng-snotify';
import * as _ from 'lodash';
import { Utilities } from '../../../../services/utilities';

import { Order } from '../../../../models/order.model';
import { OrderStatus } from '../../../../models/order-status.enum';
import { OrderService } from '../../../../../layout/orders/services/order.service';
import { VoucherType } from '../../../../models/voucher-type.enum';

import { ShopService } from '../../../../services/shop.service';
import { DateTimeService } from '../../../../services/date-time.service';
import { PrintService } from '../../../../services/print.service';
import { ProductBarcode } from '../../../../models/product-barcode.model';
import { BarcodeService } from '../../../../services/barcode.service';

import { MemberService } from '../../../../services/member.service';
import { ChatService } from '../../../../services/chat.service';
import { OrderDetailService } from '../../services/order-detail.service';
import { QuickOrderService } from '../../../../services/quick-order.service';
import { BarcodeType } from '../../../../models/barcode-type.enum';
import { OrderSkipConfirmDialog } from '../order-skip-confirm/order-skip-confirm.component';
import { OrderLinkConfirmComponent } from '../order-link-confirm/order-link-confirm.component';

declare var $: any;

@Component({
  selector: 'order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  animations: [routerTransition()],
})
export class OrderDetailComponent implements OnInit {

  order: Order = new Order();
  orderId: number;
  parentsLink = [{ name: 'Orders', link: 'orders' }];
  isLoading = false;
  isPopup = false;
  responseMessage: string;
  steps = [];
  voucherCash: number = 0;
  candidate: any;
  pdWithoutBarcode: any;

  constructor(private barcodeService: BarcodeService,
    private viewContainerRef: ViewContainerRef,
    private printService: PrintService,
    public dateTimeService: DateTimeService,
    public dialog: MatDialog, private apiService: ApiService,
    private route: ActivatedRoute, private snotifyService: SnotifyService,
    public shopService: ShopService, private bottomSheet: MatBottomSheet,
    private memberService: MemberService, private chatService: ChatService,
    public orderService: OrderService, private dialogRef: MatDialogRef<OrderDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private orderDetailService: OrderDetailService, private quickOrderService: QuickOrderService,
    private router: Router, ) {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      if (this.orderId) {
        this.getOrder();

      }

    });
    if (data && data.order) {
      this.order = data.order;
      this.isPopup = true;
      this.pdWithoutBarcode = _.filter(this.order.orderDetails, { description: 'Bánh', barcode: null });
    }


  }



  ngOnInit() {
    var currentPage = this;
    $("body").scannerDetection({

      //https://github.com/kabachello/jQuery-Scanner-Detection

      timeBeforeScanTest: 200, // wait for the next character for upto 200ms
      avgTimeByChar: 40, // it's not a barcode if a character takes longer than 100ms
      preventDefault: false,
      endChar: [13],
      onComplete: function (barcode, qty) {
        currentPage.processBarcode(barcode, currentPage);
      } // main callback function
      ,
      onError: function (string, qty) {
      }
    });

    if (this.order.addressId && this.order.address.description == null) {
      if (this.order.advanceInfo) {
        this.order.address.description = this.order.advanceInfo.address;
      }
    }
    if (this.order.addressId == null) {
      this.apiService.updateOrderAddress(this.order.id).subscribe(r => {
        if (r.address) {
          r.address.description = this.order.advanceInfo.address;
        }
      })

    }

    this.steps = this.orderService.buildSteps(this.order);
    this.orderService.ordersChanged.subscribe(r => {
      this.steps = this.orderService.buildSteps(this.order);
    });

    if (this.order.comments && Utilities.isJsonString(this.order.comments)) {
      this.order.advanceInfo = JSON.parse(this.order.comments)
    }

  }

  ngOnChanges() {
    this.steps = this.orderService.buildSteps(this.order);
  }

  ngOnDestroy() {
    try{ $("body").scannerDetection(false);}catch{}

  }

  processBarcode(barcode: string, currentPage) {

    this.apiService.getBarcodeTypeByBarcode(this.shopService.currentShop.id, barcode).subscribe(r => {
      if (r.barcodeType == BarcodeType.Product) {
        if (!r.data) {
          currentPage.snotifyService.error("Mã không có trong hệ thống!", "");
          return;
        }
        var productBarcode = r.data as ProductBarcode;
        if (productBarcode.isSold) {
          currentPage.snotifyService.error("Bánh đã được bán!", "");
          return;
        }
        //link

        var dialogRef= this.dialog.open(OrderLinkConfirmComponent);
        dialogRef.afterClosed().subscribe(r=>{

          if(r){
            this.candidate = _.find(this.order.orderDetails, { barcode: null, unitPrice: productBarcode.price }) as any;
            this.candidate.barcode = productBarcode.barcode;
            this.candidate.description = this.barcodeService.getCategoryName(productBarcode.productCategoryBarcodeId);
            this.candidate.isSold = true;
            this.orderDetailService.updateOrderDetail(this.candidate).subscribe(result => {
              if (result) {
                this.snotifyService.success("Liên kết mã vạch thành công!", "");
              }
            })
          }



        })

      }

    })

  }

  getImage(link) {
    return Utilities.replaceImageLink(link, 120, 120);
  }

  getOrder() {
    this.apiService.getOrder(this.orderId).subscribe(r => {
      this.order = r;
      console.log(r);
      if (this.order.voucher) {
        switch (this.order.voucher.voucherType) {
          case VoucherType.Cash:
            this.voucherCash = this.order.voucher.cash;
            break;
          case VoucherType.Gift:
            this.voucherCash = 0;
            break;
          case VoucherType.OrderPercent:
            this.voucherCash = Utilities.getNumberOfPercent(this.order.amount, this.order.voucher.orderPercent);

            break;
        }
      }
    })
  }

  // cancelOrder() {
  //   let dialogRef = this.dialog.open(OrderSkipConfirmDialog, {
  //     panelClass: ["col-md-8", "col-sx-12"],
  //     data: {
  //       order: this.order
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.dialogRef.close();
  //     }
  //   });
  // }

  okToWaiting() {
    this.isLoading = true;
    this.order.status = OrderStatus.Waiting;
    this.apiService.updateOrder(this.order).subscribe(r => {
      this.responseMessage = "Tiếp nhận đơn bánh thành công !"
    });
  }

  okToDone() {
    this.orderService.okToDone(this.order);
    this.dialogRef.close();
  }


  openBottomSheet(o): void {
    this.dialogRef.close();
    this.quickOrderService.empty();
    this.orderService.orderEdited.emit(o);

  }

  // printOrder() {
  //   this.printService.printOrder(this.viewContainerRef, this.order, this.order.customer);
  // }

  // resizeImage(a){
  //   //child.image = Utilities.replaceImageLink(child.image, window.innerWidth, window.innerHeight);
  //   this.dialog.open(NgxFloatingImgComponent, {
  //     panelClass: 'col-md-12',
  //     data: {
  //       attachment: a
  //     }
  //   })
  // }


}


