import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import * as _ from "lodash";
import { Router } from "@angular/router";
import { ShopService } from "./shop.service";
import { MaterialProvider } from "../models/material-provider.model";

@Injectable({
    providedIn: 'root'
})
export class MaterialService {
    _materialProviders: MaterialProvider[];

    constructor(private apiService: ApiService, 
        private shopService: ShopService) {
            if(this.shopService.currentShop){
                this.getMaterialProviders();
            }

    }


    public get materialProviders(){
        return this._materialProviders;
    }

   public getMaterialProviders():void{

    this.apiService.getMaterialProviders(this.shopService.currentShop.id).subscribe(result=>{
        this._materialProviders = result;
    })
   }

}

