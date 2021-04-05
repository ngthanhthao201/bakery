import { IncomeTransaction } from "./IncomeTransaction";
import { SellCakeMessageType } from "./sell-cake-message-type.enum";
import { Order } from "./order.model";

export class SellCakeMessage{
    id: number;
    memberId: number;
    shopId: number;
    groupName: string;
    messageType: SellCakeMessageType;
    incomeTransaction: IncomeTransaction;
    order: Order;
    customerPhone: string;
    customerName: string;
    deviceName: string;
}