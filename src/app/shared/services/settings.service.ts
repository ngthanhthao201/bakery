import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {
    private _smallCakeTextLevel: number  = 2 ;
    constructor() {
        if(localStorage.getItem('smallCakeTextLevel')){
            this._smallCakeTextLevel = parseInt(localStorage.getItem('smallCakeTextLevel'));
            if(this._smallCakeTextLevel > 3){
                this._smallCakeTextLevel  = 3
            }
        }

    }

    public get smallCakeTextLevel(){
        return this._smallCakeTextLevel;
    };

    public set smallCakeTextLevel (value){
         this._smallCakeTextLevel = value;
         localStorage.setItem('smallCakeTextLevel', value.toString());
    }

}
