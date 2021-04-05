import { NgModule } from '@angular/core';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProviderHistoryDialog } from './providers-warehouse/dialogs/provider-history.component';
import { ExpenseDialog } from '../shared/dialogs/expense-dialog.component';
import { ChartsModule } from 'ng2-charts';
import { IncomeDialog } from '../shared/dialogs/income-dialog.component';
import { TransactionsDetailDialog } from './financial/dialogs/transactions-detail.component';
import { ExpenseTransactionsDetailDialog } from './financial/dialogs/expense-transactions-detail.component';
import { ZaloLoginResponseComponent } from './zalo-login-response/zalo-login-response.component'
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { NewStuffBarcodeDialogComponent } from './stuff-barcode/new-stuff-barcode-dialog/new-stuff-barcode-dialog.component';
import { AddStuffDialogComponent } from './stuff-barcode/add-stuff-dialog/add-stuff-dialog.component';
import { OtherExpenseDialog } from '../shared/dialogs/other-expense-dialog.component';
import { TouchScreenCheckoutComponent } from './touch-screen-checkout/touch-screen-checkout.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { FacebookService } from 'ngx-facebook';
import { PrintBillSettingDialogComponent } from './settings/components/print-bill-setting-dialog/print-bill-setting-dialog.component';
import { FullScreenImage } from '../shared/dialogs/full-screen-image/full-screen-image.component';
import { ImageUploadModule } from "angular2-image-upload";
import { DestroyStuffDialogComponent } from './stuff-barcode/destroy-stuff-dialog/destroy-stuff-dialog.component';
import { SharedModule } from '../shared/modules/shared.module';
import { SidebarComponent } from './components/sidebar-v2/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RemoteSupportComponent } from './components/remote-support/remote-support.component';
import { StoreModule } from '@ngrx/store';
import { OrderDetailModule } from '../shared/modules/order-detail/order-detail.module';
import { CheckoutConfirmDialogComponent } from '../shared/dialogs/checkout-confirm-dialog/checkout-confirm-dialog.component';
import { FooterComponent } from './components/footer/footer.component';
import { ResolveHpbComponent } from './components/resolve-hpb/resolve-hpb.component';
import { PrintService } from '../shared/services/print.service';
import { QRCodeModule } from 'angularx-qrcode';
// import { InputProductDialogComponent } from './product-barcode/components/input-product-dialog/input-product-dialog.component';
import { ConfirmOrdersComponent } from './orders/components/confirm-orders/confirm-orders.component';
import { OrdersTimelineConfirmDialogComponent } from './orders-timeline/orders-timeline-confirm-dialog/orders-timeline-confirm-dialog.component';
import { OrdersTimelineComponent } from './orders-timeline/orders-timeline.component';
// import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';
import { BlockedPopupWarningComponent } from './dynamic-print/blocked-popup-warning/blocked-popup-warning.component';
import { LinkCustomerComponent } from './orders-timeline/link-customer/link-customer.component';
import { ConnectPrintersComponent } from '../shared/dialogs/connect-printers/connect-printers.component';
import { MemberService } from '../shared/services/member.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NumpadContainerComponent } from '../shared/containes/numpad-container/numpad-container.component';
import { AutoFindConnectPrinter } from '../shared/dialogs/auto-find-connect-printer/auto-find-connect-printer.component';
import { NotificationsService } from '../shared/services/notifications.service';
import { NotificationDialogComponent } from './components/navbar/notification-dialog/notification-dialog.component';
import { ZaloOaManagerComponent } from './settings/components/zalo-oa-manager/zalo-oa-manager.component';
import { BlockAndWarningComponent } from './dashboard/components/block-and-warning/block-and-warning.component';
import { ImageUploaderButtonComponent } from '../shared/image-uploader-button/image-uploader-button.component';



@NgModule({
    imports: [
        LayoutRoutingModule,

        SharedModule,
        StoreModule.forRoot({}),
        NgbDropdownModule,
        ImageUploadModule.forRoot(),
        NgbModule,
        CurrencyMaskModule,
        NgxDatatableModule,
        ChartsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        GooglePlaceModule,
        QRCodeModule,
        NgxSpinnerModule,
        OrderDetailModule,
    ],
    exports:[ NumpadContainerComponent],
    providers: [FacebookService, PrintService, MemberService, NotificationsService,
        {provide: OWL_DATE_TIME_LOCALE, useValue: 'vn'},
    ],
    declarations: [ PrintBillSettingDialogComponent,LayoutComponent, SidebarComponent, NavbarComponent,FooterComponent, OrdersTimelineComponent,
    ProviderHistoryDialog, ExpenseDialog, OtherExpenseDialog,IncomeDialog, TransactionsDetailDialog, ExpenseTransactionsDetailDialog,
    ZaloLoginResponseComponent, NewStuffBarcodeDialogComponent, 
    AddStuffDialogComponent, DestroyStuffDialogComponent,TouchScreenCheckoutComponent, ConnectPrintersComponent,
    FullScreenImage, RemoteSupportComponent,
    CheckoutConfirmDialogComponent,ResolveHpbComponent, ConfirmOrdersComponent,
    OrdersTimelineConfirmDialogComponent, BlockedPopupWarningComponent, LinkCustomerComponent, NumpadContainerComponent,
    AutoFindConnectPrinter, NotificationDialogComponent,
    ZaloOaManagerComponent,BlockAndWarningComponent,
    
    ],

    entryComponents: [
      PrintBillSettingDialogComponent, ExpenseDialog, OtherExpenseDialog, IncomeDialog, TransactionsDetailDialog, ExpenseTransactionsDetailDialog,
      NewStuffBarcodeDialogComponent, AddStuffDialogComponent, DestroyStuffDialogComponent,ConnectPrintersComponent,
      FullScreenImage, RemoteSupportComponent,
      CheckoutConfirmDialogComponent, ResolveHpbComponent,OrdersTimelineConfirmDialogComponent,BlockedPopupWarningComponent,
      LinkCustomerComponent, NumpadContainerComponent, AutoFindConnectPrinter, NotificationDialogComponent,BlockAndWarningComponent
    ]

})
export class LayoutModule { }
