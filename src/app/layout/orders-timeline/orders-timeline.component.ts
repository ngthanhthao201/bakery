import { Component, Output, EventEmitter, Input, NgZone, HostListener, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Order } from '../../shared/models/order.model';
import { IncomeHeader } from '../../shared/models/income-header.model';
import { QuickOrderService } from '../../shared/services/quick-order.service';
import { IncomeTransaction } from '../../shared/models/IncomeTransaction';
import { FormControl } from '../../../../node_modules/@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Customer } from '../../shared/models/customer.model';
import { CustomersComponent } from '../customers/customers.component';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { routerTransition, ordersTimelineTransition } from '../../router.animations';
declare var jquery: any;
declare var $: any;
import * as moment from 'moment';
import { Utilities } from '../../shared/services/utilities';
import { OrderDetail } from '../../shared/models/order-detail.model';
import * as _ from 'lodash';
import { BarcodeService } from '../../shared/services/barcode.service';
import { CheckoutConfirmDialogComponent } from '../../shared/dialogs/checkout-confirm-dialog/checkout-confirm-dialog.component';
import { CheckoutCash } from '../../shared/models/checkout-cash.model';
import { ShopService } from '../../shared/services/shop.service';
import { OrderStatus } from '../../shared/models/order-status.enum';
import { OrderService } from '../orders/services/order.service';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { DateTimeService } from '../../shared/services/date-time.service';
import { PrintService } from '../../shared/services/print.service';
import { GooglePlaceDirective } from '../../../../node_modules/ngx-google-places-autocomplete';
import { Address } from '../../../../node_modules/ngx-google-places-autocomplete/objects/address';
import { OrderType } from '../../shared/models/order-type.enum';
import { OnlineOfflineService } from '../../shared/services/offline.service';
import { ViewContainerRef } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { MemberService } from '../../shared/services/member.service';
import { Member } from '../../shared/models/member.model';
import { OrdersTimelineConfirmDialogComponent } from './orders-timeline-confirm-dialog/orders-timeline-confirm-dialog.component';
import { CustomerShop } from '../../shared/models/customer-shop.model';
import { LinkCustomerComponent } from './link-customer/link-customer.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { from } from 'rxjs';
import { CustomerSearchResult } from '../../shared/models/customer-search-result.model';
import { ModelHelper } from '../../shared/services/model-helper';
import { SaleType } from '../../shared/models/sale-type.enum';

import { Attachment } from '../../shared/models/attachment.model';
import { OrderCardComponent } from '../../shared/modules/order-detail/components/order-card/order-card.component';
import { LayoutComponent } from '../layout.component';
import { OrdersComponent } from '../orders/components/orders/orders.component';
import { CurrencyFormatPipe } from '../../shared/pipes/currencyformat.pipe';
import { debounceTime, startWith , map, distinctUntilChanged, switchMap} from 'rxjs/operators';



@Component({
        selector: 'orders-timeline',
        templateUrl: './orders-timeline.component.html',
        styleUrls: ['./orders-timeline.component.scss'],
        animations: [routerTransition(), ordersTimelineTransition()],
})

export class OrdersTimelineComponent {
        newOrder: Order;
        selectedCustomer: Customer;
        newCustomerName: string;
        public SaleType = SaleType;
        searchCtrl: FormControl;
        filteredCustomers: Observable<any[]>;
        customerShop: CustomerShop;
        isOrder: boolean;
        currencyMaskOptions = { prefix: '', suffix: 'đ ', thousands: '.', precision: 0 };
        _currentCustomer: Customer;
        checkoutCash: CheckoutCash = new CheckoutCash();
        deliveryPickupDateTime: Date;
        today = new Date();
        subscription: Subscription;
        selectedOrderInfoType = 2;
        public min = new Date();
        isMinimize: boolean;
        message: string;
        fees = [];
        isPrint: boolean = true;
        file: File;
        isHaveDiscount: boolean = false;
        depositControl: FormControl = new FormControl();
        depositOptions: string[] = [];
        filteredDeposits: Observable<string[]>;
        isTouch: boolean = false;
        isClickUserButton: boolean = false;
        externalIdUserInput: string = "";
        amountTotal: number = 0;
        Number = Number;
        // public static customerExisted: EventEmitter<Customer> = new EventEmitter();
        public static isTouchScreen: EventEmitter<any> = new EventEmitter();

        @ViewChild("placesRef", { static: true }) placesRef: GooglePlaceDirective;
        public handleAddressChange(address: Address) {
                this.newOrder.advanceInfo.address = address.formatted_address || address.name;
                if (address.geometry) {
                        this.newOrder.address = { description: this.newOrder.advanceInfo.address, lat: address.geometry.location.lat(), long: address.geometry.location.lng() };
                }
        }

        @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger, static: false }) autoComplete: MatAutocompleteTrigger;

        @HostListener('document:keyup', ['$event'])
        handleKeyboardEvent(event: KeyboardEvent) {
                if (!this.quickOrderService.incomeHeader || !this.quickOrderService.incomeHeader.incomeTransactions) {
                        return;
                }
                if (event.key == 'F8') {
                        event.stopPropagation();
                        this.checkout();
                }

                //quantity commands
                // var last =  _.last(this.incomeHeader.incomeTransactions);
                // if (!last) return;
                // if(event.key == '+'){
                //     event.stopPropagation();         
                //     this.increaseQuantity(last);
                // }
                // if(event.key == '-'){
                //     event.stopPropagation();         
                //     this.decreaseQuantity(last);
                // }
                // if( event.key.length == 1 &&event.key.match(/^[0-9]+$/) != null){
                //     //console.log(event.key);
                // }
        }

        @Output() onSlideOut: EventEmitter<any> = new EventEmitter();

        nensoArray = new Array(149);
        bodiamuongArray = new Array(6);


        constructor(private viewContainerRef: ViewContainerRef, private offlineService: OnlineOfflineService, private changeDetectorRef: ChangeDetectorRef, private printService: PrintService,
                public dateTimeService: DateTimeService, private snotifyService: SnotifyService, private apiService: ApiService, public quickOrderService: QuickOrderService,
                private ngZone: NgZone, private barcodeService: BarcodeService, public dialog: MatDialog, public shopService: ShopService, private orderService: OrderService,
                public memberService: MemberService,

        ) {
                this.searchCtrl = new FormControl();
                this.shopService.shopChanged.subscribe(r => {
                        //this.init();
                })
                if (!this.shopService.currentShop) return;
                this.init();

                //////order edit
                this.orderService.orderEdited.subscribe(o => {
                        this.isOrder = true;
                        _.each(o.orderDetails, od => {
                                ModelHelper.addQuickPrice(this.quickOrderService, this.snotifyService, od.description, null, od.unitPrice, od.barcode, od.quantity);
                                if (od.unitPrice < 0) {
                                        this.isHaveDiscount = true;
                                        return;
                                }
                        });

                        if (!o.orderDetails || o.orderDetails.length == 0) {
                                LayoutComponent.isTimelineOpenedToggle.emit(true);
                        }

                        this.newOrder = o;
                        if (!this.newOrder.advanceInfo) {
                                this.newOrder.advanceInfo = this.newOrder.advanceComments;
                        }
                        if (o.customer && (o.customer.phoneNumber > 0)) {
                                this.selectedCustomer = o.customer.phoneNumber;
                        }
                })
        }

        init() {
                console.log(this.shopService.sellMembers);
                this.quickOrderService.incomeHeader.shopId = this.shopService.currentShop.id;

                this.quickOrderService.incomeTransactionChanged$.subscribe(t => {
                        //this.incomeHeader.incomeTransactions = this.quickOrderService.list();
                        setTimeout(() => {
                                if ($('#checkout-button')[0]) {
                                        $('#checkout-button')[0].focus();
                                }

                        }, 100);
                });

                this.quickOrderService.checkoutRequested$.subscribe(r => {
                        this.checkout();
                });

                this.quickOrderService.isOrderRequested$.subscribe(r => {
                        this.isOrder = r;
                        console.log(r);
                        this.isOrderChange();
                });

                this.filteredCustomers = this.searchCtrl.valueChanges.pipe(
                        startWith(),
                        debounceTime(200),
                        distinctUntilChanged(),
                        switchMap(val => {
                                return this.filterCustomer(val || '')
                        })
                );

                DashboardComponent.customerScanned.subscribe(r => {
                        this.selectedCustomer = r.customer;
                        this.customerShop = r;
                });

                DashboardComponent.isTouch.subscribe(it => {
                        this.isTouch = it;
                        console.log(this.isTouch);
                });

                this.getDeliveryOptions();

                this.filteredDeposits = this.depositControl.valueChanges
                        .pipe(
                                startWith(''),
                                map(value => this.filterDeposit(value))
                        );

        }

        empty() {
                this.quickOrderService.empty();
                this.isOrder = false;
                this.isPrint = true;
                this.deleteSelectedCustomer();
                //this.externalIdUserInput = '';

        }

        filterCustomer(val: string) {
                if (!val || val.length < 1) {
                        this.message = null;
                        return from([]);
                }
                if (val && val.length != 10) {
                        this.message = "Số điện thoại chưa đúng! (10 số)";
                }
                if ((val && val.length == 10) || (this.selectedCustomer && this.selectedCustomer.id)) {
                        localStorage.setItem('isExistedCustomer', 'true');
                        this.message = null;
                }
                else {
                        localStorage.removeItem('isExistedCustomer');
                }

                return this.apiService.searchCustomerByPhone(this.shopService.currentShop.id, 10, val).map(response => response.filter(customerSearchResult => {
                        if (val == customerSearchResult.phoneNumber) {
                                this.selectedCustomer = ModelHelper.toCustomer(customerSearchResult);
                                this.getCustomerShop(null, customerSearchResult);
                        }
                        return (customerSearchResult.phoneNumber && customerSearchResult.phoneNumber.indexOf(val) >= 0);
                }));

        }

        displayFn(user?: any): string | undefined {
                return user && user.phoneNumber ? user.phoneNumber : user;
        }
        
        ngOnInit() {
                this.shopService.currentShop = JSON.parse(localStorage.getItem('currentShop'));
                this.deliveryPickupDateTime = new Date();
                var deposiValue = 20000;
                while (deposiValue < 500000) {
                        this.depositOptions.push(deposiValue.toString());
                        deposiValue += 5000;
                }
        }

        ngAfterViewInit() {
                $('#customerCodeInput').keydown((event) => {
                        if (event.which == 13) {
                                this.customerCodeEntered();
                        }

                })
        }

        closeSlide() {
                this.onSlideOut.emit(null);
        }

        getMemberNameFromGroupName(groupName: string) {
                const result = this.shopService.getMemberNameById(parseInt(groupName.split('-')[0]));
                console.log('0',groupName)
                console.log('0',result)
                return result;
        }

        removeTransaction(transaction: IncomeTransaction) {
                this.quickOrderService.remove(transaction);
        }

        private _class: string = null;

        get currentCustomer() {
                if (this.selectedCustomer && this.selectedCustomer.id) {
                        return this.selectedCustomer;
                } else {
                        return this._currentCustomer = {
                                phoneNumber: this.searchCtrl.value,
                                name: this.newCustomerName
                        } as Customer;
                }
        }

        updateBarcodes(transactions) {
                _.each(transactions, t => {
                        if (t.barcode) {
                                this.barcodeService.setIsSold(t.barcode);
                        }
                })
        }

        checkout(member: Member = null) {
                if (this.quickOrderService.getTotal() <= 0) {
                        this.snotifyService.error("tổng cộng đang nhỏ hơn 0đ !", "");
                        return;
                }


                

                if (this.isOrder) {
                        this.checkoutNewOrder();
                        return;
                }
                var _window = window;
                this.checkoutCash = new CheckoutCash();
                this.checkoutCash.moneyCake = this.quickOrderService.getTotal();
                let dialogRef = this.dialog.open(CheckoutConfirmDialogComponent, {
                        panelClass: ["col-md-9"],
                        data: {
                                checkoutCash: this.checkoutCash,
                                currentCustomer: this.currentCustomer,
                                incomeHeader: this.quickOrderService.incomeHeader,
                                member: member || this.memberService.currentMember
                        }
                });

                dialogRef.afterClosed().subscribe(result => {
                        if (result) {
                                this.checkoutCash = result;
                                this.ngZone.run(() => {
                                        this.quickOrderService.incomeHeader.incomeTransactions = [];
                                        this.quickOrderService.empty();
                                        this.selectedCustomer = null;
                                        this.newCustomerName = "";
                                });
                        }
                });
        }

        onSelectionChanged(event: MatAutocompleteSelectedEvent) {
                this.getCustomerShop(null, event.option.value as CustomerSearchResult);
        }

        /**
         * Takes two numbers and returns their sum
         * @param customerSearchResult first input to sum
         * @returns select customer and add discount
         */
        getCustomerShop(customerId = null, customerSearchResult: CustomerSearchResult = null) {
                if (customerId) {
                        this.apiService.getCustomerShop(customerId, this.shopService.currentShop.id).subscribe(r => {
                                this.customerShop = r;
                                if (this.customerShop.externalId) {
                                        ModelHelper.addQuickPrice(this.quickOrderService, this.snotifyService, `Khuyến mãi VIP (${this.customerShop.customerType.discountPercent}%)`, SaleType.DiscountPercent, -this.customerShop.customerType.discountPercent);
                                }
                        });
                }
                if (customerSearchResult) {
                        this.customerShop = ModelHelper.toCustomerShop(customerSearchResult);
                        if (this.newOrder && this.newOrder.id && this.isHaveDiscount) {
                                return;
                        }
                        if (this.customerShop.externalId) {
                                ModelHelper.addQuickPrice(this.quickOrderService, this.snotifyService, `Khuyến mãi VIP (${this.customerShop.customerType.discountPercent}%)`, SaleType.DiscountPercent, -this.customerShop.customerType.discountPercent);
                        }
                }
                // $('.numpad-container').hide();
        }

        isOrderChange() {
                if (this.isOrder) {
                        this.newOrder = new Order();
                        this.newOrder.receiptCount = parseInt(localStorage.getItem('receiptCount')) || 2;
                        this.newOrder.dateCreated = new Date();
                        this.newOrder.idNumber = this.shopService.currentShop.shopCode + moment(this.newOrder.dateCreated).format('DDMM') + "-" + Utilities.generateIdNumberForOrder();
                        this.newOrder.netAmount = this.quickOrderService.getTotal();
                        this.newOrder.amount = this.newOrder.netAmount + Number(this.newOrder.fee);
                        this.newOrder.shopId = this.shopService.currentShop.id;
                        this.newOrder.customer = this.selectedCustomer;
                        if (!this.newOrder.advanceInfo) {
                                this.newOrder.advanceInfo = {};
                        }
                        this.newOrder.attachments = [];
                }
        }

        dateTimeChange() {
                // this.newOrder.deliveryPickupDate = this.deliveryPickupDateTime;
                // this.newOrder.deliveryPickupTime = this.deliveryPickupDateTime;
        }

        decreaseQuantity(t) {
                t.quantity = parseInt(t.quantity) - 1;

                if (t.quantity == 0) {
                        this.quickOrderService.remove(t)
                }
                t.amount = t.quantity * t.unitPrice;
                $('#checkout-button')[0].focus();
                this.quickOrderService.reCaclPercent();
        }

        increaseQuantity(t) {
                t.quantity = parseInt(t.quantity) + 1;
                t.amount = t.quantity * t.unitPrice;
                $('#checkout-button')[0].focus();
                this.quickOrderService.reCaclPercent();
        }

        selectAllContent($event) {
                $event.target.select();
        }

        quantityChanged(t) {
                if (t.quantity == 0) {
                        this.quickOrderService.remove(t)
                }
                t.amount = t.quantity * t.unitPrice;
        }

        minusReceiptCount() {
                if (this.newOrder.receiptCount > 1) {
                        this.newOrder.receiptCount--;
                        localStorage.setItem('receiptCount', this.newOrder.receiptCount.toString());
                }
        }

        plusReceiptCount() {
                if (this.newOrder.receiptCount < 5) {
                        this.newOrder.receiptCount++;
                        localStorage.setItem('receiptCount', this.newOrder.receiptCount.toString());
                }
        }

        checkoutNewOrder() {
                /// common
                this.newOrder.fee = Number(this.newOrder.fee);
                this.newOrder.netAmount = this.quickOrderService.getTotal();
                this.newOrder.amount = this.newOrder.netAmount + this.newOrder.fee;
                if (this.newOrder.address) {
                        this.newOrder.orderType = OrderType.Delivery;
                }
                this.dateTimeChange();
                if (this.newOrder.deposit > this.newOrder.amount) {
                        this.snotifyService.error("Đặt cọc không thể lớn hơn tổng tiền bánh", "");
                        return;
                }
                if (!this.newOrder.deposit) {
                        this.newOrder.deposit = 0;
                }
                if (this.newOrder.deposit > 0 && this.newOrder.deposit < 1000) {
                        this.snotifyService.error("Đặt cọc quá ít", "");
                        return;
                }

                this.newOrder.comments = JSON.stringify(this.newOrder.advanceInfo);
                this.newOrder.status = OrderStatus.Waiting; // what if "OrderStatus" of the old order is different?
                this.newOrder.customer = this.currentCustomer;
                this.newOrder.customerId = this.currentCustomer.id;
                // this.newOrder.memberId = this.memberService.currentMember.id;
               if(!this.newOrder.memberId) {
                        this.newOrder.memberId = this.memberService.currentMember.id;
               }
                this.newOrder.orderDetails = this.quickOrderService.incomeHeader.incomeTransactions.map(t => {
                        return {
                                quantity: t.quantity,
                                unitPrice: t.unitPrice,
                                description: t.description,
                                barcode: t.barcode,
                        } as OrderDetail;
                })


                /// edit order
                if (this.newOrder && (this.newOrder.id > 0)) {
                        console.log(this.newOrder)
                        this.newOrder.updatedDate = new Date();
                        var d = new Date(this.newOrder.deliveryPickupTime);
                        if (new Date(this.newOrder.deliveryPickupTime) < this.newOrder.updatedDate) {
                                this.snotifyService.warning("Thời gian giao chưa hợp lý");
                        } else {
                                this.apiService.putOrder(this.newOrder).subscribe(res => {
                                        if (res) {
                                                this.snotifyService.confirm("Bạn có muốn in lại biên?", "", {
                                                        buttons: [
                                                                {
                                                                        text: "Có",
                                                                        action: () => {
                                                                                this.printRequestAndCloseOrderTimline();
                                                                                this.snotifyService.clear();
                                                                                window.location.reload();
                                                                        }
                                                                },
                                                                {
                                                                        text: "Không",
                                                                        action: () => {
                                                                                this.isPrint = false;
                                                                                this.printRequestAndCloseOrderTimline();
                                                                                this.snotifyService.clear();
                                                                                window.location.reload();
                                                                        }
                                                                }
                                                        ]
                                                });
                                        }
                                });

                        }
                }
                /// make order
                else {
                        if (!this.newOrder.deliveryPickupTime) {
                                let dialogRef = this.dialog.open(OrdersTimelineConfirmDialogComponent, {
                                        panelClass: ["col-md-4", "col-sx-6"],
                                        data: {
                                                newOrder: this.newOrder
                                        }
                                });
                                dialogRef.afterClosed().subscribe(result => {
                                        console.log('result',result)
                                        if (result) {
                                                this.newOrder.deliveryPickupTime = new Date();
                                                return this.processOrder();
                                        }
                                });
                        } else {
                                return this.processOrder();
                        }
                }
                this.changeDetectorRef.detectChanges();

        }

        private processOrder() {
                this.printRequestAndCloseOrderTimline();
                this.updateBarcodes(this.quickOrderService.incomeHeader.incomeTransactions);
                var cloneNewOrder: any = {};
                Object.assign(cloneNewOrder, this.newOrder);
                this.orderService.addOrder(cloneNewOrder);
                this.apiService.makeOrder(cloneNewOrder).subscribe(r => {
                        this.snotifyService.success('Tạo đơn thành công!')
                });
                return true;
        }

        private printRequestAndCloseOrderTimline() {
                if (this.isPrint) {
                        this.ngZone.runTask(() => {
                                this.printService.printOrder(this.viewContainerRef, { ...this.newOrder } as any, this.currentCustomer);
                        });
                }
                else {
                        this.isPrint = true;
                }
                if (true) {
                        this.quickOrderService.incomeHeader.incomeTransactions = [];
                        this.quickOrderService.empty();
                        this.selectedCustomer = null;
                        this.newCustomerName = "";
                        this.isOrder = false;
                }
        }

        openLinkCustomer() {
                let dialogRef = this.dialog.open(LinkCustomerComponent, {
                        panelClass: ["col-md-6"],
                        data: {
                                customerShop: this.customerShop,
                                customer: this.selectedCustomer
                        }
                });

                dialogRef.afterClosed().subscribe(result => {
                        if (result) {
                                this.getCustomerShop(result.customerId);
                        }
                });
        }

        deleteSelectedCustomer() {
                localStorage.removeItem('isExistedCustomer');
                this.selectedCustomer = null;
                this.customerShop = null;
                this.newCustomerName = null;
                var isDiscountFormVip = _.find(this.quickOrderService.incomeHeader.incomeTransactions, it => { it.description.indexOf("VIP") > -1 });
                if (isDiscountFormVip) {
                        this.decreaseQuantity(isDiscountFormVip);
                }
                this.externalIdUserInput = '';
        }

        getDeliveryOptions() {
                this.apiService.getDeliveryOptions(this.shopService.currentShop.id).subscribe(r => {
                        this.fees = r;
                });
        }

        addQuickPrice(name, type: SaleType, price) {
                ModelHelper.addQuickPrice(this.quickOrderService, this.snotifyService, name, type, price);
        }

        onRemoved(a) {
                this.newOrder.attachments = this.newOrder.attachments.filter(item => item !== a);
                console.log(this.newOrder)
        }

        getFiles(event) {
                try {
                        if (this.newOrder.attachments.length > 2) {
                                this.snotifyService.warning("Số lượng mẫu không lớn hơn 3!", "")
                                return;
                        }
                        var file = event.target.files[0];
                        this.readThis(file);
                } catch (error) {
                        console.log(error);
                }


        }

        readThis(file: any): void {
                var myReader: FileReader = new FileReader();
                myReader.onloadend = (e) => {
                        var image = myReader.result;
                        this.apiService.uploadImageAzure(file, image, "-image").subscribe(r => {
                                if (r) {
                                        var a = new Attachment();
                                        a.url = r;
                                        this.newOrder.attachments.push(a);
                                        console.log(this.newOrder)
                                }
                        });
                }
                myReader.readAsDataURL(file);
        }

        filterDeposit(val: string): string[] {
                if (!val) {
                        return this.depositOptions;
                }
                return this.depositOptions.filter(option => option.toLowerCase().startsWith(val));
        }

        onSelectionChangedDeposit(event: MatAutocompleteSelectedEvent) {
                this.newOrder.deposit = event.option.value;
        }

        numberPressedChanged() {
                setTimeout(() => {
                        this.autoComplete.openPanel();
                        this.autoComplete.position = "below"
                        this.autoComplete.updatePosition();
                }, 201)
        }

        clickButton() {
                this.isClickUserButton = true;
        }

        customerCodeEntered() {
                if (this.externalIdUserInput) {
                        this.getCustomerShopByExternalId();
                }
        }

        private getCustomerShopByExternalId() {
                this.apiService.getCustomerShopByExternalId(this.externalIdUserInput, this.shopService.currentShop.id).subscribe(r => {
                        if (r) {
                                this.selectedCustomer = r.customer;
                                this.customerShop = r;
                                if (this.customerShop.externalId) {
                                        ModelHelper.addQuickPrice(this.quickOrderService, this.snotifyService, `Khuyến mãi VIP (${this.customerShop.customerType.discountPercent}%)`, SaleType.DiscountPercent, -this.customerShop.customerType.discountPercent);
                                }

                        }
                        else {
                                this.snotifyService.warning('Vui lòng nhập lại', 'Mã không đúng');
                        }
                });
        }

        feeChanged() {
                if (!this.newOrder.fee) {
                        this.newOrder.fee = 0;
                }
        }
}

