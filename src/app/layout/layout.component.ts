import { Component, OnInit, ChangeDetectorRef, HostListener, EventEmitter, ViewContainerRef, NgZone } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { JwtHelper } from '../shared/services/jwt-helper';
import { routerTransition, ordersTimelineTransition, touchScreenCheckoutTransition } from '../router.animations';
import { Order } from '../shared/models/order.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OrderDialog } from '../shared/dialogs/order-dialog.component';
import * as _ from 'lodash';
import { AlertMessage, DialogType, AlertDialog } from '../shared/services/alert.service';
import { ChatModalModel } from '../shared/models/chat-modal.model';
import { ChatService } from '../shared/services/chat.service';
import { ChatMessage } from '../shared/models/chat-message.model';
import { OrderService } from './orders/services/order.service';
import { Utilities } from '../shared/services/utilities';
import { QuickOrderService } from '../shared/services/quick-order.service';
import { IncomeTransaction } from '../shared/models/IncomeTransaction';
import { Member } from '../shared/models/member.model';
import { ShopService } from '../shared/services/shop.service';
import { BarcodeService } from '../shared/services/barcode.service';
import { ProductBarcode } from '../shared/models/product-barcode.model';
import { MbSignalRService } from '../shared/services/mbSignalR.service';
import { QzTrayService } from '../shared/services/qz-tray.service';
import { Router } from "@angular/router";
import { SellMode } from '../shared/models/sell-mode.enum';
import { WebsiteConfig } from '../shared/models/website-config.model';
import { DateTimeService } from '../shared/services/date-time.service';
import { PrintService } from '../shared/services/print.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { SellCakeMessageType } from '../shared/models/sell-cake-message-type.enum';
import { SellCakeMessage } from '../shared/models/sell-cake-message.model';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { IncomeHeader } from '../shared/models/income-header.model';
import { CheckoutCash } from '../shared/models/checkout-cash.model';
import * as moment from 'moment';
import { SnotifyService, SnotifyPosition } from 'ng-snotify';
import { ResolveHpbComponent } from './components/resolve-hpb/resolve-hpb.component';
import { Shift } from '../shared/models/shift.model';
import { AuthService } from '../shared/services/auth.service';
import { CustomerShop } from '../shared/models/customer-shop.model';
import { SaleType } from '../shared/models/sale-type.enum';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ModelHelper } from '../shared/services/model-helper';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MemberService } from '../shared/services/member.service';
import { OrdersTimelineComponent } from './orders-timeline/orders-timeline.component';
import { MbNotificationsService } from '../shared/services/mb-notifications.service';
import { InitParams, FacebookService } from 'ngx-facebook';

var alertify: any = require('../../assets/scripts/alertify.js');

declare var jquery: any;
declare var $: any;


var mousetimeout;
var keypresstimeout;
var screensaver_active = false;


@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    animations: [routerTransition(), ordersTimelineTransition(), touchScreenCheckoutTransition()]
})


export class LayoutComponent implements OnInit {


    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {

        if (event.key == 'F2') {
            event.stopPropagation();
            this.router.navigateByUrl("daily-report");
        }

        if (event.key == 'F3') {
            event.stopPropagation();
            this.router.navigateByUrl("daily-report");
        }

        if (event.key == 'F4') {
            event.stopPropagation();
            this.router.navigateByUrl("daily-report");
        }


    }

    stickyToasties: number[] = [];
    currentshop: any = {};
    currentShopId: number = 0;
    memberId: number;
    advSlidesConfigs: WebsiteConfig[];
    permissions: string[];
    public async: any;
    isTimelineOpened: boolean = false;
    isTouchScreenCheckoutOpened: boolean = false;
    chatModalModels: ChatModalModel[];
    shopChatRoomName: string;
    connectionId: string;
    currentMember: Member;
    qrCustomer = "2324123-24242"
    isTurnOnQR: boolean;

    public static isTimelineOpenedToggle: EventEmitter<any> = new EventEmitter<any>();
    public static setShiftEvent: EventEmitter<any> = new EventEmitter<any>();
    // public static isDiscountCheckin: EventEmitter<any> = new EventEmitter<any>();

    constructor(private ngZone: NgZone, private printService: PrintService, public dateTimeService: DateTimeService, private router: Router,
        public shopService: ShopService, public orderService: OrderService, private apiService: ApiService, public dialog: MatDialog,
        private snotifyService: SnotifyService, private mbNotificationsService: MbNotificationsService,
        private quickOrderService: QuickOrderService, private mbSignalRService: MbSignalRService, private authService: AuthService,

        private viewContainerRef: ViewContainerRef, public memberService: MemberService) {
        this.chatModalModels = [];

        this.quickOrderService.incomeTransactionChanged$.subscribe(r => {

            if (this.quickOrderService.list().length == 0) {
                this.isTimelineOpened = false;
                this.isTouchScreenCheckoutOpened = false;
                return;
            }

            if (this.quickOrderService.sellMode == SellMode.Normal) {
                this.isTimelineOpened = this.quickOrderService.list().length > 0;

            }
            else if (this.quickOrderService.sellMode == SellMode.TouchScreen) {
                this.isTouchScreenCheckoutOpened = this.quickOrderService.list().length > 0;

            }

        });

        this.quickOrderService.sellCakeMapChanged$.subscribe(r => {
            if (this.quickOrderService.sellMode == SellMode.Normal) {
                this.isTimelineOpened = this.quickOrderService.hasItemsFromMobile;

            }

        });
        shopService.shopChanged.subscribe(r => {
            document.title = shopService.currentShop.name;
        })



    }

    ngOnInit() {

        this.ngZone.run(async () => {
            if (this.memberService.currentMember == null) {
                await this.memberService.getMember();
            }
            var cshopstr = localStorage.getItem("currentShop");
            var shops = await this.apiService.getShopsByMemberId(this.memberService.currentMember.id).toPromise();
            if (!cshopstr) {
                this.shopService.currentShop = shops[0];
            } else {
                var cShop = JSON.parse(cshopstr);
                this.shopService.currentShop = _.find(shops, { id: cShop.id }) || shops[0];
            }

            this.mbNotificationsService.fetchNotifications();

        })

        LayoutComponent.isTimelineOpenedToggle.subscribe(r => {
            if (r) {
                this.isTimelineOpened = !this.isTimelineOpened;
            } else {
                this.isTimelineOpened = false;
            }

        })

        if (this.shopService.currentShop && this.shopService.currentShop.id) {

            this.getAdvSlides();
        }
        if (this.mbSignalRService.isConnected) {
            this.addListenNewOrder();
            this.addListenNotifySetShift();
            this.addListenQrCustomer();
            this.addListenMbNotifications();
        } else {
            this.mbSignalRService.connectedEvent.subscribe(r => {
                this.addListenNewOrder();
                this.addListenNotifySetShift();
                this.addListenQrCustomer();
                this.addListenMbNotifications();
            })
        }

        var _isTurnOnQR = localStorage.getItem('isTurnOnQR');
        if (_isTurnOnQR) {
            this.isTurnOnQR = true;
        }

        this.memberService.getMember();

    }

    ngOnDestroy() {
    }


    test() {

    }

    addQuickPrice(description, price) {
        var newTransaction = new IncomeTransaction();
        newTransaction.date = new Date();
        newTransaction.description = description;
        newTransaction.amount = price;
        this.quickOrderService.add(newTransaction, true);
    }

    async  addListenQrCustomer() {

        this.qrCustomer = Utilities.customerCheckInRoom(this.shopService.currentShop.id);

        const customerCampaign = await this.apiService.getCustomerCampaign("CheckInCampaign", this.shopService.currentShop.id).toPromise();

        // if(customerCampaign.qrCodeValue){
        //     this.qrCustomer = customerCampaign.qrCodeValue;
        // }


        console.log(this.qrCustomer)
        this.authService.joinRoom(this.qrCustomer);
        this.authService.joinRoom("MPOS-12345")

        this.authService.listenEvent('SendCheckInMessageComming', (message: string) => {

            const messageJson = JSON.parse(message);
            switch (messageJson.messageFrom) {
                case 0: // from Customer
                    if (localStorage.getItem('isExistedCustomer')) {
                        this.snotifyService.warning("Hiện đang có khách! Bạn vui lòng Check In sau", "");


                        // send back to customer
                        var backToCustomer = {
                            messageFrom: 1, //from Shop
                            shop: this.shopService.currentShop,
                            message: `Hiện đang có khách! Bạn vui lòng Check In sau`,
                            shareLink: customerCampaign.shareLink,
                            shareQuote: customerCampaign.shareQuote,
                            isSuccess: false
                        }
                        this.authService.invoke2("SendCheckInMessage", this.qrCustomer, JSON.stringify(backToCustomer));
                        return;
                    }


                    this.apiService.getCustomerShop(messageJson.customerId, this.shopService.currentShop.id).subscribe(customerShop => {
                        if (customerShop) {
                            this.snotifyService.success(`Chào mừng ${customerShop.customer.name}, Check In Thành Công! `, {
                                position: SnotifyPosition.leftBottom,
                                icon: customerShop.customerType.icon,
                                timeout: 5000
                            });
                            ModelHelper.addQuickPrice(this.quickOrderService, this.snotifyService, `Khuyến mãi Check In (${customerCampaign.discountPercent}%)`, SaleType.DiscountPercent, -customerCampaign.discountPercent, null, 1);

                            DashboardComponent.customerScanned.emit(customerShop);
                            this.isTimelineOpened = true;
                        }
                    });
                    // send back to customer
                    var backToCustomer = {
                        messageFrom: 1, //from Shop
                        shop: this.shopService.currentShop,
                        message: `Check In Thành Công! Bạn được giảm ${customerCampaign.discountPercent}% tổng đơn.`,
                        shareLink: customerCampaign.shareLink,
                        shareQuote: customerCampaign.shareQuote,
                        isSuccess: true
                    }
                    this.authService.invoke2("SendCheckInMessage", this.qrCustomer, JSON.stringify(backToCustomer))
                case 1:
                    //do nothing
                    break;

            }







        });

    }

    addListenNotifySetShift() {
        this.mbSignalRService.joinRoom('NotifySetShift-' + this.shopService.currentShop.id).then(r => {

            this.mbSignalRService.listenEvent('NotifySetShiftComing', (shift: any) => {
                LayoutComponent.setShiftEvent.emit(shift);
            });

        });
    }

    addListenMbNotifications() {
        this.mbSignalRService.joinRoom('MbNotifications-' + this.shopService.currentShop.id).then(r => {

            this.mbSignalRService.listenEvent('MbNotificationsComing', (shift: any) => {
                this.mbNotificationsService.fetchNotifications();
            });

        });
    }

    addListenNewOrder() {
        // this.mbSignalRService.joinRoom('NewOrder-' + this.shopService.currentShop.id).then(r => {
        //     this.mbSignalRService.listenEvent('NewOrderComing', (orderIdNumber: string) => {
        //         var existing = this.orderService.selfCreateOrders.indexOf(orderIdNumber) > -1;
        //         if (existing) {
        //             console.log('self Created Order');
        //             return;
        //         } else {
        //             this.orderService.selfCreateOrders.push(orderIdNumber);
        //         }

        //         this.printOrderByIdNumber(orderIdNumber);
        //     });

        // });

        this.mbSignalRService.joinRoom('RequestPrintOrder-' + this.shopService.currentShop.id).then(r => {
            this.mbSignalRService.listenEvent('RequestPrintOrderComing', (orderIdNumber: string) => {
                this.printOrderByIdNumber(orderIdNumber);

                //send response confirm
                //this.mbSignalRService.invoke("RequestPrintOrderSuccess-" + orderIdNumber,"true");

            });
        });

        this.mbSignalRService.joinRoom('RequestPrintIncomeHeader-' + this.shopService.currentShop.id).then(r => {
            this.mbSignalRService.listenEvent('RequestPrintIncomeHeaderComing', (incomeCustomer) => {
                this.printIncomeHeader(incomeCustomer);
            });
        });

        this.mbSignalRService.listenEvent('RoomChanged', (r) => {
            console.log('RoomChanged',r);
            if(r.includes('productBarcode/')){
                DashboardComponent.watchProductShift.emit(r)
            }
        });

        this.mbSignalRService.listenEvent("SellCakeMessageComing", (scm: SellCakeMessage) => {
            if (scm.messageType == SellCakeMessageType.Transaction) {
                this.quickOrderService.addTransactionFromMobile(scm.groupName, scm.incomeTransaction);
            }
            if (scm.messageType == SellCakeMessageType.UpdateTransaction) {
                this.quickOrderService.updateTransactionFromMobile(scm.groupName, scm.incomeTransaction);
            }
            if (scm.messageType == SellCakeMessageType.Clear) {
                this.quickOrderService.clearTransactionFromMobile(scm.groupName);
            }
            if (scm.messageType == SellCakeMessageType.CheckOut) {

                var incomeHeader = this.quickOrderService.createIncomeHeaderFromSCM(scm.groupName);
                var checkoutCash = new CheckoutCash();
                checkoutCash.moneyCake = incomeHeader.amount;

                this.apiService.createIncomeCustomer({ "incomeHeader": incomeHeader, "customer": {}, "isOrder": false }).subscribe(r => {
                    this.snotifyService.success("Doanh thu " + incomeHeader.amount + " vừa được nhập !", "");

                    this.printService.printCheckOut(this.viewContainerRef, incomeHeader, null, checkoutCash);
                    this.quickOrderService.sellCakeMap[scm.groupName].incomeTransactions = [];
                    var responseMessage = new SellCakeMessage();
                    responseMessage.groupName = scm.groupName;
                    responseMessage.messageType = SellCakeMessageType.DoneCheckOut;
                    this.mbSignalRService.invoke("SendSellCakeMessage", responseMessage)

                });

            }

            if (scm.messageType == SellCakeMessageType.CheckOutOrder) {
                console.log(scm.order);
                scm.order.dateCreated = new Date();
                scm.order.idNumber = this.shopService.currentShop.shopCode + moment(scm.order.dateCreated).format('DDMM') + "-" + Utilities.generateIdNumberForOrder();
                this.orderService.addOrder(scm.order);
                this.printService.printOrder(this.viewContainerRef, scm.order, scm.order.customer)

                var incomeHeader = this.quickOrderService.createIncomeHeaderFromSCM(scm.groupName);
                this.apiService.createIncomeCustomer({ "incomeHeader": incomeHeader, "customer": scm.order.customer, "isOrder": true }).subscribe(r => {
                });

                this.apiService.makeOrder(scm.order).subscribe(r => {

                });

                this.quickOrderService.sellCakeMap[scm.groupName].incomeTransactions = [];
                var responseMessage = new SellCakeMessage();
                responseMessage.groupName = scm.groupName;
                responseMessage.messageType = SellCakeMessageType.DoneCheckOutOrder;
                this.mbSignalRService.invoke("SendSellCakeMessage", responseMessage)
            }

        })
    }

    cfs = [];



    _orderIdNumber
    printOrderByIdNumber(orderIdNumber: string) {
        var isPrinter = localStorage.getItem('isPrinter');
        if (!isPrinter) return;
        this.snotifyService.info("Đang In Biên Từ App Di Động!")
        this._orderIdNumber = orderIdNumber;
        this.apiService.getOrderByIdNumber(this._orderIdNumber).subscribe(r => {
            let newOrder = r;
            if (!newOrder.customer) newOrder.customer = {};
            this.ngZone.runTask(() => {
                this.printService.printOrder(this.viewContainerRef, { ...newOrder }, newOrder.customer);
            });


        });

    }

    printIncomeHeader(incomeCustomer) {
        var incomeHeader = incomeCustomer.incomeHeader;
        incomeHeader.amount = _.sumBy(incomeHeader.incomeTransactions, 'amount');
        this.printService.printCheckOut(this.viewContainerRef, incomeHeader, incomeCustomer.customer as any, { moneyCake: _.sumBy(incomeHeader.incomeTransactions, 'amount') } as any);

    }

    // onToastyClicked(e) {

    //     if ($(e.target).hasClass('close-button')) {
    //     } else {
    //         var orderContainer = e.target.offsetParent.getElementsByClassName("order-html-container")[0];
    //         this.orderService.openChatOrder(parseInt(orderContainer.id));
    //     }
    // }

    playAudio() {
        let audio = new Audio();
        audio.src = "../../assets/sounds/serviceBell.wav";
        audio.load();
        audio.play();
    }

    shopchanged(event) {
        this.currentshop = event;
        // this._hubConnection.start()
        //     .then(() => {
        //         var connection = (this._hubConnection as any).connection;
        //         this.connectionId = connection.connectionId;               
        //         this.chatService.setHubConnection(this._hubConnection, this.memberId, this.currentshop);
        //         this.orderService.setHubConnection(this._hubConnection);
        //     })
        //     .catch(err => {
        //         //console.log('Error while establishing connection')
        //     });
        var shop = JSON.parse(localStorage.getItem('currentShop'))
        if (!shop || (shop.id != this.currentshop.id)) {
            localStorage.setItem('currentShop', JSON.stringify(this.currentshop));
            shop = this.currentshop;
        }
        this.shopService.currentShop = shop;
        this.shopChatRoomName = this.currentshop.name + this.currentshop.id;
    }

    showDialog(dialog: AlertDialog) {
        alertify.set({
            labels: {
                ok: dialog.okLabel || "OK",
                cancel: dialog.cancelLabel || "Cancel"
            }
        });

        switch (dialog.type) {
            case DialogType.alert:
                alertify.alert(dialog.message);
                break

            case DialogType.confirm:
                alertify
                    .confirm(dialog.message, (e) => {
                        if (e) {
                            dialog.okCallback();
                        }
                        else {
                            if (dialog.cancelCallback)
                                dialog.cancelCallback();
                        }
                    });
                break;

            case DialogType.prompt:
                alertify
                    .prompt(dialog.message, (e, val) => {
                        if (e) {
                            dialog.okCallback(val);
                        }
                        else {
                            if (dialog.cancelCallback)
                                dialog.cancelCallback();
                        }
                    }, dialog.defaultValue);
                break;
        }
    }

    private getAdvSlides() {
        this.apiService.getWebsiteConfigs(this.shopService.currentShop.id).subscribe(r => {
            this.advSlidesConfigs = _.filter(r, { name: "AdvSlide" }) as any;
            _.each(this.advSlidesConfigs, a => {
                a.value = JSON.parse(a.value);
            });
            if (this.advSlidesConfigs.length > 0) {
                this.initScreenSaver();
            }

        });
    }

    private initScreenSaver() {

        var idleTime = parseInt(JSON.parse(localStorage.getItem("idleTime")));
        if (!idleTime) {
            return;
        }
        idleTime *= 1000;
        console.log('initScreenSaver');
        function show_screensaver() {
            $('#screensaver').fadeIn();
            screensaver_active = true;
            screensaver_animation();
        }
        function stop_screensaver() {
            $('#screensaver').fadeOut();
            screensaver_active = false;
        }
        $(document).mousemove(function () {
            clearTimeout(mousetimeout);
            if (screensaver_active) {
                stop_screensaver();
            }
            mousetimeout = setTimeout(function () {
                show_screensaver();
            }, idleTime); // secs   
        });
        $(document).keypress(function () {
            clearTimeout(keypresstimeout);
            if (screensaver_active) {
                stop_screensaver();
            }
            keypresstimeout = setTimeout(function () {
                show_screensaver();
            }, idleTime); // secs  
        });

        var observable5000: Subscription;
        function screensaver_animation() {
            if (observable5000) { observable5000.unsubscribe(); }
            if (screensaver_active) {
                var currentActiveIndex = 0;
                observable5000 = Observable.interval(10000).subscribe(x => {
                    $('.adv-carousel-item').removeClass('active');
                    $($('.adv-carousel-item')[currentActiveIndex]).addClass('active');
                    currentActiveIndex++;
                    if (currentActiveIndex >= $('.adv-carousel-item').length) {
                        currentActiveIndex = 0;
                    }
                });
            } else {
                if (observable5000) { observable5000.unsubscribe(); }
            }
        }
    }

    isTurnChanged(event) {
        this.isTurnOnQR = event;
    }

}
