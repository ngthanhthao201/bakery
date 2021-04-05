import { ProductCategory } from "./product-category.model";
import { WebsiteConfig } from "./website-config.model";
import { Wallet } from "./wallet.model";


export class Shop {


    id: number;
    name: string;
    subName; string;
    email:string;
    phoneNumber:string;
    phoneNumber2:string;
    image:string;
    shopCode: string;
    icon: string;
    openTime: string;
    closeTime: string;
    address: any;
    expiredDate: Date;
    productCategories: ProductCategory[];
    websiteConfigs: WebsiteConfig[];
    wallet: Wallet;
  }