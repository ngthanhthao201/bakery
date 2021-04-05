import { HardProductBarcode } from "./hard-product-barcode.model";

export class HardBlockProductBarcode {
  public id : number;
  public checkinDate : Date;
  public lastCheckoutDate : Date;
  public checkinBy : number;
  public lastCheckoutBy : number;
  public count : number;
  public originalCount: number;
  public note: string;
  public hardProductBarcodeId : number;
  public hardProductBarcode : HardProductBarcode;

  destroyedReason: string;
  destroyedTime: Date;
  destroyedCount: number;

  public constructor() {
    this.checkinDate = new Date();
  }
}