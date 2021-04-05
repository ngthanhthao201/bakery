import { Component } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Inject } from "@angular/core";
import { Utilities } from "../../services/utilities";
import { Product } from "../../models/product.model";
import { QuickOrderService } from "../../services/quick-order.service";
import { IncomeTransaction } from "../../models/IncomeTransaction";

@Component({
    selector: 'full-screen-image',
    templateUrl: 'full-screen-image.component.html',
    styleUrls: ['./full-screen-image.component.scss'],
  })
  export class FullScreenImage {
    product: Product;
    imageLink : string;
    constructor(private quickOrderService: QuickOrderService ,public dialogRef: MatDialogRef<FullScreenImage>, @Inject(MAT_DIALOG_DATA) public data: any){
       this.product = data.product;
       this.imageLink = Utilities.replaceImageLink(data.product.image, window.innerWidth, window.innerHeight); 

    }

    orderNow(){
      var newTransaction = new IncomeTransaction();
      newTransaction.date = new Date();
      newTransaction.description = this.product.name;
      newTransaction.quantity = 1;
      newTransaction.unitPrice = this.product.sellingPrice;
      newTransaction.amount = newTransaction.unitPrice * newTransaction.quantity;
      this.quickOrderService.add(newTransaction, true);
      this.quickOrderService.requestIsOrder(true);
      this.dialogRef.close();
    }
  }