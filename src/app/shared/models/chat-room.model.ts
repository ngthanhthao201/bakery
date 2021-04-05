import { Member } from "./member.model";
import { Customer } from "./customer.model";
import { ChatType } from "./chat-type.enum";

export class ChatRoom {
    name: string;
    chatType: ChatType;
    customerId: number;
    customer: Customer;
    lastMessage: string;
    updatedDate: Date;
    createdDate: Date;
    orderId: number;
    pageId: string;
  }