import { Customer } from "./customer.model";
import { Order } from "./order.model";
import { IncomeHeader } from "./income-header.model";

export class CustomerCandidateAudit {
    id : string;
    customerId: number;
    customer: Customer;

    orderId : number;
    order: Order;

    incomeHeaderId: number;
    incomeHeader: IncomeHeader;

    isMessageSent :boolean;
    messageSentMemberId : number;
    messageSentTime : Date;

    isPhoneCalled : boolean;
    phoneCalledMemberId : number;
    phoneCalledTime : Date;

    isMessageAppSent : boolean;
    messageAppSentMemberId : number;
    messageAppSentTime: Date;

  }