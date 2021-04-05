import { Component, HostBinding, OnInit } from '@angular/core';
import {Optional} from '@angular/core';
import { ShopService } from './shared/services/shop.service';
import { ApiService } from './shared/services/api.service';
import * as _ from "lodash";
import { WebsiteConfig } from './shared/models/website-config.model';
import { SwPush } from '@angular/service-worker';
import { FacebookService, InitParams } from 'ngx-facebook';
import { OverlayContainer } from '@angular/cdk/overlay';
declare var Zalo:any;

const THEME_DARKNESS_SUFFIX = `-dark`

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    readonly VAPID_PUBLIC_KEY = "BN2gyoHmqXzqQM_EzsbDUvprmSlVgyWPpopeX4LJYzuoNEVVfKQWcXDQfWBqT06jYcYV91g9hJlaQjPmNpE1_Z4";
    @HostBinding('class') activeThemeCssClass: string
    isThemeDark = false
    activeTheme: string
    constructor(private swPush: SwPush,
        private fb: FacebookService,
        private overlayContainer: OverlayContainer
       ) {


                Zalo.init({
                    version: '2.0',
                    appId: '43860413461215279',
                    redirectUrl: 'https://admin.tiembanhngon.com/zalo_login_response'
                  }
                );

        //    this.subscribeToNotifications();

        let initParams: InitParams = {
            appId: '2079540132308914',
            xfbml: true,
            version: 'v8.0'
          };
      
          this.fb.init(initParams);
        }

    subscribeToNotifications() {

        this.swPush.requestSubscription({
            serverPublicKey: this.VAPID_PUBLIC_KEY
        })
        .then(sub => 
            //this.newsletterService.addPushSubscriber(sub).subscribe()
            {
                var key = sub.getKey('p256dh')
            }
            )
        .catch(err => console.error("Could not subscribe to notifications", err));
    }

    ngOnInit() {
        this.setActiveTheme('tbn', /* darkness: */ false)
    }

    setActiveTheme(theme: string, darkness: boolean = null) {
        if (darkness === null)
            darkness = this.isThemeDark
        else if (this.isThemeDark === darkness) {
            if (this.activeTheme === theme) return
        } else
            this.isThemeDark = darkness

        this.activeTheme = theme

        const cssClass = darkness === true ? theme + THEME_DARKNESS_SUFFIX : theme

        const classList = this.overlayContainer.getContainerElement().classList
        if (classList.contains(this.activeThemeCssClass))
            classList.replace(this.activeThemeCssClass, cssClass)
        else
            classList.add(cssClass)

        this.activeThemeCssClass = cssClass
    }
}
