import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition, componentTransition } from '../router.animations';
import {ApiService} from "../shared/services/api.service"
import { JwtHelper } from '../shared/services/jwt-helper';
import { SnotifyService } from 'ng-snotify';
import * as _ from 'lodash';
import { Utilities } from '../shared/services/utilities';
import { MbSignalRService } from '../shared/services/mbSignalR.service';
import { AuthService } from '../shared/services/auth.service';
import { CommonService } from '../shared/services/common.service';
import { MemberService } from '../shared/services/member.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition(), componentTransition()],
})
export class LoginComponent implements OnInit {

    state:any={
      hasSocialUser: false,
      isLinked : true
    }
    groupLoginId: string;
    

    localVM: any = {};

    constructor(private commonService : CommonService, private snotifyService: SnotifyService, public router: Router, private zone:NgZone,
      private memberService: MemberService,
      private authService: AuthService,
      private apiService : ApiService
      ) {
    }

    ngOnInit() {
      this.groupLoginId = Utilities.guid();
      if(this.authService.isConnected){
        this.addListenLogin();
      }

      this.authService.connectedEvent.subscribe(r=>{
        this.addListenLogin();
      })
    }

    addListenLogin(){

      this.authService.joinRoom(this.groupLoginId);
      this.authService.listenEvent("SendDirectMessageComming", (token)=>{
        this.processTokenResponse(token);
      })
    }

    onLoggedin() {
        localStorage.setItem('isLoggedin', 'true');
    }

    loginLocal(){
      this.apiService.loginLocal(this.localVM).subscribe(response=>{
        this.processTokenResponse(response.access_token);
      },
      err=>{
        this.snotifyService.error("Sai username hoặc password!","");
      }
    );
    }

  private processTokenResponse(response: string) {
    localStorage.removeItem("openIdTokenParams");
    localStorage.setItem("accessToken", response);
    this.commonService.accessToken = response;
    this.memberService.getMember();
    this.router.navigateByUrl("");
  }

    signIn(provider){

      }
     
      logout(){
        // this._auth.logout().subscribe(
        //   (data)=>{
            
        //   } 
        // )
      }
}
