import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ProductBarcode } from '../../../../shared/models/product-barcode.model';
import { BarcodeService } from '../../../../shared/services/barcode.service';
import { Utilities } from '../../../../shared/services/utilities';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ActiveProductBarcodeComponent } from '../active-product-barcode/active-product-barcode.component';

@Component({
  selector: 'app-inactive-product-barcode',
  templateUrl: './inactive-product-barcode.component.html',
  styleUrls: ['./inactive-product-barcode.component.scss']
})
export class InactiveProductBarcodeComponent implements OnInit {

  productBarcodeRemove: ProductBarcode[] = [];
  productBarcodeRemoveRows: ProductBarcode[] = [];

  @ViewChild(DatatableComponent,{static: true}) table: DatatableComponent;

  constructor(public barcodeService: BarcodeService, ) { }

  ngOnInit() {

    this.barcodeService.listChanged.subscribe(r => {
      this.productBarcodeRemove = this.barcodeService.productBarcodesRemove;
      this.productBarcodeRemoveRows = this.barcodeService.productBarcodesRemove;
      console.log(this.productBarcodeRemoveRows);
    })

    // this.productBarcodeRemoveRows = this.barcodeService.productBarcodesRemove;
    
  }

  applyFilterRemoveCakes(filterValue: string) {
    if (!filterValue) {
      this.productBarcodeRemoveRows = this.barcodeService.productBarcodesRemove;
      return;
    }
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

    const temp = this.barcodeService.productBarcodesRemove.filter(function (hbc) {
      return Utilities.searchOnItem(hbc, filterValue);
    });

    // update the rows
    this.productBarcodeRemoveRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
