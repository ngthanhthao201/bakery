import { Component, OnInit, Inject } from '@angular/core';
import { Product } from "../../../shared/models/product.model";
import { Shop } from "../../../shared/models/shop.model";
import { SnotifyService } from 'ng-snotify';
import { ApiService } from "../../../shared/services/api.service";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HardProductBarcode } from '../../../shared/models/hard-product-barcode.model';
import { ShopService } from '../../../shared/services/shop.service';
import { HardBlockProductBarcode } from '../../../shared/models/hard-block-product-barcode.model';
import { BarcodeService } from '../../../shared/services/barcode.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-destroy-stuff-dialog',
  templateUrl: './destroy-stuff-dialog.component.html',
  styleUrls: ['./destroy-stuff-dialog.component.scss']
})
export class DestroyStuffDialogComponent implements OnInit {
  currentProduct: HardProductBarcode;

  memberId: number;
  newHardBlockProductBarcode: HardBlockProductBarcode;

  isLoading = false;
  loadingMessage = "Đang cập nhật bánh";

  constructor(private spinner: NgxSpinnerService,private barcodeService: BarcodeService, public shopService: ShopService, private snotifyService: SnotifyService, private apiService: ApiService, public dialogRef: MatDialogRef<DestroyStuffDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentProduct = data.hardProductBarcode;
    if (!this.currentProduct) {
      this.dialogRef.close();
    }
    this.memberId = parseInt(localStorage.getItem('memberId'));

    this.newHardBlockProductBarcode = new HardBlockProductBarcode();
    this.newHardBlockProductBarcode.destroyedTime = new Date();
    this.newHardBlockProductBarcode.hardProductBarcodeId = this.currentProduct.id;
  }

  ngOnInit() {

  }


  createOrUpdateProduct() {
    
    this.spinner.show();
    this.apiService.createHardBlockProduct(this.newHardBlockProductBarcode).subscribe(result => {
      this.snotifyService.success('Hủy ' + this.newHardBlockProductBarcode.destroyedCount + ' ' + this.currentProduct.name +' thành công','');
      this.currentProduct.total +=this.newHardBlockProductBarcode.count;
      this.spinner.hide();
      this.dialogRef.close();
      
    })
  }


}
