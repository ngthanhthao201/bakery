import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WithdrawRoutingModule } from './withdraw-routing.module';
import { SharedModule } from '../../shared/modules/shared.module';
import {WithdrawComponent } from './withdraw.component';
import { NganLuongService } from '../../shared/services/ngan-luong.service';
import { UnderConstructionComponent } from '../components/under-construction/under-construction.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WithdrawRoutingModule
  ],
  declarations: [WithdrawComponent, UnderConstructionComponent],
  providers:[
    NganLuongService
  ]
})
export class WithdrawModule { }
