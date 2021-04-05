import { Gender } from "./gender.enum";
import { CustomerShop } from "./customer-shop.model";

export class Customer {
    id: number;
    name: string;
    image:string;
    gender:Gender;
    isVerify: boolean;
    phoneNumber: string;
    email: string;
    dob: Date;
    customerShops:CustomerShop[];
    providerKeyFacebook: string;
  }

