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
import { MemberService } from '../../../shared/services/member.service';
import { of } from 'rxjs';
import {  delay} from 'rxjs/operators';

@Component({
  selector: 'app-add-stuff-dialog',
  templateUrl: './add-stuff-dialog.component.html',
  styleUrls: ['./add-stuff-dialog.component.scss']
})
export class AddStuffDialogComponent implements OnInit {
  currentProduct: HardProductBarcode;
  currentShop: Shop;
  memberId: number;
  newHardBlockProductBarcode: HardBlockProductBarcode;

  isLoading = false;
  loadingMessage = "Đang cập nhật bánh";

  constructor(private spinner: NgxSpinnerService, private barcodeService: BarcodeService,
    private memberService: MemberService,
     public shopService: ShopService, private snotifyService: SnotifyService, private apiService: ApiService, public dialogRef: MatDialogRef<AddStuffDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentProduct = data.hardProduct;
    if (!this.currentProduct) {
      this.dialogRef.close();
    }
    this.memberId = memberService.currentMember.id;
    shopService.shopChanged.subscribe(r => {
      this.currentShop = shopService.currentShop;
    });
    this.newHardBlockProductBarcode = new HardBlockProductBarcode();
    this.newHardBlockProductBarcode.checkinBy = this.memberId;
    this.newHardBlockProductBarcode.checkinDate = new Date();
    this.newHardBlockProductBarcode.hardProductBarcodeId = this.currentProduct.id;
  }

  ngOnInit() {

  }


  isCheckOutEnable = true;
  createOrUpdateProduct() {

    
    if(!this.isCheckOutEnable){
      this.snotifyService.warning("Bạn đang thao tác quá nhanh!")
      return;
    }

    of().pipe(delay(2000)).subscribe(r=>{
      this.isCheckOutEnable = true;
    });
    this.isCheckOutEnable = false;


    this.spinner.show();
    this.apiService.createHardBlockProduct(this.newHardBlockProductBarcode).subscribe(result => {
      this.snotifyService.success('Thêm ' + this.newHardBlockProductBarcode.count + ' ' + this.currentProduct.name +' thành công', '');
      this.currentProduct.total +=this.newHardBlockProductBarcode.count;
      // 
      this.spinner.hide();
      this.isLoading = false;
      this.dialogRef.close();
    })
  }


}
