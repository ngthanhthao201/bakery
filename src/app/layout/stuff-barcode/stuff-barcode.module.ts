import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StuffBarcodeRoutingModule } from './stuff-barcode-routing.module';
import { StuffBarcodeComponent } from './stuff-barcode.component';
import { SharedModule } from '../../shared/modules/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DownloadBarcodeSheetComponent } from './download-barcode-sheet/download-barcode-sheet';
import { QRCodeModule } from 'angularx-qrcode';
import { ConfirmResetStuffsComponent } from './confirm-reset-stuffs/confirm-reset-stuffs.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    StuffBarcodeRoutingModule,
    QRCodeModule
  ],
  declarations: [StuffBarcodeComponent, DownloadBarcodeSheetComponent, ConfirmResetStuffsComponent],
  entryComponents: [DownloadBarcodeSheetComponent, ConfirmResetStuffsComponent]
})
export class StuffBarcodeModule { }
