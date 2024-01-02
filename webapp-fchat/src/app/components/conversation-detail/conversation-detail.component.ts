import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { User } from "@library_v2/interfaces/user";
import { combineLatest, filter, firstValueFrom, map } from "rxjs";
import { MessageFacade } from "src/app/stores/message/message.facade";
import { Conversation, Message } from "src/app/stores/message/message.interface";
import { UserFacade } from "src/app/stores/user/user.facade";

@Component({
    selector: 'app-conversation-detail',
    templateUrl: './conversation-detail.component.html',
    styleUrls: [
        './conversation-detail.component.scss'
    ]
})
export class ConversationDetailComponent implements OnInit, AfterViewInit  {

    constructor(
        private messageFacade: MessageFacade,
        private userFacade: UserFacade
    ) { }

    viewModel$ = combineLatest({
        userInfos: this.messageFacade.receiverUserInfos$.pipe(filter(user => !!user)),
        messages: this.messageFacade.currentConversation$.pipe(filter(conv => !!conv), map(conv => conv?.messages.filter(msg => msg.content !== ''))),
        currentUser: this.userFacade.currentUser$.pipe(filter(user => !!user))
    })

    async ngOnInit() {
        
    }

    ngAfterViewInit() {
        document.getElementsByClassName('messages')[0].scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }

    getFullName(fullname: string | undefined) {
        return fullname ?? 'Unknown fullname'
    }

    isSender(user: User, message: Message) {
        return user.id === message.sender_id
    }
}