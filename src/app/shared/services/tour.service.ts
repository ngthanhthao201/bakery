import { Injectable } from "@angular/core";
import * as _ from "lodash";
import * as hopscotch from 'hopscotch'

@Injectable({
    providedIn: 'root'
})
export class TourService {

    tours =
        {
            productsComponent: {
                id: "productsComponent",
                steps: [
                    {
                        title: "Loại bánh",
                        content: "Click để tạo bánh mới",
                        target: "new-edit-product-dialog",
                        placement: "right"
                    },
                ]
            },
            
            showcaseComponent :
            {
                id: "showcaseComponent",
                steps: [
                    {
                        title: "Album bánh",
                        content: "Click để tạo album bánh",
                        target: "albumBanh",
                        placement: "right"
                    },
                    {
                        title: "Album bánh",
                        content: "Click để vào album bánh",
                        target: "loaiBanh",
                        placement: "bottom"
                    },
        
                ]
            },
        };


    constructor() {


    }

    public startTour(tourId, isAuto = true) {
        if(isAuto){
            if(localStorage.getItem("tour_" + tourId )){
                return;
            }else{
                localStorage.setItem("tour_" + tourId, "true");
            }
        }
        setTimeout(()=>{
            hopscotch.startTour(this.tours[tourId]);
        }, 500)
        
    }

    public startTourAgain(tourId, isAuto = false) {
        if(isAuto){
            if(localStorage.getItem("tour_" + tourId )){
                return;
            }else{
                localStorage.setItem("tour_" + tourId, "true");
            }
        }
        setTimeout(()=>{
            hopscotch.startTour(this.tours[tourId]);
        }, 500)
        
    }
}

