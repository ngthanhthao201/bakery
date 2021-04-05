import { Component, OnInit, NgZone } from '@angular/core';
import { routerTransition, ordersTimelineTransition, touchScreenCheckoutTransition } from '../../router.animations';
import { QuickOrderService } from '../../shared/services/quick-order.service';
import { CheckoutCash } from '../../shared/models/checkout-cash.model';
import { CheckoutConfirmDialogComponent } from '../../shared/dialogs/checkout-confirm-dialog/checkout-confirm-dialog.component';
import { LayoutComponent } from '../layout.component';
import { Member } from '../../shared/models/member.model';
import * as _ from 'lodash';
import { ShopService } from '../../shared/services/shop.service';
import { MemberService } from '../../shared/services/member.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-touch-screen-checkout',
  templateUrl: './touch-screen-checkout.component.html',
  styleUrls: ['./touch-screen-checkout.component.scss'],
  animations: [routerTransition(), touchScreenCheckoutTransition()],
})
export class TouchScreenCheckoutComponent implements OnInit {
  checkoutCash: CheckoutCash;
  selectedMember: Member;
  constructor(public quickOrderService: QuickOrderService, private dialog: MatDialog, private ngZone: NgZone, public shopService: ShopService, public memberService: MemberService) { }

  ngOnInit() {
  }

  toggleIsTimeLine(){
    LayoutComponent.isTimelineOpenedToggle.emit(true);
  }

  close(){
    this.quickOrderService.empty();
  }

  selectMember(member){
    this.selectedMember = member;
    this.checkout();
  }

  checkout(){
    if(this.selectedMember && this.selectedMember.id){
      this.quickOrderService.incomeHeader.memberId = this.selectedMember.id;
      _.each(this.quickOrderService.incomeHeader.incomeTransactions, t=>{
        t.memberId = this.selectedMember.id;
      })
    }
 
    this.checkoutCash = new CheckoutCash();
        this.checkoutCash.moneyCake = this.quickOrderService.getTotal();
        let dialogRef = this.dialog.open(CheckoutConfirmDialogComponent, {
            panelClass: ["col-md-9"],
            data: {
                checkoutCash: this.checkoutCash,
                currentCustomer: {},
                incomeHeader : this.quickOrderService.incomeHeader,
            }
          });
      
          dialogRef.afterClosed().subscribe(result => {
            if (result) {       
                  this.checkoutCash = result;
                  this.ngZone.run(() => {
                  this.quickOrderService.incomeHeader.incomeTransactions = [];
                  this.quickOrderService.empty();
                }); 
            }
          });
  }

}
