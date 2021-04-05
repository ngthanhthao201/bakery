import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";


import { ChatsRoutingModule } from "./chats-routing.module";

import { ChatsComponent } from "./chats.component";
import { ChatComponent } from '../../shared/modules/order-detail/components/chat-ngrx/chat-ngrx.component';
import { SharedModule } from '../../shared/modules/shared.module';


@NgModule({
    imports: [
        CommonModule,
        ChatsRoutingModule,
        SharedModule
    ],
    declarations: [
        ChatsComponent , ChatComponent
    ]
})
export class ChatsModule { }
