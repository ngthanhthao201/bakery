import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderModule, SharedPipesModule } from '../../shared';
import { OrderDialog } from '../../shared/dialogs/order-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMaterialModule } from './angular-material.module';
import { DynamicPrintComponent } from '../../layout/dynamic-print/dynamic-print.component';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { NoticeDialog } from '../../shared/dialogs/notice-dialog.component';
import { ProgressTrackerComponent } from '../progress-tracker/progress-tracker.component';
import { RemoveProductBarcodeDialog } from '../../layout/product-barcode/components/remove-product-barcode/remove-product-barcode.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UnderConstructionComponent } from '../../layout/components/under-construction/under-construction.component';
import { OrderDetailsInfoComponent } from './order-detail/components/order-details-info/order-details-info.component';
import { RouterModule } from '@angular/router';
import { ImageUploaderButtonComponent } from '../image-uploader-button/image-uploader-button.component';

declare global {
    interface Navigator {
        usb: {
            getDevices(): Promise<any>,
            requestDevice(filter): Promise<any>,
        }
    }
}


@NgModule({
    imports: [RouterModule ,FormsModule, ReactiveFormsModule ,CommonModule, SharedPipesModule , TranslateModule
        ,PageHeaderModule, AngularMaterialModule, NgxBarcode6Module,QRCodeModule, NgbModule
       
    ],
    exports: [RouterModule , FormsModule, ReactiveFormsModule ,CommonModule, SharedPipesModule , TranslateModule
        ,PageHeaderModule, AngularMaterialModule, NgxBarcode6Module, NgbModule, ImageUploaderButtonComponent ],
    declarations: [OrderDialog, DynamicPrintComponent, NoticeDialog, RemoveProductBarcodeDialog, ImageUploaderButtonComponent],

    entryComponents:[OrderDialog, DynamicPrintComponent, NoticeDialog, RemoveProductBarcodeDialog]



})
export class SharedModule {}
