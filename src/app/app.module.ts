import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule } from "@angular/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { MatNativeDateModule } from '@angular/material/core';
import localeVI from '@angular/common/locales/vi'
import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SwPush } from '@angular/service-worker';
import { OnlineOfflineService } from './shared/services/offline.service';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { FacebookService } from 'ngx-facebook';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { JwPaginationModule } from 'jw-angular-pagination';



registerLocaleData(localeVI);

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
// let providers = {
//     "facebook": {
//       "clientId": "734357280108838",
//       "apiVersion": "v2.11" //like v2.4
//     },
//     'google':{
//       "clientId": "506272453285-6p54cobrgnl7s5956ufuo4fr70kp8g3n.apps.googleusercontent.com"
//     }
//   };

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        NgxDatatableModule,
        NgxPaginationModule,
        JwPaginationModule,
        HttpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            },
            defaultLanguage: 'tbn'
        }),
        SnotifyModule.forRoot(),

        AppRoutingModule, MatNativeDateModule, FormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ],
    declarations: [AppComponent],
    entryComponents: [],
    providers: [
        FacebookService,
        AuthGuard,{
        provide: LOCALE_ID,
        useValue: 'vi-VN' // 'de-DE' for Germany, 'fr-FR' for France ...
    }, SwPush,
        { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
        SnotifyService, UniqueSelectionDispatcher
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
