import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {FormControl} from '@angular/forms';

import * as _moment from 'moment';
import * as _ from 'lodash';
import { Router } from "@angular/router";
import { SnotifyService } from 'ng-snotify';
import { ProductBarcode } from "../../../../shared/models/product-barcode.model";
import { ApiService } from "../../../../shared/services/api.service";
import { ProductBarcodeService } from "../../services/product-barcode.service";

@Component({
  selector: 'remove-product-barcode-dialog',
  templateUrl: 'remove-product-barcode.component.html',
  styleUrls: ['./remove-product-barcode.component.scss'],
})
export class RemoveProductBarcodeDialog {
  productBarcode: ProductBarcode;
  constructor( private apiService: ApiService, private router: Router, private snotifyService: SnotifyService,
    public dialogRef: MatDialogRef<RemoveProductBarcodeDialog>,
    private productBarcodeService: ProductBarcodeService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.productBarcode = data.productBarcode;
      console.log(this.productBarcode);
  }

  chips = [
    'Bánh hết hạn sử dụng!',
    'Bánh hỏng!',
    'Nhập sai'
  ];

  public ngAfterViewInit(): void {

  }

  ngOnInit() {
    
  }

  ok(){
    this.productBarcode.isActive = false;
    this.productBarcode.destroyedTime = new Date();
    this.productBarcodeService.updateProductBarcode(this.productBarcode).subscribe(r=>{
      this.snotifyService.success("Xóa thành công!","");
      this.dialogRef.close(this.productBarcode);
    })
    // console.log(this.productBarcode);
    
  }



}