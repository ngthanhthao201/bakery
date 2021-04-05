import { ChatMessage } from "./chat-message.model";
import { Order } from "./order.model";
import { Customer } from "./customer.model";
import { Shop } from "./shop.model";

export class ChatModalModel {

  chatRoomName: string;
    messages: ChatMessage[];
    order: Order;
    customer: Customer;
    shop: Shop;
  }