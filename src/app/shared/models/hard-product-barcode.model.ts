import { HardBlockProductBarcode } from "./hard-block-product-barcode.model";
import { Utilities } from "../services/utilities";
import { HardSetProductBarcode } from "./hard-set-product-barcode.model";

export class HardProductBarcode {

  public id: number;
  public barcode: string;
  public price: number;
  public shopId: number;
  public name: string;
  public total: number;
  public label : string;
  public image : string;

  public hardBlockProductBarcodes: Array<HardBlockProductBarcode>;
  public hardSetProductBarcodes: Array<HardSetProductBarcode>;

  public constructor() {
    this.barcode = "C-" + Utilities.uniqueIdNumber(4);
    this.name = "";
  }
}
