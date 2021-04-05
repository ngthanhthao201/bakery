import { Customer } from "./customer.model";
import { CustomerType } from "./customer-type.model";

export class CustomerShop {
    buyCount: number;
    createdDate: Date;
    customerId: number;
    externalId: string;
    orderCount: number;
    shopId: number;
    updatedDate: Date;
    customer : Customer;
    customerType: CustomerType;
    customerTypeId: number;
    points: number;
  }
