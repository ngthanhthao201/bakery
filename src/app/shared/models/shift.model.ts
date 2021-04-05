import { ExpenseTransaction } from "./expense-transaction.model";
import { IncomeTransaction } from "./IncomeTransaction";
import { HardBlockProductBarcode } from "./hard-block-product-barcode.model";
import { ProductBarcode } from "./product-barcode.model";
import { ShiftSnapShot } from "./shift-snap-shot.model";

export class Shift{
  id: number;
    name: string;
    expenseTransactions : Array<ExpenseTransaction>;
    incomeTransactions : Array<IncomeTransaction>;
    hardBlockProductBarcodes : Array<HardBlockProductBarcode>;
    productBarcodes: Array<ProductBarcode>;
    shiftSnapShots: Array<ShiftSnapShot>;
    totalAmount: number;
    stuffs: any;
    cakeCategories: any;
    priceCategories:any;
    orderIndex: number;
  totalAmountBigCake: number;

  firstTransactionTime: Date;
  lastTransactionTime: Date;
}