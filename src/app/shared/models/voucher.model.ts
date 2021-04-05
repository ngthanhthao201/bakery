import { VoucherType } from "./voucher-type.enum";

export class Voucher{
    
    id: number;
    shopId: number;
    groupName: string;
    voucherCode: string;
    isUsed: boolean;
    text: string;
    voucherType: VoucherType;
    cash: number;
    orderPercent: number;
    giftName: string;
}