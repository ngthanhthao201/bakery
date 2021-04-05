import { Component, OnInit, ElementRef } from '@angular/core';
import { ShopService } from '../../shared/services/shop.service';
import { DateTimeService } from '../../shared/services/date-time.service';
import { PrintService } from '../../shared/services/print.service';
import { IncomeHeader } from '../../shared/models/income-header.model';
import { Customer } from '../../shared/models/customer.model';
import { ChangeDetectorRef } from '@angular/core';
import { CheckoutCash } from '../../shared/models/checkout-cash.model';
import { Order } from '../../shared/models/order.model';
import { ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockedPopupWarningComponent } from './blocked-popup-warning/blocked-popup-warning.component';
import { QzTrayService } from '../../shared/services/qz-tray.service';
import * as moment from 'moment';
import * as QRCode from 'qrcodejs2';
import { OrderService } from '../orders/services/order.service';

@Component({
    selector: 'dynamic-print',
    templateUrl: 'dynamic-print.component.html',
    styleUrls: ['dynamic-print.component.scss']
})
export class DynamicPrintComponent implements OnInit {


    public styling = `<style>
    .center-test { width: 100px; height: 100px; border-radius: 50px; border: solid 1px black;text-align: center; background-color: white; }
    .center-test-no-border {  border: solid 0px white; }
    .center-test span { height: 100px; display: inline-block; zoom: 1; *display: inline; vertical-align: middle; }
    .center-test p { display: inline-block; zoom: 1; *display: inline; vertical-align: middle; color: black; font-size: 16pt}

    .center-test-small { width: 50px; height: 50px; border-radius: 25px; border: solid 1px black;text-align: center; background-color: white; }
    .center-test-small span { height: 50px; display: inline-block; zoom: 1; *display: inline; vertical-align: middle; }
    .center-test-small p { display: inline-block; zoom: 1; *display: inline; vertical-align: middle; color: black; font-size: 12pt}

    @page {
        size: 5.5in 8.5in;
      }
      body {
        font: Georgia, "Times New Roman", Times, serif;
        background: #fff;
        font-size: 11pt;
    }

#top:{
    margin-top:-10pt;
}
h5{
    margin:0pt;
    padding:0pt;
}

.separator{
    margin: 0pt !important;
    padding : 0pt !important;
}

p,h2,h3{
    margin: 0pt ;
    padding : 0pt ;
}
.line-separator{

    height:1pt;

    background:#717171;

    border-bottom:1pt solid #313030;

}
tr > th{
    text-align: left;
}
.F-time{
    font-weight: bold;
    padding: 0pt;
    font-size:14pt;
}
.info-shop-name{
    text-align: center;
    margin:0pt;
    padding: 0pt;
}
@media print {
    hr { display:block; }
}

@media screen {
    hr { display:none; }
}

.info-shop-address{
    margin:0pt;
    padding: 0pt;
    text-align: center;
    white-space:pre-line;
    font-size:9pt;
    font-weight: bold;
}

.table.table-transactions{
    border-collapse: collapse;
    width: 100%
}
.table-transactions, .table-transactions th, .table-transactions td {
    border: 1px solid black;
}
.itemtext{

}

.comments{
    font-weight:bold; 
    margin-top:2pt;
    white-space:pre-line;
     border:dotted 1px;
     padding: 2px
}

.dot {
    position: absolute;
    left :-1pt;
    font-size: 14pt;
  }

  hr.style-seven {
    overflow: visible; /* For IE */
    padding: 0;
    border: none;
    border-top: medium double #333;
    color: #333;
    text-align: center;
}
hr.style-seven:after { /* Not really supposed to work, but does */
    content: "Thank You";
    display: inline-block;
    position: relative;
    top: -0.7em;
    font-size: 1em;
    padding: 0 0.25em;
    background: white;
}

.total-order-table .td-value{
    font-size:1em; 
    font-weight:bold;
    float: right;
    text-align: right;
}

</style>`;

    barcodeOrderValue: any;
    qrOrderValue :any;
    incomeHeader: IncomeHeader = {} as IncomeHeader;
    currentCustomer: Customer = {} as Customer;
    checkoutCash: CheckoutCash = {} as CheckoutCash;
    currentOrder: Order;
    receipt4Customer: boolean = true;
    qrCodeValue = "https://tiembanhngon.com/tai-app?idNumber=";
    qrCodeDataUrl = "";

    @ViewChild('orderPOSCustomer', { static: true }) orderPOSCustomer: ElementRef;
    @ViewChild('invoicePOS', { static: true }) invoicePOS: ElementRef;

    constructor(public dateTimeService: DateTimeService, public shopService: ShopService, private changeDetectorRef: ChangeDetectorRef,
        private printService: PrintService,
        private qzTrayService: QzTrayService,
        private orderService: OrderService,
        private dialog: MatDialog) {

    }

    ngOnInit() {
    }

    printCheckOut(incomeHeader: IncomeHeader, customer: Customer, checkoutCash) {

        this.incomeHeader = incomeHeader;
        if (customer) this.currentCustomer = customer;
        if (checkoutCash) this.checkoutCash = checkoutCash;

        this.changeDetectorRef.detectChanges();

        var connectedPrinter = localStorage.getItem("connectedPrinter");
        if (connectedPrinter && localStorage.getItem('qz-tray') && localStorage.getItem('qz-tray') == "true") {
            this.printCheckOutByQz(connectedPrinter);
        }
        else {

            var ele = $('#invoice-POS')[0];
            var mywindow = window.open('', 'PRINT', 'height=400,width=600');
            mywindow.document.write('<html><head><title>' + document.title + '</title>');

            mywindow.document.write(this.styling);
            mywindow.document.write('</head><body>');

            mywindow.document.write(this.invoicePOS.nativeElement.innerHTML);
            mywindow.document.write('</body></html>');
            mywindow.focus();
            mywindow.print();
            mywindow.close();

            return true;
        }

    }

    private printCheckOutByQz(connectedPrinter) {
        var data = [{
            type: 'html',
            format: 'plain',
            data: `<html><head>
                <meta content="text/html;charset=utf-8" http-equiv="Content-Type"> 
                ${this.styling}
                </head><body>
            ${this.invoicePOS.nativeElement.innerHTML}
            </body></html>
        `
        }];
        this.qzTrayService.printData(connectedPrinter, data).subscribe(r => {

        })

    }

    printOrder(order: Order, customer: Customer) {
        if (!order.advanceInfo) {
            order.advanceInfo = JSON.parse(order.comments) || {};
        }

        try{
            this.orderService.plusPrintedReceiptCount(order.id, 1).subscribe(a=>{})
        }catch(err){

        }


        this.currentCustomer = order.customer || customer;
        var receiptCount = parseInt(localStorage.getItem('receiptCount')) || 2;
        if (order.receiptCount > 0) {
            receiptCount = order.receiptCount;
        }
        this.currentOrder = order;
        this.changeDetectorRef.detectChanges();

        if (localStorage.getItem('qz-tray') && localStorage.getItem('qz-tray') == "true") {
            var connectedPrinter = localStorage.getItem("connectedPrinter");
            this.printOrderByQz(connectedPrinter, receiptCount);
            return;
        }

        setTimeout(() => {
            this.receipt4Customer = true;
            this.changeDetectorRef.detectChanges();
            var mywindow = window.open('', 'PRINT', 'height=400,width=600');

            if (!mywindow) {
                let dialogRef = this.dialog.open(BlockedPopupWarningComponent, {
                    panelClass: 'col-md-6',
                    data: {

                    }
                });

                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        this.printOrder(order, customer)
                    }

                });
            }

            mywindow.document.write('<html><head><title>' + document.title + '</title>');
            mywindow.document.write(this.styling);
            mywindow.document.write('</head><body >');
            mywindow.document.write(this.orderPOSCustomer.nativeElement.innerHTML);
            mywindow.document.write('</body></html>');
            mywindow.focus();
            mywindow.print();
            mywindow.close();
        });

        for (var i = 0; i < receiptCount - 1; i++)
            setTimeout(() => {
                this.receipt4Customer = false;
                this.changeDetectorRef.detectChanges();
                var mywindow = window.open('', 'PRINT', 'height=400,width=600');
                if (mywindow) {
                    mywindow.document.write('<html><head><title>' + document.title + '</title>');
                    mywindow.document.write(this.styling);
                    mywindow.document.write('</head><body >');
                    mywindow.document.write(this.orderPOSCustomer.nativeElement.innerHTML);
                    mywindow.document.write('</body></html>');
                    mywindow.focus();
                    mywindow.print();
                    mywindow.close();
                }

            }, 200);
    }

    private async processPrintOrderByQz(connectedPrinter) {




            var data = [
                {
                    type: 'html',
                    format: 'plain',
                    data: `<html><head>${this.styling}</head><body >${this.orderPOSCustomer.nativeElement.innerHTML}</body></html>`
                }
                // {
                //    type: 'pixel', format: 'html', flavor: 'plain',
                //    data: `<html><head>${this.styling}</head><body >${this.orderPOSCustomer.nativeElement.innerHTML}</body></html>`,
                  
                // },
 
            ];

            this.qzTrayService.printData(connectedPrinter, data).toPromise();
           
          
          this.printService.kickCashDrawer();


    }

    private async printOrderByQz(connectedPrinter, receiptCount) {
        //this.qrCodeValue += this.currentOrder.idNumber;
        setTimeout(()=>{
            this.changeDetectorRef.detectChanges();
            if (receiptCount == 1) {
                    this.receipt4Customer = false;
                    this.changeDetectorRef.detectChanges();
                    this.processPrintOrderByQz(connectedPrinter);
                return true;
            }

            this.receipt4Customer = true;
            this.changeDetectorRef.detectChanges();
             this.processPrintOrderByQz(connectedPrinter);

            this.receipt4Customer = false;
            this.changeDetectorRef.detectChanges();
            for (var i = 0; i < receiptCount - 1; i++) {
                  this.processPrintOrderByQz(connectedPrinter);
            }
        },300)

    }


    addPrintListener(mywindow, i, receiptCount, order) {
        var _this = this;
        mywindow.onafterprint = function () {

            if (i === receiptCount) {
                mywindow.close();
                return true;
            } else {

                setTimeout(() => {
                    var ele = $('#order-POS-customer')[0];
                    var secondWindow = window.open('', 'PRINT', 'height=400,width=600');
                    secondWindow.document.write('<html><head><title>' + document.title + '</title>');
                    secondWindow.document.write(_this.styling);
                    secondWindow.document.write('</head><body >');
                    secondWindow.document.write(_this.orderPOSCustomer.nativeElement.innerHTML);
                    secondWindow.document.write('</body></html>');
                    secondWindow.focus();
                    secondWindow.print();
                    i++;
                    _this.addPrintListener(secondWindow, i, receiptCount, order);
                    secondWindow.close();
                });

            }

        }


    }

    getShortIdNumber() {
        this.barcodeOrderValue ='#' + this.currentOrder.idNumber.replace(this.shopService.currentShop.shopCode, "");
        //console.log(this.currentOrder)
        this.qrOrderValue = `${this.shopService.currentShop.website ? this.shopService.currentShop.website :"https://tiembanhngon.com"}/don-banh/${this.currentOrder.uniqueId}`
        return this.barcodeOrderValue;
    }

    getDeliveryTimeCircle(deliveryPickupTime) {
        var result = `${moment(deliveryPickupTime).format('LT')}`
        console.log(result)
        return result;
    }

}
