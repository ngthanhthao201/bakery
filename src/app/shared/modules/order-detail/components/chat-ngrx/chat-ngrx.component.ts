import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, Inject, Input } from '@angular/core';
import { Chat } from './chat-ngrx.model';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as $ from 'jquery';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Order } from '../../../../models/order.model';
import { ChatMessage } from '../../../../models/chat-message.model';
import { ApiService } from '../../../../services/api.service';
import { ChatService } from '../../../../services/chat.service';
import { MemberService } from '../../../../services/member.service';
import { TimeAgoPipe } from '../../../../pipes/time-ago.pipe';
import { DatePipe } from '@angular/common';
import { SnotifyService } from 'ng-snotify';
import { Utilities } from '../../../../services/utilities';
import { ChatRoom } from '../../../../models/chat-room.model';
import { ChatType } from '../../../../models/chat-type.enum';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { ShopService } from '../../../../services/shop.service';
import { MessageFrom } from '../../../../models/message-from.enum';
import { FbMessengerService } from '../../../../services/fb-messenger.service';
import { FacebookService } from 'ngx-facebook';
import { SendFbMessage } from '../../../../models/sendFbMessage.model';


@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-ngrx.component.html',
  styleUrls: ['./chat-ngrx.component.scss']
})
export class ChatComponent implements OnInit {

  chat: Chat[] = [];
  activeChatUser: string;
  activeChatUserImg: string;
  currentChatId: string = 'chat1';
  subscription: Subscription;
  @Input() chatRoom : ChatRoom;

  orderCakeImage: any;
  orderCakeImageIndex = 1;

  @ViewChild('messageInput',{static: true}) messageInputRef: ElementRef;
  @ViewChild('scrollMe',{static: true}) scrollMe: ElementRef;

  messages = new Array() as any;
  item: number = 0;

  toggled: boolean = false;

  constructor(private apiService: ApiService, private fb: FacebookService,
    private dialog: MatDialog, private fbMessengerService: FbMessengerService,
    private chatService: ChatService, private memberService: MemberService, private snotifyService: SnotifyService, private shopService: ShopService ) {

  }

  ngOnInit(){

  }

  ngOnChanges(){
    this.loadChat();
    this.initStyleOfChat();
    if(this.chatRoom.chatType == ChatType.Order){
      this.chatRoom.orderId = Utilities.getOrderIdFromRoomName(this.chatRoom.name);
    }
  }

  initStyleOfChat(){
    

    // Chat application height
    $('.chat-application').height( $(window).height() - $('.navbar').outerHeight() - 60 );

    // Window Resize
    $(window).resize(function() {
      // Adjust height
        $('.chat-application').height( $(window).height() - $('.navbar').outerHeight() - 60 );
    });

    // Apply scrollbar to chat sidebar
    if ($('.chat-sidebar').length > 0) {
      //$('.chat-sidebar').perfectScrollbar();
    }

    // Toggle chat sidebar
    $('.chat-app-sidebar-toggle').on('click', function() {
          $('.chat-sidebar').removeClass('d-none d-sm-none').addClass('d-block d-sm-block');
          $('.content-overlay').addClass('show');
      });

    // chat overlay
      $('.content-overlay').on('click', function() {
          $(this).removeClass('show');
          $('.chat-sidebar').removeClass('d-block d-sm-block').addClass('d-none d-sm-none');
      });

}

  loadChat() {
    this.chat = [];
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('chat-page');
    // this.roomName = this.order.customerId + "-" + this.order.id + "-" + this.order.shopId;

    if(this.chatRoom.chatType == ChatType.Facebook){
      this.fbMessengerService.getMessages(this.chatRoom.pageId, this.chatRoom.name).subscribe(r => {
        this.processChatItem(r.data,true);
        // console.log(this.chat)
      });
    }else{
      this.apiService.loadMessages(this.chatRoom.name).subscribe(r => {
        this.processChatItem(r);
        // console.log(this.chat)
      });
    }


  }

  private  processChatItem(r: ChatMessage[], fromfb= false) {
    _.each(r,async i => {
      try {
        var img = "";
        var name = "";
        if(!i.customer && this.chatRoom.customer){
          i.customer = this.chatRoom.customer
        }
        if (i.messageFrom == MessageFrom.Member && i.member) {
          img = i.member.image;
          name = i.member.name;
        }
        else if (i.messageFrom == MessageFrom.Customer && i.customer) {
          img =  i.customer.image;
          name = i.customer.name;
        }
        let chatItem = new Chat(i.messageFrom == MessageFrom.Member ? 'right' : 'left', i.messageFrom == MessageFrom.Member ? 'chat' : 'chat-left', img, new DatePipe('vi-VN').transform(i.createdDate, 'short'), new TimeAgoPipe().transform(i.createdDate), [i.message], Utilities.isImage(i.message) ? 'image' : 'text', name);
        this.chat.push(chatItem);
      }
      catch (err) {
        console.log(err);
      }
    });
  }

  ngOnDestroy() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("chat-page");
  }

  //send button function calls
  onAddMessage(message) {
    if (this.messageInputRef.nativeElement.value != "" || message) {
      if (this.currentChatId === 'chat1') {
        var chatItem = new Chat(
          'right',
          'chat',
          this.memberService.currentMember.image,
          new DatePipe('vi-VN').transform(new Date()),
          new TimeAgoPipe().transform(new Date()),
          [this.messageInputRef.nativeElement.value || message],
          'text',
          this.memberService.currentMember.name);
        var chatMessage: ChatMessage = new ChatMessage();

        chatMessage.message = this.messageInputRef.nativeElement.value || message;
        chatMessage.createdDate = new Date();
        chatMessage.member = this.memberService.currentMember;
        chatMessage.memberId = this.memberService.currentMember.id;
        chatMessage.chatRoomName = this.chatRoom.name;
        chatMessage.customerId = this.chatRoom.customerId;
        chatMessage.from = this.shopService.currentShop.name;
        chatMessage.messageFrom = MessageFrom.Member;
        this.chat.push(chatItem);

        //
        if(this.chatRoom.chatType == ChatType.Facebook){
          var sendFbMessage :SendFbMessage = {
            fbUserId: this.chatRoom.customer.providerKeyFacebook,
            message: chatMessage.message,
            pageId: this.chatRoom.pageId
          };
          this.fbMessengerService.sendMessage(sendFbMessage).subscribe(rSend=>{

          }, err=>{
            console.log(err)
            this.snotifyService.error(err.json().Message);
          })
        }else{
          this.chatService.chatOrder(chatMessage);
        }

      }
    }

    this.messageInputRef.nativeElement.value = "";
    this.messageInputRef.nativeElement.focus();

  }

  getFiles(event) {
    var file = event.target.files[0];
    this.readThis(file);
  }
  readThis(file: any) {
    var myReader: FileReader = new FileReader();
    this.orderCakeImage = file;
    myReader.onloadend = (e) => {
      this.apiService.uploadImageImg(myReader.result).subscribe(r => {
        this.onAddMessage(r.data.link);
      })
    }
    myReader.readAsDataURL(file);
  }


  handleSelection(event) {
    this.messageInputRef.nativeElement.value += event.char;
  }

  openOrder(orderId){
      this.apiService.getOrder(orderId).subscribe(r => {
        let dialogRef = this.dialog.open(OrderDetailComponent, {
            panelClass: 'col-md-8',
            data: {
                order: r,
            }
        });
    })
  }

}
