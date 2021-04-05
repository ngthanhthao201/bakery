import { Component, Input, SimpleChanges, ViewContainerRef, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { OrderSkipConfirmDialog } from "../order-skip-confirm/order-skip-confirm.component";
import { SnotifyService } from "ng-snotify";
import { OrderDetailComponent } from "../order-detail/order-detail.component";
import { Order } from "../../../../models/order.model";
import { OrderService } from "../../../../../layout/orders/services/order.service";
import { ApiService } from "../../../../services/api.service";
import { LinkBarcodeComponent } from "../link-barcode/link-barcode.component";
import { PrintReceiptComponent } from "../print-receipt/print-receipt.component";
import { PrintService } from "../../../../services/print.service";
import { Utilities } from "../../../../services/utilities";
import { Router } from "@angular/router";
import { ShopService } from "../../../../services/shop.service";
import * as _ from 'lodash';
import { MemberService } from "../../../../services/member.service";
import { QuickOrderService } from "../../../../services/quick-order.service";
import { OrderDriverDialog } from "../order-driver/order-driver-dialog.component";
import { NganLuongTransactionDialog } from "../nganLuong-transaction-dialog/nganLuong-transaction-dialog.component";

@Component({
    selector: 'order-button',
    templateUrl: './order-button.component.html',

})

export class OrderButtonComponent implements OnInit {
    @Input() order: Order;

    constructor(public orderService: OrderService, private dialog: MatDialog, private apiService: ApiService, public quickOrderService: QuickOrderService,
        private snotifyService: SnotifyService,
        private router: Router,
        private printService: PrintService,
        private shopService: ShopService, public memberService: MemberService,
        private viewContainerRef: ViewContainerRef, ) {

    }

    ngOnInit() {

        if (this.order.comments && Utilities.isJsonString(this.order.comments)) {
            this.order.advanceInfo = JSON.parse(this.order.comments)
        }
    }


    linkBarcode() {
        this.dialog.closeAll();

        let dialogRef = this.dialog.open(LinkBarcodeComponent, {
            panelClass: "col-md-6",
            data: {
                currentOrder: this.order
            },
        })
        dialogRef.afterClosed().subscribe(r => {
            if (r) {

            }
        });
    }

    cancelOrder() {
        this.dialog.closeAll();

        let dialogRef = this.dialog.open(OrderSkipConfirmDialog, {
            panelClass: ["col-md-8", "col-sx-12"],
            data: {
                order: this.order
            }

        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                dialogRef.close();
                this.orderService.ordersChanged.emit(null);
            }
        });
    }

    editOrder(): void {
        this.dialog.closeAll();
        setTimeout(() => {
            this.quickOrderService.empty();
            this.apiService.getOrder(this.order.id).subscribe(o => {
                this.orderService.orderEdited.emit(_.cloneDeep(o));
            });
        }, 250);

    }

    lalamove() {
        this.dialog.closeAll();
        if (!this.order.advanceInfo || (this.order.advanceInfo && !this.order.advanceInfo.address)
            || (this.order.address && !this.order.address.description)
            || !this.order.customer || (this.order.customer && this.order.customer.phoneNumber == '0')) {
            return this.snotifyService.warning("Bạn phải cập nhật Địa Chỉ và Thông Tin Khách trước", "");
        }
        window.open("/lalamove/" + this.order.id, '_blank')
    }

    linkToChatOrder() {
        this.dialog.closeAll();

        var roomName = Utilities.buildRoomNameFromOrder(this.order, this.order.shopId)
        this.router.navigate(['chats'], { queryParams: { roomName: roomName } });
    }

    openCreateDriverRunDialog() {
        this.dialog.closeAll();
        if (!this.order.advanceInfo || (this.order.advanceInfo && !this.order.advanceInfo.address)
            || (this.order.address && !this.order.address.description)
            || !this.order.customer || (this.order.customer && this.order.customer.phoneNumber == '0')) {
            return this.snotifyService.warning("Bạn phải cập nhật Địa Chỉ và Thông Tin Khách trước", "");
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

    async  printOrder() {
        this.dialog.closeAll();
        if(!this.order.orderDetails || this.order.orderDetails.length ==0){
          this.order = await this.apiService.getOrder(this.order.id).toPromise();

        }
        this.printService.printOrder(this.viewContainerRef, this.order, this.order.customer)
        
        
    }

    createNganLuongTransactionDialog() {
        this.dialog.closeAll();

        this.dialog.open(NganLuongTransactionDialog, {
            panelClass: 'col-md-5',
            data: {
                order: this.order
            }
        });
    }


}
