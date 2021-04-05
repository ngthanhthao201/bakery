import { ProductSample } from "./product-sample.model";
import { ProductCategory } from "./product-category.model";
import { CakeSizePrice } from "./cake-size-price.model";

export class Product {
    id: number;
    idNumber: string;
    name: string;
    description: string;
    image:string;
    sellingPrice: number;
    unit: string;
    isActive: boolean;
    cakeSizeTypeId: number;
    productCategoryId: number;
    productCategory: ProductCategory;
    cakeSizePrices: CakeSizePrice[];
  }

