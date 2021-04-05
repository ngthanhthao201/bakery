import { EventEmitter, Injectable, ViewContainerRef } from "@angular/core";
import { ChatMessage } from "../models/chat-message.model";
import { Shop } from "../models/shop.model";
import { MbSignalRService } from "./mbSignalR.service";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    public chatShopAdded$: EventEmitter<ChatMessage>;
    private chatShopMessages: ChatMessage[] = [];
    private _memberId: number;
    private _currentShop: Shop;
    private connectionId: string;
    constructor( private mbSignalRService: MbSignalRService) {
        this.chatShopAdded$ = new EventEmitter();
        
    }

    public list(): ChatMessage[] {
        return this.chatShopMessages;
    }

    public add(item: ChatMessage, emit:boolean= true): void {
        this.chatShopMessages.push(item);
        if(emit){
            this.chatShopAdded$.emit(item);
        }
        
    }

    public chatShop(cm: ChatMessage){
        cm.memberId = this._memberId;
        this.mbSignalRService.invoke("ChatShop", cm);
    }

    public chatOrder(cm: ChatMessage){
        cm.messageFrom = 0;
        this.mbSignalRService.invoke("ChatOrder", cm);
    }

    // public setHubConnection(hubConnection: HubConnection, memberId: number, currentShop: Shop){
    //     this._hubConnection = hubConnection;
    //     this._memberId = memberId;
    //     this._currentShop = currentShop;
    //     this.connectionId = (this._hubConnection as any).connection.connectionId;
    //     this._hubConnection.on('ChatShopComing', ( cm: ChatMessage) => {          
    //         if(this.connectionId !== cm.connectionId){
    //             this.add(cm);
    //         }
    //     });

    //     //join public shop room
    //     this._hubConnection.invoke("JoinRoom", this._currentShop.name+ this._currentShop.id);

    // }

    // public getHubConnection(): HubConnection{
    //     return this._hubConnection;
    // }

}