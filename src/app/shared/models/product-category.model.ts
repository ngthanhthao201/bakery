import { Product } from "./product.model";

export class ProductCategory {
    id: number;
    idBarcode: string;
    name: string;
    image:string;
    shopId: number;
    products: Product[];
    isAccessories: boolean;

    productLabelId: number;
    productLabel: any;
  }

