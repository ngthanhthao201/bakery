import { EventEmitter, Injectable, ViewContainerRef } from "@angular/core";

@Injectable(
    {providedIn: 'root'}
)
export class DateTimeService {


    constructor() {

    }

    public get now(){
        return new Date();

    }

    public isSameDate(date1: Date, date2: Date){
        return date1.getDate() == date2.getDate() 
        && date1.getMonth() == date2.getMonth()
        && date1.getFullYear() == date2.getFullYear()
    }
 
}

