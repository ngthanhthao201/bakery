import { Component, ViewChild, NgZone, ElementRef } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Inject } from "@angular/core";
import { SnotifyService } from 'ng-snotify';
import { Order } from "../../../../models/order.model";
import { DateTimeService } from "../../../../services/date-time.service";
import { ApiService } from "../../../../services/api.service";
import { ShopService } from "../../../../services/shop.service";
import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";

declare var jquery: any;
declare var $: any;
import {
  getSeconds,
  getMinutes,
  getHours,
  getDate,
  getMonth,
  getYear,
  setSeconds,
  setMinutes,
  setHours,
  setDate,
  setMonth,
  setYear
} from 'date-fns';
import { Utilities } from "../../../../services/utilities";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";


@Component({
  selector: 'order-bottom-sheet',
  templateUrl: 'order-bottom-sheet.component.html',
})
export class OrderBottomSheet {
  deliveryPickupDateTime: Date;
  currentOrder: Order;
  currencyMaskOptions = { prefix: '', suffix: 'đ ', thousands: '.', precision: 0 };
  date: Date = new Date();
  dateStruct: NgbDateStruct;
  timeStruct: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };;
  datePicker: any;
  selectedOrderInfoType = 1;

  private onChangeCallback: (date: Date) => void = (date) => {
    this.currentOrder.deliveryPickupTime = date;
    this.date = date;
  };

  @ViewChild("placesRef",{static: true}) placesRef: GooglePlaceDirective;

  public handleAddressChange(address: Address) {
    this.currentOrder.advanceInfo.address = address.formatted_address || address.name;
    if (address.geometry) {
      this.currentOrder.address = { description: this.currentOrder.advanceInfo.address, lat: address.geometry.location.lat(), long: address.geometry.location.lng() };
    }
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dateTimeService: DateTimeService, public dialog: MatDialog,
    private apiService: ApiService, private snotifyService: SnotifyService,
    public dialogRef: MatDialogRef<OrderBottomSheet>, public shopService: ShopService,  private ngZone: NgZone, ) {
    this.currentOrder = data.currentOrder;

    if (this.currentOrder.comments && Utilities.isJsonString(this.currentOrder.comments)) {
      this.currentOrder.advanceInfo = JSON.parse(this.currentOrder.comments)
    }

    if (!this.currentOrder.id) {

    } else {
      this.currentOrder.deliveryPickupTime = new Date(this.currentOrder.deliveryPickupTime);
      this.date = this.currentOrder.deliveryPickupTime;
      this.dateStruct = { day: this.currentOrder.deliveryPickupTime.getDate(), month: this.currentOrder.deliveryPickupTime.getMonth() + 1, year: this.currentOrder.deliveryPickupTime.getFullYear() }
      this.timeStruct = { hour: this.currentOrder.deliveryPickupTime.getHours(), minute: this.currentOrder.deliveryPickupTime.getMinutes(), second: this.currentOrder.deliveryPickupTime.getSeconds() }
    }


  }

  // openLink(event: MouseEvent): void {
  //   this.bottomSheetRef.dismiss();
  //   event.preventDefault();
  // }
  ngOnInit() {
    // this.deliveryPickupDateTime = new Date();



    
  }

  updateDate(): void {
    const newDate: Date = setYear(
      setMonth(
        setDate(this.date, this.dateStruct.day),
        this.dateStruct.month - 1
      ),
      this.dateStruct.year
    );
    this.onChangeCallback(newDate);
  }

  updateTime(): void {
    const newDate: Date = setHours(
      setMinutes(
        setSeconds(this.date, this.timeStruct.second),
        this.timeStruct.minute
      ),
      this.timeStruct.hour
    );
    this.onChangeCallback(newDate);
  }


  cancel() {
    this.dialog.closeAll();
  }

  save() {
    console.log("aa", this.currentOrder)
    if (this.currentOrder.advanceInfo) {
      this.currentOrder.comments = JSON.stringify(this.currentOrder.advanceInfo);
    }
    this.apiService.updateOrder(this.currentOrder).subscribe(r => {
      this.snotifyService.success("Lưu thành công!", "")
    });
    this.dialogRef.close(this.currentOrder);

    
  }




}