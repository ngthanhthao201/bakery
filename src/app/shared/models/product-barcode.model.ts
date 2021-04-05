export class ProductBarcode {
    id: number;
    productCategoryBarcodeId:string;
    barcode: string;
    price: number;
    checkinDate: Date;
    checkinBy: number;
    checkoutDate: Date;
    checkoutBy: number;
    isSold: boolean = false;
    shopId: number;
    productCategoryName: any;
    note:string;
    isActive: boolean = true;
    destroyedReason: string;
    destroyedTime: Date;
    image: string;
    isArchived: boolean = false
  }

