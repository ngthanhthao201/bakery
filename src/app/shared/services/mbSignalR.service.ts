import { EventEmitter, Injectable } from "@angular/core";
import {HubConnection, HubConnectionBuilder, HttpTransportType, HubConnectionState} from "@aspnet/signalr";
import { environment } from "../../../environments/environment";
import { CommonService } from "./common.service";

@Injectable({
    providedIn: 'root'
})
export class MbSignalRService {
    private _hubConnection: HubConnection;
    countTry = 0;
    public connectedEvent: EventEmitter<any> = new EventEmitter();

    constructor(private commonService: CommonService) {
        this.connectToServer();
        
    }

    public connectToServer(){
        if(this.isConnected) return;
        var hubConnectionBuilder = new HubConnectionBuilder();
        if(!this.commonService.accessToken) return;
        hubConnectionBuilder.withUrl( environment.baseURl + "order"
        ,  {transport: HttpTransportType.WebSockets, accessTokenFactory: () => this.commonService.accessToken})
        .withAutomaticReconnect();
        
        this._hubConnection =  hubConnectionBuilder.build();
        this._hubConnection.keepAliveIntervalInMilliseconds = 3000;
        this._hubConnection.serverTimeoutInMilliseconds = 60000;

        console.log('start connect');
         this._hubConnection.start().then(() => {
             console.log('connected');
             this.connectedEvent.emit();
         }, err=>{
            console.log(err);
            if(this.countTry<2){
                this.countTry++;
                this.connectToServer();
            }

        });

        this._hubConnection.onreconnected(()=>{
            this.connectedEvent.emit();
        })

        this._hubConnection.onclose(()=>
        {
            console.log('onclose');
            this._hubConnection.start().then(() => {
                console.log('connected');
                this.connectedEvent.emit();
            });
        });

        
    }

    public get isConnected(){
        return this._hubConnection && this._hubConnection.state == HubConnectionState.Connected;
    }

    public  joinRoom(roomName: string){      
        if(this.isConnected){
            return this._hubConnection.invoke("JoinRoom", roomName);
        }else{
            this.connectedEvent.subscribe(() => {
                return this._hubConnection.invoke("JoinRoom", roomName);
            })
        }
       
    }

    public invoke(method, arg){
        if(this.isConnected){
            this._hubConnection.invoke(method, arg);
        }else{
            this.connectedEvent.subscribe(() => {
                this._hubConnection.invoke(method, arg);
            })
        }
         
    }

    public listenEvent(eventName, action){
        if(!this._hubConnection) {
            console.log( '_hubConnection null');
            return;
        }

        if(!this.isConnected) {
            console.log('try to listen ' + eventName);
            console.log( 'not connected yet');
            return;
        }

        this._hubConnection.off(eventName);

        console.log('listening ' + eventName);
        this._hubConnection.on(eventName, action);
        
    }

}