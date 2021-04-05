export class IncomeTransaction {

    constructor(){
      this.quantity = 1;
    }
    id: number;
    date: Date;
    createdDate: Date;
    amount: number;
    description: string;
    note: string;
    barcode: string;
    quantity: number;
    unitPrice: number;
    image: string;
    memberId: number;
    isActive: boolean;
    destroyedReason : string;
    discountType: number;
    discountPercent: number;
  }

