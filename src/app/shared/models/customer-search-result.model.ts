import { Gender } from "./gender.enum";
import { Customer } from "./customer.model";
import { CustomerType } from "./customer-type.model";


export class CustomerSearchResult {

    //customershop fields
    buyCount: number;
    createdDate: Date;
    customerId: number;
    externalId: string;
    orderCount: number;
    shopId: number;
    updatedDate: Date;
    
    //customer fields
    id: number;
    name: string;
    image:string;
    gender:Gender;
    isVerify: boolean;
    phoneNumber: string;
    email: string;
    dob: Date;

    customerType: CustomerType;

  }
