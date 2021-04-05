import { MaterialBuyingHistory } from "./material-buying-history.model";
import { Material } from "./material.model";

export class MaterialProvider {
  constructor(shopId){
    this.shopId = shopId;
  }
    id: number;
    shopId: number;
    name: string;
    phone:string;
    subPhone: string;
    address: string;
    materials: Material[];
    materialBuyingHistories: MaterialBuyingHistory[];
    image: string;
  }