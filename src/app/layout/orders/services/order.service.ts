import { Injectable, EventEmitter } from "@angular/core";
import { Order } from "../../../shared/models/order.model";
import * as _ from "lodash";
import { ProductCategory } from "../../../shared/models/product-category.model";
import { ApiService } from "../../../shared/services/api.service";
import { ShopService } from "../../../shared/services/shop.service";
import { SnotifyService } from "ng-snotify";
import { CakeStatus } from "../../../shared/models/cake-status.enum";
import { ChatService } from "../../../shared/services/chat.service";
import { MemberService } from "../../../shared/services/member.service";
import { ChatMessage } from "../../../shared/models/chat-message.model";
import { DatePipe } from "@angular/common";
import { OrderStatus } from "../../../shared/models/order-status.enum";
import { CurrencyFormatPipe } from "../../../shared/pipes/currencyformat.pipe";
import { PrintService } from "../../../shared/services/print.service";
import { Observable } from "rxjs/Rx";
import { OrderCakeStatusUpdateModel } from "../../../shared/models/orderCakeStatusUpdateModel.model";
import { CommonService } from "../../../shared/services/common.service";
import { Http, Response } from "@angular/http";
import * as moment from "moment";


@Injectable({
    providedIn: 'root'
})
export class OrderService {

    ordersChanged: EventEmitter<any> = new EventEmitter();
    orderEdited: EventEmitter<any> = new EventEmitter();
    private _allOrders: Order[] = [];
    newOrders: Order[] = [];
    selfCreateOrders: string[] = [];

    orderNotifications: any[] = [];

    orderStatusMap={
        1: "Tiếp Nhận",
        2: "Hoàn Thành"
    }


    memberId: number;
    //private _hubConnection: HubConnection;
    _productCategories: ProductCategory[];

    constructor(private apiService: ApiService, private shopService: ShopService,
        private snotifyService: SnotifyService, private chatService: ChatService,
        private printService: PrintService,
        private commonService: CommonService,
        private http: Http,
        private memberService: MemberService) {
        shopService.shopChanged.subscribe(() => {
            this.getProductCategoriesByShop();
        })

    }



    playAudio() {
        let audio = new Audio();
        audio.src = "../../../assets/sounds/buble.wav";
        audio.load();
        audio.play();
    }

    public get productCategories() {
        if (this._productCategories)
            return this._productCategories;
    }


    addOrder(order) {
        this._allOrders.push(order);
        this.selfCreateOrders.push(order.idNumber);
    }

    notificationClicked(notification: any) {
        //this.orderNotifications.s
        _.remove(this.orderNotifications, { id: notification.id })
        //this.openChatOrder(notification.id);
        if (this.orderNotifications.length > 0) {
            document.title = "(" + this.orderNotifications.length + ") tin nhắn chưa đọc !"
        } else {
            document.title = this.shopService.currentShop.name;
        }
    }

    async getOrderByBarcode(barcode) {
        var orderId = barcode.replace('#', this.shopService.currentShop.shopCode);
        var order = await this.apiService.getOrderByIdNumber(orderId).toPromise();
        return order;
    }

    async getProductCategoriesByShop() {
        if (this.shopService.currentShop) {
            this._productCategories = await this.apiService.getProductCategoriesByShop(this.shopService.currentShop.id).toPromise();
        }
    }


    updateCakeStatus(order: Order, cakeStatus: CakeStatus, memberId: number) {
        order.orderCakeStatus.cakeStatus = cakeStatus;
        var orderCakeStatusUpdateModel = new OrderCakeStatusUpdateModel();

        orderCakeStatusUpdateModel.customerId = order.customerId;
        orderCakeStatusUpdateModel.memberId = memberId;
        orderCakeStatusUpdateModel.orderCakeStatusId = order.orderCakeStatus.id;
        orderCakeStatusUpdateModel.orderId = order.id;
        orderCakeStatusUpdateModel.shopId = this.shopService.currentShop.id;

        if (cakeStatus == 1) {

            this.changeToInProcess(orderCakeStatusUpdateModel).subscribe(r => {
                this.snotifyService.success("Cập nhật thành công", "");
                this.ordersChanged.emit();
            });
        }
        else if (cakeStatus == 2) {
            this.changeToDone(orderCakeStatusUpdateModel).subscribe(r => {
                this.snotifyService.success("Cập nhật thành công", "");
                this.ordersChanged.emit();
            });
        }


    }

    okToConfirm(order) {
        order.status = OrderStatus.Waiting;
        this.apiService.updateOrder(order).subscribe(r => {
            this.ordersChanged.emit(null);
            this.snotifyService.success("Tiếp Nhận Đơn Bánh");

            // if (order.amount - order.deposit > 0) {
            //   this.printService.kickCashDrawer();

            //   this.printService.printMessage('Cám ơn quý khách, đơn bánh đã hoàn thành. Chúng tôi vừa nhận số tiền còn lại: ' + new CurrencyFormatPipe().transform(order.amount - order.deposit));
            // }

            var chatMessage = {} as ChatMessage;
            chatMessage.memberId = this.memberService.currentMember.id;
            chatMessage.chatRoomName = order.customerId + "-" + order.id + "-" + order.shopId;
            //Todo: ask Hung before changing
            chatMessage.customerId = order.customerId;
            chatMessage.createdDate = new Date();
            chatMessage.message = `Đơn bánh ${order.idNumber} của bạn đã được tiếp nhận. ${this.shopService.currentShop.name} xin cảm ơn quí khách. Bạn có muốn chúng tôi gửi hình bánh khi xong không?`;
            chatMessage.member = this.memberService.currentMember;
            this.chatService.chatOrder(chatMessage);


        });
    }

    okToDone(order) {
        order.status = OrderStatus.Done;
        this.apiService.updateOrder(order).subscribe(r => {
            this.ordersChanged.emit(null);
            this.snotifyService.success("Hoàn Thành Đơn Bánh");

            if (order.amount - order.deposit > 0) {
                this.printService.kickCashDrawer();

                this.printService.printMessage(`
                Cám ơn quý khách, đơn bánh đã hoàn thành. Chúng tôi vừa nhận số tiền còn lại:  ${new CurrencyFormatPipe().transform(order.amount - order.deposit)}
                .
                Ngày giao: ${moment(order.deliveryPickupTime).format("DD-MM-YY HH:mm")}
                Ngày in biên này: ${moment().format("DD-MM-YY HH:mm")}`
                );
            }

            var chatMessage = {} as ChatMessage;
            chatMessage.memberId = this.memberService.currentMember.id;
            chatMessage.chatRoomName = order.customerId + "-" + order.id + "-" + order.shopId;
            //Todo: ask Hung before changing
            chatMessage.customerId = order.customerId;
            chatMessage.createdDate = new Date();
            chatMessage.message = `Đơn bánh ${order.idNumber} của bạn đã hoàn thành. ${this.shopService.currentShop.name} xin cảm ơn quí khách. Hẹn gặp lại ngày gần nhất.`;
            chatMessage.member = this.memberService.currentMember;
            this.chatService.chatOrder(chatMessage);


        });
    }

    buildSteps(order: Order) {
        var steps = [
            {
                name: "Tiếp nhận", isDone: order.status > 0, date: order.createdDate,
                byName: this.shopService.getMemberNameById(order.memberId), byImage: this.shopService.getMemberImageById(order.memberId),
                buttonReplace: {
                    text: "Tiếp Nhận", command: () => {
                        this.okToConfirm(order)
                    }
                }
            },
            {
                name: "Làm bánh", isDone: (order.orderCakeStatus.cakeStatus >= CakeStatus.InProcess || order.status == OrderStatus.Done), date: order.orderCakeStatus.updatedDate,
                byName: this.shopService.getMemberNameById(order.orderCakeStatus.memberId), byImage: this.shopService.getMemberImageById(order.orderCakeStatus.memberId),
                buttonReplace: order.status != OrderStatus.New ? {
                    text: "Làm Bánh", command: () => {
                        this.updateCakeStatus(order, CakeStatus.InProcess, this.memberService.currentMember.id)
                    }
                } : {}
            },
            {
                name: "Làm xong", isDone: order.orderCakeStatus.cakeStatus == CakeStatus.Done || order.status == OrderStatus.Done, date: order.orderCakeStatus.updatedDate,
                byName: this.shopService.getMemberNameById(order.orderCakeStatus.memberId), byImage: this.shopService.getMemberImageById(order.orderCakeStatus.memberId),
                buttonReplace: order.status != OrderStatus.New ? {
                    text: "Làm Xong", command: () => {
                        this.updateCakeStatus(order, CakeStatus.Done, this.memberService.currentMember.id)
                    }
                } : {}
            },
            {
                name: "Đã giao", isDone: order.status == OrderStatus.Done, date: order.updatedDate,
                byName: this.shopService.getMemberNameById(order.doneMemberId), byImage: this.shopService.getMemberImageById(order.doneMemberId),
                buttonReplace: order.status != OrderStatus.New ? {
                    text: "Hoàn Thành", command: () => {
                        this.okToDone(order);

                    }
                } : {}
            }
        ];
        return steps;
    }

    changeToInProcess(orderCakeStatusUpdateModel: OrderCakeStatusUpdateModel): Observable<any> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/orderCakeStatus/change-to-inProcess", orderCakeStatusUpdateModel, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    changeToDone(orderCakeStatusUpdateModel: OrderCakeStatusUpdateModel): Observable<any> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/orderCakeStatus/change-to-done", orderCakeStatusUpdateModel, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    plusPrintedReceiptCount(orderId, count){
        return this
            .http
            .get(this.commonService.baseUrl + `api/order/plus-printed-receipt-count?orderId=${orderId}&count=${count}`, this.commonService.getAuthHeader(false))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

}