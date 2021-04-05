import { Component, ViewChild, ElementRef, OnInit, Input } from "@angular/core";
import { ChatService } from "../../shared/services/chat.service";
import { Chat } from "../../shared/modules/order-detail/components/chat-ngrx/chat-ngrx.model";
import { ApiService } from "../../shared/services/api.service";
import { ShopService } from "../../shared/services/shop.service";
import { ChatMessage } from "../../shared/models/chat-message.model";
import * as _ from "lodash";
import { MemberService } from "../../shared/services/member.service";
import { Order } from "../../shared/models/order.model";
import { ChatRoom } from "../../shared/models/chat-room.model";
import { ActivatedRoute } from "@angular/router";
import { Utilities } from "../../shared/services/utilities";
import { ChatType } from "../../shared/models/chat-type.enum";
import { OrderDetailComponent } from "../../shared/modules/order-detail/components/order-detail/order-detail.component";
import { MatDialog } from "@angular/material/dialog";
import { FbMessengerService } from "../../shared/services/fb-messenger.service";
import { FacebookService } from "ngx-facebook";

import { ROUTES } from '../components/sidebar-v2/sidebar-routes.config';
import * as moment from 'moment';

@Component({
    selector: "app-chat",
    templateUrl: "./chats.component.html",
    styleUrls: ["./chats.component.scss"],
})
export class ChatsComponent implements OnInit {
    public menuItems: any[];
    expireDaysYet = 0;
    today = moment(new Date());

    chat: Chat[];
    activeChatUser: string;
    activeChatUserImg: string;
    @ViewChild("messageInput", { static: true }) messageInputRef: ElementRef;

    messages = new Array();
    item: number = 0;
    currentChatId: string = "chat1";
    selectedChatRoom: ChatRoom;
    order: Order;
    orderCakeImage: any;
    chatRooms = [];
    selectedRoomName: any;
    orderId: any;
    chatRoomsIsLoading: boolean;
    isFacebookMessenger = false;

    constructor(
        private elRef: ElementRef,
        private chatService: ChatService,
        private apiService: ApiService,
        public shopService: ShopService,
        private fb: FacebookService,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private fbMessengerService: FbMessengerService,
        private memberService: MemberService,
    ) {
        this.selectedRoomName = activatedRoute.snapshot.queryParams.roomName;
    }

    ngOnInit() {
        let body = document.getElementsByTagName("body")[0];
        body.classList.add("chat-page");

        if (this.activatedRoute.snapshot.data.chatType == ChatType.Facebook) {
            this.isFacebookMessenger = true;
            this.getFbConversations();
        } else {
            this.getAllActiveOrderRooms();
            if (this.selectedRoomName) {
                this.orderId = Utilities.getOrderIdFromRoomName(
                    this.selectedRoomName
                );
            }
        }

        // $.getScript("./assets/js/app-sidebar.js");
        this.menuItems = ROUTES.filter((menuItem) => {
            if (menuItem.requiredClaim) {
                return this.memberService.hasPermission(
                    menuItem.requiredClaim,
                    this.shopService.currentShop.id
                );
            }
            return true;
        });
        this.menuItems.forEach((i) => {
            i.submenu = _.filter(i.submenu, (s) => {
                if (s.requiredClaim) {
                    return this.memberService.hasPermission(
                        s.requiredClaim,
                        this.shopService.currentShop.id
                    );
                }
                return true;
            });

            _.forEach(i.submenu, (sb) => {
                // Observable.forkJoin(
                //     this.apiService.getActiveOrdersToday(this.shopService.currentShop.id),
                //     this.apiService.getOrdersStatusNew(this.shopService.currentShop.id),
                // ).subscribe(res => {
                //     if (sb.path == '/orders') {
                //         this.ordersCount = sb.badge = res[0].length.toString();
                //     }
                //     if (sb.path == '/confirm-orders') {
                //         sb.badge = res[1].length.toString();
                //         if (i.title == 'Đơn') {
                //             i.badge = this.ordersCount + ` + ` + sb.badge;
                //         }
                //     }

                // });

                if (sb.path == "/facebook") {
                    this.apiService
                        .getFacebookPageShops(this.shopService.currentShop.id)
                        .subscribe((r) => {
                            _.forEach(r, (fbPageShop) => {
                                var expireDate = moment(fbPageShop.expiredTime);
                                this.expireDaysYet = expireDate.diff(
                                    this.today,
                                    "days"
                                );
                            });
                        });
                    if (this.expireDaysYet <= 14) {
                        sb.class = "facebook-expire-style";
                        sb.title = "Facebook (Cần làm mới)";
                    }
                }
            });
        });
    }

    getFbConversations() {
        this.fbMessengerService
            .getConversations(this.shopService.currentShop.id)
            .subscribe((r) => {
                console.log(r);
                _.each(r, (pageChatRoom) => {
                    _.each(pageChatRoom.chatRooms, (conversation) => {
                        conversation.customer.image = `https://graph.facebook.com/v6.0/${conversation.customer.providerKeyFacebook}/picture?access_token=${pageChatRoom.accessToken}&method=get&pretty=0&redirect=1&sdk=joey&suppress_http_code=1`;
                        this.chatRooms.unshift(conversation);
                    });
                });
            });
    }

    public getAllActiveOrderRooms() {
        this.chatRoomsIsLoading = true;
        this.apiService
            .getAllActiveOrderRooms(this.shopService.currentShop.id)
            .subscribe((r) => {
                this.chatRooms = r;

                this.chatRooms.forEach((element) => {
                    if (element.chatType == ChatType.Order) {
                        element.orderId = Utilities.getOrderIdFromRoomName(
                            element.name
                        );
                    }
                });

                this.chatRooms = _.orderBy(this.chatRooms, [
                    "lastMessageFrom",
                    "updatedDate",
                ]).reverse();
                if (this.selectedRoomName) {
                    this.selectedChatRoom = _.find(r, {
                        name: this.selectedRoomName,
                    }) as any;
                    if (!this.selectedChatRoom) {
                        this.apiService
                            .getOrder(this.orderId)
                            .subscribe((o) => {
                                this.order = o;
                                var chatRoomWithoutMes = new ChatRoom();
                                chatRoomWithoutMes.name = this.selectedRoomName;
                                chatRoomWithoutMes.chatType = ChatType.Order;
                                chatRoomWithoutMes.customerId = this.order.customerId;
                                chatRoomWithoutMes.customer = this.order.customer;
                                chatRoomWithoutMes.lastMessage = "";
                                chatRoomWithoutMes.createdDate = this.order.createdDate;
                                chatRoomWithoutMes.orderId = this.order.id;
                                // chatRoomWithoutMes.updatedDate = new Date();
                                this.chatRooms.push(chatRoomWithoutMes);
                                this.selectedChatRoom = chatRoomWithoutMes;
                            });
                    }
                }
                this.chatRoomsIsLoading = false;
                //this.chatRooms = _.orderBy(this.chatRooms, 'lastMessageFrom').reverse();
            });
    }

    ngOnDestroy() {
        let body = document.getElementsByTagName("body")[0];
        body.classList.remove("chat-page");
    }

    setActive(event, chatRoom) {
        var hElement: HTMLElement = this.elRef.nativeElement;
        var allAnchors = hElement.getElementsByClassName("list-group-item");
        [].forEach.call(allAnchors, function (item: HTMLElement) {
            item.setAttribute("class", "list-group-item no-border");
        });
        event.currentTarget.setAttribute(
            "class",
            "list-group-item bg-blue-grey bg-lighten-5 border-right-primary border-right-2"
        );
        this.selectedChatRoom = chatRoom;
    }

    openOrder(orderId) {
        this.apiService.getOrder(orderId).subscribe((r) => {
            console.log(r);
            let dialogRef = this.dialog.open(OrderDetailComponent, {
                panelClass: "col-md-8",
                data: {
                    order: r,
                },
            });
        });
    }
}
