import { MaterialBuyingHistory } from "./material-buying-history.model";
import { MaterialProvider } from "./material-provider.model";

export class Material {
    constructor(shopId){
      this.isActive = true;
      this.shopId = shopId;
    }

    id: number;
    name: string;
    image:string;
    shopId: number;
    unit: string;
    unitsInStock: number;
    materialBuyingHistories: MaterialBuyingHistory[];
    isActive: boolean;

    materialProviderId : number;
    materialProvider : MaterialProvider;
  }