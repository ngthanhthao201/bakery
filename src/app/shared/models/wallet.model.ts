import { WalletTransaction } from "./wallet-transaction.model";

export class Wallet{   
    id: number;
    shopId: number;
    balance: number
    walletTransactions: WalletTransaction[];
    
}