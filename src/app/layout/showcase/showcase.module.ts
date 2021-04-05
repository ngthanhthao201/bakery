import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseRoutingModule } from './showcase-routing.module';
import { ShowcaseComponent } from './showcase.component';
import { ClipboardModule } from 'ngx-clipboard';
import { SharedModule } from '../../shared/modules/shared.module';
import { NewEditProductDialogComponent } from './products/new-edit-product-dialog/new-edit-product-dialog.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NewEditCategoryDialogComponent } from './new-edit-category-dialog/new-edit-category-dialog.component';
import { PreviewDialogComponent } from './preview-dialog/preview-dialog.component';
import { ProductsComponent } from './products/products.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NewSeriesProductDialogComponent } from './products/new-series-product-dialog/new-series-product-dialog.component';



@NgModule({
    imports: [
        CommonModule,ShowcaseRoutingModule, SharedModule,
        ClipboardModule, CurrencyMaskModule,NgxDatatableModule,
       
    ],
    declarations: [ShowcaseComponent,ProductsComponent, NewEditProductDialogComponent, NewEditCategoryDialogComponent, PreviewDialogComponent, NewSeriesProductDialogComponent],
    entryComponents:[NewEditProductDialogComponent, NewEditCategoryDialogComponent, PreviewDialogComponent]
})
export class ShowcaseModule {}
