import { ExpenseTransaction } from "./expense-transaction.model";
import * as _ from 'lodash';
import { MaterialProvider } from "./material-provider.model";
export class ExpenseHeader {
   constructor(shopId: number){
      this.shopId = shopId;
      this.materialProvider = new MaterialProvider(shopId);
      this.dateCreated = new Date();
   }
    
    id: number;
    shopId: number;
    description: string;
    idNumber: string;
    expenseTransactions: ExpenseTransaction[];
    dateCreated: Date;
    amount: number;
    materialProvider: MaterialProvider;
    isFullPaid: boolean;
  }
