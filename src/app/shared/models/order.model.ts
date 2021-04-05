import { OrderDetail } from "./order-detail.model";
import { Customer } from "./customer.model";
import { OrderStatus } from "./order-status.enum";
import { OrderType } from "./order-type.enum";
import { Voucher } from "./voucher.model";
import { OrderCakeStatus } from "./order-cake-status.model";
import { Attachment } from "./attachment.model";
import { Utilities } from "../services/utilities";
import { Member } from "./member.model";
import { RunStatus } from "./run-status.enum";
import { NganLuongTransaction } from "./nganLuong-transaction.model";

export class Order {


    constructor(){
        if (this.comments && Utilities.isJsonString(this.comments)) {
            this.advanceInfo = JSON.parse(this.comments)
          }
       
    }

    id: number;
    orderDetails: OrderDetail[];
    shopId: number;
    amount: number;
    netAmount: number;
    deposit: number =0;
    customer: Customer;
    dateCreated: Date;
    comments: string;
    createdDate: Date;
    updatedDate: Date;
    status: OrderStatus;
    orderCakeStatus: OrderCakeStatus;
    skippedComment: string;
    orderType: OrderType;
    voucher: Voucher;
    deliveryPickupString: string;
    idNumber: string;
    customerId: number;
    deliveryPickupDate: Date;
    deliveryPickupTime: Date;
    memberId: number;
    member: Member;
    doneMemberId: number;
    doneMember: Member;
    receiptCount: number;

    advanceInfo: any;
    advanceComments: any;
    address: any;
    addressId: number;
    cakeImage: string;
    // note: string;
    fee: number = 0;
    lalamoveOrder: any;
    isOnlineOrder: boolean;
    attachments: Attachment[];
    hasDriverRun: boolean;
    runStatus : RunStatus;

    //Payment Full
    nganLuongTransactionOrderCode : string;
    nganLuongTransaction : NganLuongTransaction;
    printedReceiptCount: number;

    isUrgent : boolean;
    uniqueId: string;
  }

