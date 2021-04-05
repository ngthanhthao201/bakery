import { EventEmitter, Injectable, ComponentFactoryResolver, ViewContainerRef } from "@angular/core";
import { IncomeHeader } from "../models/income-header.model";
import { Customer } from "../models/customer.model";
import { Order } from "../models/order.model";
import { DynamicPrintComponent } from "../../layout/dynamic-print/dynamic-print.component";
import { CheckoutCash } from "../models/checkout-cash.model";
import { QzTrayService } from "./qz-tray.service";


@Injectable({
    providedIn: 'root'
})
export class PrintService {


    public styling = `<style>
    @page {
        size: 5.5in 8.5in;
      }
    body{
        padding: 0pt;
        margin-top: 0pt;
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
.delivery-time{
    font-weight: bold;
    padding: 0pt;
    font-size:16pt;
    text-decoration: underline !important;
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
    font-size:17pt; 
    margin-top:2pt;
    white-space:pre-line;
     border:dotted 1px;
     padding: 2px
}
.sub-comments{
    font-size:22pt; 
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

</style>`;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private qzTrayService: QzTrayService) {

    }

    printMessage(message){

        var connectedPrinter = localStorage.getItem("connectedPrinter");
        if( connectedPrinter  && localStorage.getItem('qz-tray') && localStorage.getItem('qz-tray')=="true"){
            var data = [{
                type: 'html',
                format: 'plain',
                data: `<html><head>${this.styling}</head><body ><p>  ${message} </p>'</body></html>`
            }];
            this.qzTrayService.printData(connectedPrinter, data).subscribe(r => {
            });
            return;
         }

        var mywindow = window.open('', 'PRINT', 'height=400,width=600');
        mywindow.document.write('<html><head><title>' + document.title + '</title>');
        mywindow.document.write('</head><body>');
        // mywindow.document.write('<h1>' + document.title  + '</h1>');
        mywindow.document.write('<p>' + message + '</p>');
        mywindow.document.write('</body></html>');
         mywindow.print();
        mywindow.close();

    }

    printCheckOut(viewContainerRef :ViewContainerRef, incomeHeader: IncomeHeader, customer: Customer, checkoutCash: CheckoutCash){
        let componentFactory = this.componentFactoryResolver
        .resolveComponentFactory(DynamicPrintComponent);
      viewContainerRef.clear();
      let componentRef = viewContainerRef.createComponent(componentFactory);
      let dynamicPrintComponent: DynamicPrintComponent = <DynamicPrintComponent>componentRef.instance;
      dynamicPrintComponent.printCheckOut(incomeHeader, customer, checkoutCash); 
    }

    printOrder (viewContainerRef :ViewContainerRef, order: Order, customer: Customer){
        let componentFactory = this.componentFactoryResolver
        .resolveComponentFactory(DynamicPrintComponent);
      viewContainerRef.clear();
      let componentRef = viewContainerRef.createComponent(componentFactory);
      let dynamicPrintComponent: DynamicPrintComponent = <DynamicPrintComponent>componentRef.instance;
      dynamicPrintComponent.printOrder(order, customer); 
      
    }

    kickCashDrawer(){
        var data = [
            { type: 'raw', data: '', options: { language: "ESCPOS", dotDensity: 'double' } },
            '\x10' + '\x14' + '\x01' + '\x00' + '\x05',  // Generate Pulse to kick-out cash drawer**
                                                         // **for legacy drawer cable CD-005A.  Research before using.
                                                         // see also http://keyhut.com/popopen4.htm
         ];
         var connectedPrinter = localStorage.getItem("connectedPrinter");
         if(!connectedPrinter){
             return;
         }
         this.qzTrayService.printData(connectedPrinter, data).subscribe(r => {
        });
    }

}

