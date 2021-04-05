import { MaterialProvider } from "./material-provider.model";
import { Material } from "./material.model";

export class MaterialBuyingHistory {
  constructor(shopId){
    this.material = new Material(shopId);
    this.materialProvider = new MaterialProvider(shopId);
  }
    id: number;
    amount: number;
    quantity: number;
    unitPrice: number;

    dateCreated: Date; 
    
    materialProviderId: number;
    materialProvider: MaterialProvider;

    materialId:number;
    material: Material;
  }