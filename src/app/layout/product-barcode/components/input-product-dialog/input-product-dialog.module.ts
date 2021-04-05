import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { QRCodeModule } from 'angularx-qrcode';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { InputProductDialogComponent } from './input-product-dialog.component';
import { InputProductDialogRoutingModule } from './input-product-dialog-routing.module';

@NgModule({
  declarations: [InputProductDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    ChartsModule,
    QRCodeModule,
    InputProductDialogRoutingModule
  ]
})
export class InputProductDialogModule { }
