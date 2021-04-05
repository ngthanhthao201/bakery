import { Component, OnInit, Inject, Input } from '@angular/core';
import { QzTrayService } from '../../services/qz-tray.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckoutCash } from '../../models/checkout-cash.model';
import { Customer } from '../../models/customer.model';

@Component({
    selector: 'numpad-container',
    templateUrl: './numpad-container.component.html',
    styleUrls: ['./numpad-container.component.scss']
})
export class NumpadContainerComponent implements OnInit {

    @Input() checkoutCash: CheckoutCash;

    constructor() {
    }

    ngOnInit() {

    }

    appendCustomerMoney(num) {
        // moneyCustomer
            if (num == 'back' && this.checkoutCash.moneyCustomer) {
                this.checkoutCash.moneyCustomer = parseInt(this.checkoutCash.moneyCustomer.toString().slice(0, -1));
            }
            if (!this.checkoutCash.moneyCustomer)
                this.checkoutCash.moneyCustomer = parseInt(num.toString());
            else
                this.checkoutCash.moneyCustomer = parseInt(this.checkoutCash.moneyCustomer.toString() + num.toString());

    }

}
