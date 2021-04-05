import { Product } from "./product.model";

export class OrderDetail {
    id: number;
    unitPrice: number;
    quantity: number;
    discount: number;
    productId: number;
    product: Product;

    orderId: number;
    barcode: string;

    description: string;
    isSold : boolean;
  }
