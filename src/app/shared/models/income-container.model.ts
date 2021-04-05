import { IncomeTransaction } from "./IncomeTransaction";
import * as _ from 'lodash';

export class IncomeContainer {
    id: number;
    incomeTransactions: Array<IncomeTransaction>;
    memberName: string;
    memberId: number;
    date: Date;
    _amount: number;
    idNumber: string;
    get amount():number {
      this._amount = _.sumBy(this.incomeTransactions, 'amount');
      return this._amount;
    }

  }