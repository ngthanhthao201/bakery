import { Injectable, EventEmitter } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import { environment } from "../../../environments/environment";
import { HubConnection, HubConnectionBuilder, HttpTransportType, HubConnectionState } from "@aspnet/signalr";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _loginHubConnection: HubConnection;
    public connectedEvent: EventEmitter<any> = new EventEmitter();

    constructor(private http: Http) {
        var hubConnectionBuilder = new HubConnectionBuilder();
        hubConnectionBuilder.withUrl(environment.baseURl + "loginhub"
            , { transport: HttpTransportType.WebSockets });

        this._loginHubConnection = hubConnectionBuilder.build();
        this._loginHubConnection.keepAliveIntervalInMilliseconds = 3000;
        this._loginHubConnection.serverTimeoutInMilliseconds = 60000;

        this._loginHubConnection.start().then(() => {
            console.log('connected');
            this.connectedEvent.emit();
        }, err => {
            console.log(err);
            //this.connectToServer();
        });

        this._loginHubConnection.onclose(() => {
            console.log('onclose');
            this._loginHubConnection.start().then(() => {
                console.log('connected');
                this.connectedEvent.emit();
            });
        });
    }

    public get isConnected() {
        return this._loginHubConnection && this._loginHubConnection.state == HubConnectionState.Connected;
    }

    public joinRoom(roomName: string) {
        if (this.isConnected) {
            return this._loginHubConnection.invoke("JoinRoom", roomName);
        } else {
            this.connectedEvent.subscribe(() => {
                return this._loginHubConnection.invoke("JoinRoom", roomName);
            })
        }

    }

    public invoke(method, arg) {
        if (this.isConnected) {
            this._loginHubConnection.invoke(method, arg);
        } else {
            this.connectedEvent.subscribe(() => {
                this._loginHubConnection.invoke(method, arg);
            })
        }

    }

    public invoke2(method, arg1, arg2) {
        if (this.isConnected) {
            this._loginHubConnection.invoke(method, arg1, arg2);
        } else {
            this.connectedEvent.subscribe(() => {
                this._loginHubConnection.invoke(method, arg1, arg2);
            })
        }

    }


    public listenEvent(eventName, action) {
        if (!this._loginHubConnection) {
            console.log('_hubConnection null');
            return;
        }

        if (!this.isConnected) {
            console.log('try to listen ' + eventName);
            console.log('not connected yet');
            this.connectedEvent.subscribe(() => {
                this._loginHubConnection.on(eventName, action);
            })
            return;
        }
        console.log('listening ' + eventName);
        this._loginHubConnection.on(eventName, action);

    }



}
