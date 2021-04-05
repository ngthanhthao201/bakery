// import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { AgmMap, AgmMarker, GeocoderStatus, Geocoder } from '@agm/core';
// import { LalamoveService } from './services/lalamove.service';
// import { orderByComparator } from '@swimlane/ngx-datatable/release/utils';
// import { SnotifyService } from 'ng-snotify';
// import { Address } from 'ngx-google-places-autocomplete/objects/address';
// import * as _ from 'lodash'
// import { Order } from '../shared/models/order.model';
// import { ApiService } from '../shared/services/api.service';
// import { ShopService } from '../shared/services/shop.service';
// import { Utilities } from '../shared/services/utilities';
// import { Observable } from 'rxjs';
// import { CurrencyFormatPipe } from '../shared/pipes/currencyformat.pipe';
// import { NgxSpinnerService } from 'ngx-spinner';

// declare function require(path: string);
// // declare var google: any

// @Component({
//   selector: 'app-lalamove',
//   templateUrl: './lalamove.component.html',
//   styleUrls: ['./lalamove.component.scss']
// })
// export class LalamoveComponent implements OnInit {
//   order: Order;
//   public currentShop;
//   lalamoveOrderResponse;
//   lalamoveOrderId: string;
//   lalamoveOrderObj: any;
//   driverDetail: any;
//   driverLocation: any;

//   remarks: any = "";
//   hasQuote = false;


//   specialRequestsList = [
//     { name: "Dịch vụ thu hộ (miễn phí), thu hộ: ", checked: false, value: "HELP_BUY" },
//     { name: "Thùng giữ nhiệt 40cm (miễn phí)", checked: false, value: "LALABAG_BIG" }
//   ]

//   @ViewChild("AgmMap",{static: true})
//   public agmMap: AgmMap;
//   markerDraggable = true;
//   shopLabel = { color: 'red', text: '1', fontSize: '24px', fontWeight: 'bold' }
//   customerLabel = { color: 'red', text: '2', fontSize: '24px', fontWeight: 'bold' }
//   driverLabel = { color: 'green', text: 'TX', fontSize: '24px', fontWeight: 'bold' }

//   markers: Array<AgmMarker> = [];
//   currentQuote = {};
//   initPosition: any = {};
//   geocoder: Geocoder;

//   constructor(private activatedRoute: ActivatedRoute,
//     private apiService: ApiService,
//     private spinner: NgxSpinnerService,
//     private shopService: ShopService,
//     private changeDetectorRef: ChangeDetectorRef,
//     private lalamoveService: LalamoveService,
//     private snotifyService: SnotifyService
//   ) {
  
//   }

//   ngOnInit() {
//     this.currentShop = this.shopService.currentShop;
//     this.initPosition = {
//       lat: this.currentShop.address.lat,
//       long: this.currentShop.address.long
//     }
//     this.getOrder();
//   }


//   public handleAddressChange(address: Address) {
//     this.order.advanceInfo.address = address.formatted_address || address.name;
//     if (address.geometry) {
//       this.order.address = { description: this.order.advanceInfo.address, lat: address.geometry.location.lat(), long: address.geometry.location.lng() };
//       this.getQuote();
//       this.initPosition.lat = this.order.address.lat;
//       this.initPosition.long = this.order.address.long;
//       this.agmMap.triggerResize(true);
//     }
//   }

//   ngAfterViewInit() {
//     // setTimeout(()=>{
//     //   console.log(this.agmMap);
//     //   this.agmMap.idle.subscribe(r=>{
//     //     alert('');
//     //     this.agmMap.triggerResize();
//     //   })
//     //   this.agmMap.triggerResize();
//     //  // this.agmMap.
//     // },500)

//   }

//   servicesChanged(e) {
//     this.getQuote()
//   }

//   getOrder() {
//     this.apiService.getOrder(this.activatedRoute.snapshot.params.orderId).subscribe(r => {
//       this.order = r;
//       try{
//         this.order.advanceInfo = JSON.parse(this.order.comments);

//       }catch(err){
//         this.order.advanceInfo = {};

//       }
//       if (this.order.lalamoveOrder) {
//         this.lalamoveOrderId = this.order.lalamoveOrder.customerOrderId;
//         if (this.lalamoveOrderId) {
//           this.getLalamoveOrderDetail();
//         }
//       }
//       else {
//         this.getQuote();
//       }
//     })
//   }

//   getLalamoveOrderDetail() {
//     this.lalamoveService.getOrderDetail(this.lalamoveOrderId).subscribe(llo => {
//       this.lalamoveOrderObj = llo;
//       this.getDriverDetail()
//     })
//   }

//   getDriverDetail() {
//     this.lalamoveService.getDriverDetail(this.lalamoveOrderId, this.lalamoveOrderObj.driverId).subscribe(r => {
//       this.driverDetail = r;
//     });

//     Observable.interval(5000).subscribe(r=>{
//     this.getDriverLocation();
//     })
//   }

//   getDriverLocation() {
//     this.lalamoveService.getDriverLocation(this.lalamoveOrderId, this.lalamoveOrderObj.driverId).subscribe(r => {
//       r.location.lat = parseFloat(r.location.lat);
//       r.location.lng = parseFloat(r.location.lng);
//       this.driverLocation = r;
//     })
//   }

//   getQuote() {
//     try{
//     this.spinner.show();
//     var body = this.buildLalamoveVM(this.remarks);
//     this.lalamoveService.getQuote(this.shopService.currentShop.id, body).subscribe(r => {
//       console.log(r);
//       this.currentQuote = r;
//       this.hasQuote = true;
      
//     }, err => {
//       var error = err.json();
//       console.log(error);
//       switch (error.message) {
//         case "ERR_OUT_OF_SERVICE_AREA":
//           this.snotifyService.error("Ngoài vùng phục vụ của lalamove");
//           this.hasQuote = false;
//       }

//     })
//   }
//   catch(err){

//   }
//   finally{
//     this.spinner.hide()
//   }
//   }

//   placeAppointmentOrder() {
//     this.spinner.show();
//     var body = this.buildLalamoveVM(this.remarks) as any;
//     body.quotedTotalFee = {
//       amount: (this.currentQuote as any).totalFee,
//       "currency": "VND"
//     }
    
//     this.lalamoveService.placeOrder(this.shopService.currentShop.id, this.order.id, body).subscribe(r => {
//       this.spinner.hide();
//       this.lalamoveOrderResponse = r;
//       this.ngOnInit();
//     }, err => {
//       var error = err.json();
//       this.spinner.hide();
//     })

//   }

//   buildLalamoveVM(remarks) {
//     var requests = [];
//     var noteForDriver = "VUI LÒNG LƯU Ý; ĐƠN HẸN GIỜ; GIAO BÁNH KEM"
//     if(this.order.advanceInfo){
//       noteForDriver += "\n Loại Bánh: " + this.order.advanceInfo.size;
//     }
//     _.each(this.specialRequestsList, i => {
//       if (i.checked) {
//         if (i.value == "LALABAG_BIG") {
//           requests.push(i.value);
//           noteForDriver += "\n Thùng giữ nhiệt lớn"
//         }
//         if (i.value == "HELP_BUY") {
//           noteForDriver += "\n Thu hộ " + new CurrencyFormatPipe().transform(this.order.netAmount + this.order.fee - this.order.deposit)
//         }
//       }
//     })

//     noteForDriver += "\n "+this.remarks;

//     return {
//       "lat": this.order.address.lat.toString(),
//       "lng": this.order.address.long.toString(),
//       "addressString": this.order.advanceInfo.address,
//       "customerName": this.order.customer.name,
//       "customerPhone": this.order.customer.phoneNumber,
//       "scheduleAt": (new Date(this.order.deliveryPickupTime)).toISOString(),
//       "specialRequests": requests,
//       "remarks": noteForDriver
//     }
//   }

//   getShopIcon() {

//     return Utilities.replaceImageLink(this.currentShop.icon, 32, 32);
//   }
//   creatAddress(){
    
//     this.order.address = { description: "", lat: this.currentShop.address.lat, long: this.currentShop.address.long };

//     this.initPosition.lat = this.order.address.lat;
//     this.initPosition.long = this.order.address.long;

//     this.agmMap.triggerResize(true);
//   }

//   markerDragEnd(e){

   
//     this.geocoder.geocode({'location': e.coords}, (res, status) => { if (status === GeocoderStatus.OK && res.length) { 
//       this.order.address.description = res[0].formatted_address;
//     } })

//     this.order.address.lat= e.coords.lat;
//     this.order.address.long =e.coords.lng;
//     this.getQuote()
//     this.order.advanceInfo = [];
//   }

// }
