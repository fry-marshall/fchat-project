import { Component, Input, OnInit } from "@angular/core";
import { filter, firstValueFrom } from "rxjs";
import { Conversation, Message } from "src/app/stores/message/message.interface";
import { UserFacade } from "src/app/stores/user/user.facade";

@Component({
    selector: 'app-conversation-detail',
    templateUrl: './conversation-detail.component.html',
    styleUrls: [
        './conversation-detail.component.scss'
    ]
})
export class ConversationDetailComponent{

    @Input() conversation: Conversation;
}