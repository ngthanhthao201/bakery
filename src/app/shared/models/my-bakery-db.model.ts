import Dexie from "dexie";

export class MyBakeryDb extends Dexie {
    incomeCustomers: Dexie.Table<any, string>;
  
    constructor() {
      super('Earthquake');
      this.version(1).stores({
        incomeCustomers: 'id,incomeCustomerJson'
      });
    }
  }