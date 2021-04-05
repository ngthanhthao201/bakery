import { Shop } from "./shop.model";
import { Member } from "./member.model";
import { Customer } from "./customer.model";
import { Order } from "./order.model";
import { NganLuongStatus } from "./nganLuong-status.enum";
import { NganLuongType } from "./nganLuong-type.enum";

export class NganLuongTransaction {
    orderCode : string;
    token : string;
    description : string;
    bankCode : string;
    paymentMethod : string;
    nganLuongRequest : string;
    nganLuongResponse : string;
    shopId : number;
    shop : Shop;
    memberId : number;
    member : Member;
    customerId : number;
    customer : Customer;
    amount : number;
    orderId : number;
    order : Order;
    isDeposit : boolean;
    nganLuongType : NganLuongType;
    nganLuongStatus : NganLuongStatus;
    
}