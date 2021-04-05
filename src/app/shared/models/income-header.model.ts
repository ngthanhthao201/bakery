import { IncomeTransaction } from "./IncomeTransaction";
import * as _ from 'lodash';

export class IncomeHeader {
    id: number;
    idNumber: string;
    description: string;
    shopId: number;
    memberId: number;
    customerId: number;
    incomeTransactions: IncomeTransaction[];
    dateCreated: Date;
    _amount: number;
    note: string;
    isActive: boolean;
    get amount():number {
      this._amount = _.sumBy(this.incomeTransactions, 'amount');
      return this._amount;
    }
  }