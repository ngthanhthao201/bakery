// ======================================



// 

// ======================================

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import * as _ from 'lodash';
import { Order } from '../models/order.model';
import { Shop } from '../models/shop.model';
import { ProductCategory } from '../models/product-category.model';
import * as moment from 'moment';
import { Review } from '../models/review.model';
import { DatePipe } from '@angular/common';
import { isToday } from 'date-fns';
import { CustomerSearchResult } from '../models/customer-search-result.model';
import { Customer } from '../models/customer.model';
import { CustomerShop } from '../models/customer-shop.model';
import { IncomeTransaction } from '../models/IncomeTransaction';
import { SaleType } from '../models/sale-type.enum';

@Injectable({ providedIn: 'root' })
export class ModelHelper {

    public static addQuickPrice(quickOrderService, snotifyService ,name, type: SaleType, price, barcode = null, quantity = 1) {

        if ( (type == SaleType.DiscountMoney || type == SaleType.DiscountPercent) && quickOrderService.checkDiscountExisted()) {
            snotifyService.warning("Chỉ được áp dụng 1 KHUYẾN MÃI!", "");
            return; 
        }
        var newTransaction = new IncomeTransaction();
        newTransaction.quantity = quantity;
        newTransaction.date = new Date();
        newTransaction.description = name;
        newTransaction.unitPrice = price;
        newTransaction.barcode = barcode;
        newTransaction.discountType = type;
        
        if (newTransaction.discountType == SaleType.DiscountPercent) {
            newTransaction.discountPercent = price;
            var total = quickOrderService.getTotal();
            var newPrice = (newTransaction.discountPercent * quickOrderService.getTotal())/100 ;
            newTransaction.unitPrice =  newPrice  ;
        }
        newTransaction.amount = newTransaction.unitPrice *  newTransaction.quantity;

        

        quickOrderService.add(newTransaction, true);

        quickOrderService.reCaclPercent();

    }

   public static toCustomer(customerSearchResult: CustomerSearchResult):Customer {
        var result= new Customer();
        result.id = customerSearchResult.id;
        result.name = customerSearchResult.name;
        result.dob = customerSearchResult.dob;
        result.email = customerSearchResult.email;
        result.gender = customerSearchResult.gender;
        result.image = customerSearchResult.image;
        result.isVerify = customerSearchResult.isVerify;
        result.phoneNumber = customerSearchResult.phoneNumber;
        return result;
    }

    public static toCustomerShop(customerSearchResult: CustomerSearchResult):CustomerShop {
        var result= new CustomerShop();
        result.customerId = customerSearchResult.id;
        result.buyCount = customerSearchResult.buyCount;
        result.orderCount = customerSearchResult.orderCount;
        result.shopId = customerSearchResult.shopId;
        result.createdDate = customerSearchResult.createdDate;
        result.externalId = customerSearchResult.externalId;
        result.customerType = customerSearchResult.customerType;
        return result;
    }
}