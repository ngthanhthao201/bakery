import { Component, OnInit, Inject } from '@angular/core';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { OrderDetailComponent } from '../../../shared/modules/order-detail/components/order-detail/order-detail.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnotifyService } from 'ng-snotify';
import { ShopService } from '../../../shared/services/shop.service';
import * as _moment from "moment";
import { Observable } from 'rxjs';

@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html',
    styleUrls: ['./customer-detail.component.scss'],
})
export class CustomerDetailComponent implements OnInit {

    customerId: any;
    orders: [] =[];
    incomeHeaders: [];
    currentCustomer: any;
    editMode = false;
    currentFile: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private apiService: ApiService, private snotifyService: SnotifyService, private shopService: ShopService,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<CustomerDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

        // this.customerId = activatedRoute.snapshot.queryParams.customerId;
        // this.currentCustomer = data.currentCustomer;
        this.customerId = data.currentCustomer.id;
        console.log(this.customerId);
    }

    ngOnInit() {
        this.getOrders();
        this.getCustomerInfo();
         this.getIncomeHeaders();

        this.incomeHeaders = [];
    }

    getCustomerInfo() {
        this.apiService.getCustomerByCustomerId(this.customerId).subscribe(r => {
            r.dob = _moment(r.dob).format("DD/MM/YY")
            this.currentCustomer = r;
            console.log(this.currentCustomer);

        });
    }

    getOrders() {

            this.apiService.getOrdersHistoryByShopIdustomerId( this.shopService.currentShop.id,this.customerId)
          .subscribe(res => {
            this.orders= res
          })
    }

    getIncomeHeaders() {
        this.apiService.getIncomeHeadersByShopCustomer(this.shopService.currentShop.id, this.customerId).subscribe(r => {
                this.incomeHeaders = r;
        });
    }

    openOrderDetail(orderId) {
        this.apiService.getOrder(orderId).subscribe(r => {
            console.log(r)
            let dialogRef = this.dialog.open(OrderDetailComponent, {
                panelClass: 'col-md-8',
                data: {
                    order: r,
                }
            });
        })
    }

    enterEditMode() {
        this.editMode = true;
    }

    saveCustomer() {
        this.apiService.updateCustomer(this.currentCustomer).subscribe(r => {
            this.editMode = false;
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


    // getFiles(event) {
    //     var file = event.target.files[0];
    //     this.readThis(file);
    // }
    // readThis(file: any): void {

    //     var myReader: FileReader = new FileReader();

    //     myReader.onloadend = (e) => {
    //         var image = myReader.result;
    //         if (image) {
    //             this.apiService.uploadImageAzure(file, image, this.shopService.currentShop.shopCode + "-Avar").subscribe(r => {
    //                 if (r) {
    //                     this.currentCustomer.image = r;
    //                     this.saveCustomer();
    //                 }
    //                 this.snotifyService.success("Cập nhật ảnh thành công", "");
    //             })
    //         } else {
    //             this.saveCustomer();
    //         }
    //     }
    //     myReader.readAsDataURL(file);
    // }

}
