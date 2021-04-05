import { MaterialBuyingHistory } from "./material-buying-history.model";

export class ExpenseTransaction {
    constructor(shopId){
      this.materialBuyingHistory = new MaterialBuyingHistory(shopId);
    }
    id: number;
    dateCreated: Date;
    amount: number;
    fee: number;
    expenseHeaderId: number;
    materialBuyingHistoryId: number;
    materialBuyingHistory: MaterialBuyingHistory;
  }

