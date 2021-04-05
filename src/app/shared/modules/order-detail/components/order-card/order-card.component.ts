import { Component, Input, ViewChild, SimpleChanges, EventEmitter, ViewContainerRef } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { OrderSkipConfirmDialog } from "../order-skip-confirm/order-skip-confirm.component";
import { OrderBottomSheet } from '../order-bottom-sheet/order-bottom-sheet.component';
import { SnotifyService } from "ng-snotify";
import { OrderDetailComponent } from "../order-detail/order-detail.component";
import { Order } from "../../../../models/order.model";
import { OrderService } from "../../../../../layout/orders/services/order.service";
import { ApiService } from "../../../../services/api.service";
import { LinkBarcodeComponent } from "../link-barcode/link-barcode.component";
import { CakeStatus } from "../../../../models/cake-status.enum";
import { OrderStatus } from "../../../../models/order-status.enum";
import { IncomeHeader } from "../../../../models/income-header.model";
import { IncomeTransaction } from "../../../../models/IncomeTransaction";
import { PrintReceiptComponent } from "../print-receipt/print-receipt.component";
import { CurrencyFormatPipe } from "../../../../pipes/currencyformat.pipe";
import { PrintService } from "../../../../services/print.service";
import { Utilities } from "../../../../services/utilities";
import { Router } from "@angular/router";
import { ShopService } from "../../../../services/shop.service";
import * as _ from 'lodash';
import { MemberService } from "../../../../services/member.service";
import { Member } from "../../../../models/member.model";
import { Subject } from "rxjs";
import { TransactionHistoryComponent } from "../../../../../layout/transaction-history/transaction-history.component";
import { ModelHelper } from "../../../../services/model-helper";
import { QuickOrderService } from "../../../../services/quick-order.service";
import { SaleType } from "../../../../models/sale-type.enum";
import { OrderDriverDialog } from "../order-driver/order-driver-dialog.component";
import { NganLuongTransactionDialog } from "../nganLuong-transaction-dialog/nganLuong-transaction-dialog.component";


@Component({
  selector: 'order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']

})
export class OrderCardComponent {
  @Input() order: Order;
  steps = [];
  bakers = [];
  @ViewChild(MatMenuTrigger, { static: true })
  contextMenu: MatMenuTrigger;


  constructor(public orderService: OrderService, private dialog: MatDialog, private apiService: ApiService, public quickOrderService: QuickOrderService,
    private snotifyService: SnotifyService, private bottomSheet: MatBottomSheet,
    private router: Router,
    private printService: PrintService,
    private shopService: ShopService, public memberService: MemberService,
    private viewContainerRef: ViewContainerRef, ) {

  }

  ngOnInit() {

    if (this.order.comments && Utilities.isJsonString(this.order.comments)) {
      this.order.advanceInfo = JSON.parse(this.order.comments)
    }

    this.getBakers();

  }

  selectedBaker(baker) {
    this.order.orderCakeStatus.memberId = baker.id;

  }

  ngOnChanges() {
    this.steps = this.orderService.buildSteps(this.order);

  }

  openOrderDetail() {
    this.apiService.getOrder(this.order.id).subscribe(r => {
      console.log(r);
      let dialogRef = this.dialog.open(OrderDetailComponent, {
        panelClass: 'col-md-8',
        data: {
          order: r
        }
      });
    });

  }

  printReceipt(): void {
    this.bottomSheet.open(PrintReceiptComponent, {
      data: {
        currentOrder: this.order,
      },
    })

  }

  getBakers() {
    this.apiService.getMembersByShop(this.shopService.currentShop.id).subscribe(r => {
      _.forEach(r, members => {

        _.forEach(members.roleIds, role => {
          if (role == 2) {
            this.bakers.push(members);
          }
        });


      });
    });
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenu.openMenu();
  }


  openCreateDriverRunDialog() {
    if (!this.order.advanceInfo || (this.order.advanceInfo && !this.order.advanceInfo.address) || (this.order.address && !this.order.address.description)) {
      return this.snotifyService.warning("Bạn nên cập nhật địa chỉ trước", "");
    }
    if (this.order.hasDriverRun) {
      return this.snotifyService.info("Đã chọn tài xế giao hàng", "");
    }
    let dialogRef = this.dialog.open(OrderDriverDialog, {
      panelClass: 'col-md-8',
      data: {
        order: this.order
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snotifyService.success("Đã gửi yêu cầu cho tài xế", "")
      }
    });
  }


}
