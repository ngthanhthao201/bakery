import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductBarcodeRoutingModule } from './product-barcode-routing.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { ProductBarcodeComponent } from './product-barcode.component';
import { RemoveProductBarcodeDialog } from './components/remove-product-barcode/remove-product-barcode.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts';
import { ActiveProductBarcodeComponent } from './components/active-product-barcode/active-product-barcode.component';
import { SoldProductBarcodeComponent } from './components/sold-product-barcode/sold-product-barcode.component';
import { InactiveProductBarcodeComponent } from './components/inactive-product-barcode/inactive-product-barcode.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    ChartsModule,
    ProductBarcodeRoutingModule,
    QRCodeModule
  ],
  declarations: [ProductBarcodeComponent, ActiveProductBarcodeComponent, SoldProductBarcodeComponent, InactiveProductBarcodeComponent, ],
  entryComponents: [ ],
})
export class ProductBarcodeModule { }
