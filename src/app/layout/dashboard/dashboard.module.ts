import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SharedPipesModule } from '../../shared';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { MenuItemComponent } from '../../shared/menu-item/menu-item.component';
import { SellCakeSettingsComponent } from './components/sell-cake-settings/sell-cake-settings.component';
import { ShowHideLabelSheet } from './components/show-hide-label/show-hide-label-sheet.component';
import { CheckoutConfirmDialogComponent } from '../../shared/dialogs/checkout-confirm-dialog/checkout-confirm-dialog.component';
import { NewEditPriceDialog } from '../../shared/dialogs/new-edit-price-dialog.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
// import { ColorPickerModule } from '../../../../node_modules/ngx-color-picker';
import { HardProductBarcodesComponent } from './components/hard-product-barcodes/hard-product-barcodes.component';
import { JwPaginationModule } from 'jw-angular-pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
    imports: [
        CommonModule,
        SharedPipesModule,
        SharedModule,
        CurrencyMaskModule,
      //  ColorPickerModule,
        JwPaginationModule,
        NgxPaginationModule,
        DashboardRoutingModule,
        TabsModule.forRoot()
    ],
    declarations: [
        DashboardComponent, MenuItemComponent, SellCakeSettingsComponent, ShowHideLabelSheet, NewEditPriceDialog, HardProductBarcodesComponent

    ],
    entryComponents:[SellCakeSettingsComponent, ShowHideLabelSheet, NewEditPriceDialog]
})
export class DashboardModule {}
