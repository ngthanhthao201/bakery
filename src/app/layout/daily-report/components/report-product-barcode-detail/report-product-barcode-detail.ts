import { Component } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { Inject } from "@angular/core";
import { ProductBarcode } from "../../../../shared/models/product-barcode.model";
import { BarcodeService } from "../../../../shared/services/barcode.service";
import { Router } from "@angular/router";

@Component({
    selector: 'report-product-barcode-detail',
    templateUrl: 'report-product-barcode-detail.html',
    styleUrls: ['report-product-barcode-detail.scss'],
  })
  export class ReportProductBarcodeDetail {
    productBarcodes:Array<ProductBarcode>=[];
    constructor( @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private bottomSheetRef: MatBottomSheetRef<ReportProductBarcodeDetail>,
    public barcodeService: BarcodeService, ) {

        this.productBarcodes = data.productBarcodes.reverse();


    }


  }