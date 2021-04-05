import { Member } from "./member.model";
import { Customer } from "./customer.model";

export class ChatMessage {
    connectionId: string;
    chatRoomName: string;
    memberId: number;
    member: Member;
    customerId: number;
    customer:Customer;
    message: string;
    createdDate: Date;
    from: string;
    messageFrom:number;
  }