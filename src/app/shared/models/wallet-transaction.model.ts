import { WalletTransactionType } from "./wallet-transaction-type.model";

export class WalletTransaction{   
    id: number;
    walletId: number;
    price : number;
    walletTransactionTypeId: number;
    walletTransactionType: WalletTransactionType;
    externalId: string;
    note: string;
    memberId: number;
    
}