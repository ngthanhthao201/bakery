import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { OrderSkipConfirmDialog } from './components/order-skip-confirm/order-skip-confirm.component';
import { OrderBottomSheet } from './components/order-bottom-sheet/order-bottom-sheet.component';
import { SharedModule } from '../shared.module';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LinkBarcodeComponent } from './components/link-barcode/link-barcode.component';
import { PrintReceiptComponent } from './components/print-receipt/print-receipt.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { OrderStatusPipe } from './pipes/order-status.pipe';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { OrderConfirmNoDialog } from './components/order-card-confirm/order-confirm-no/order-confirm-no.component';
import { OrderCardConfirmComponent } from './components/order-card-confirm/order-card.confirm.component';
import { ProgressTrackerComponent } from '../../progress-tracker/progress-tracker.component';
import { NgxFloatingImgComponent } from '../../dialogs/ngx-floating-img/ngx-floating-img.component';
import { NgxFloatingImgService } from '../../dialogs/ngx-floating-img/ngx-floating-img.service';
import { DeviceDetectorService } from '../../dialogs/ngx-floating-img/device-detector.service';
import { MobileTouchService } from '../../dialogs/ngx-floating-img/mobile-touch.service';
import { NGX_FLOATING_IMG_CLIENT_OPTIONS_TOKEN, NGX_FLOATING_IMG_OPTIONS_TOKEN, NGX_FI_WINDOW, NGX_FLOATING_IMG_DEFAULT_OPTIONS } from '../../dialogs/ngx-floating-img/ngx-floating-img';
import { NGXFloatingImgOptions } from '../../dialogs/ngx-floating-img/model/ngx-floating-img-options';
import { OrderDriverDialog } from './components/order-driver/order-driver-dialog.component';
import { NganLuongTransactionDialog } from './components/nganLuong-transaction-dialog/nganLuong-transaction-dialog.component';
import { OrderButtonComponent } from './components/order-button/order-button.component';
import { OrderDetailsInfoComponent } from './components/order-details-info/order-details-info.component';
import { OrderLinkConfirmComponent } from './components/order-link-confirm/order-link-confirm.component';


export function ngxFIWindowFactory() {
    return typeof window !== 'undefined' && window.document ? window : undefined;
}

export function ngxFIOptionsFactory(ngxFloatingImgOptions: NGXFloatingImgOptions) {
    return Object.assign({}, NGX_FLOATING_IMG_DEFAULT_OPTIONS, ngxFloatingImgOptions);
}
@NgModule({
    imports: [
        CommonModule, RouterModule, SharedModule, NgbDropdownModule, NgbModule,
        CurrencyMaskModule,
        GooglePlaceModule,

    ],
    exports: [SharedModule, OrderCardComponent, OrderDetailsInfoComponent,OrderStatusPipe, OrderCardConfirmComponent, OrderButtonComponent],
    declarations: [OrderDetailComponent, OrderCardComponent, OrderSkipConfirmDialog, OrderBottomSheet,
        LinkBarcodeComponent, PrintReceiptComponent, OrderStatusPipe, OrderCardConfirmComponent, OrderConfirmNoDialog,
        ProgressTrackerComponent, NgxFloatingImgComponent, OrderDriverDialog, NganLuongTransactionDialog, OrderButtonComponent,
        OrderDetailsInfoComponent,
        OrderLinkConfirmComponent
    ],

    providers: [NgxFloatingImgService,
        DeviceDetectorService,
        MobileTouchService,
        { provide: NGX_FLOATING_IMG_CLIENT_OPTIONS_TOKEN, useValue: {}, multi: false },
        { provide: NGX_FLOATING_IMG_OPTIONS_TOKEN, useFactory: ngxFIOptionsFactory, deps: [NGX_FLOATING_IMG_CLIENT_OPTIONS_TOKEN] },
        { provide: NGX_FI_WINDOW, useFactory: ngxFIWindowFactory }],
    entryComponents: [OrderDetailComponent, OrderBottomSheet, LinkBarcodeComponent, PrintReceiptComponent, 
        OrderSkipConfirmDialog, OrderConfirmNoDialog, OrderDriverDialog, NganLuongTransactionDialog,OrderDetailsInfoComponent]
})
export class OrderDetailModule { }
