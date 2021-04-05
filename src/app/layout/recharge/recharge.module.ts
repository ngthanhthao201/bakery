import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RechargeRoutingModule } from './recharge-routing.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { RechargeComponent } from './recharge.component';
import { NganLuongService } from '../../shared/services/ngan-luong.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RechargeRoutingModule
  ],
  declarations: [RechargeComponent],
  providers:[
    NganLuongService
  ]
})
export class RechargeModule { }
