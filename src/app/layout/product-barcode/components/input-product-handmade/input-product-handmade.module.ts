import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { QRCodeModule } from 'angularx-qrcode';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { InputProductHandmadeComponent } from './input-product-handmade.component';
import { InputProductHandmadeRoutingModule } from './input-product-handmade-routing.module';

@NgModule({
  declarations: [InputProductHandmadeComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    ChartsModule,
    QRCodeModule,
    InputProductHandmadeRoutingModule
  ]
})
export class InputProductHandmadeModule { }
