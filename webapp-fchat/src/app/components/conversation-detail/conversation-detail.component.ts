import { Component, Input, OnInit } from "@angular/core";
import { User } from "@library_v2/interfaces/user";
import { filter, firstValueFrom } from "rxjs";
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
export class ConversationDetailComponent implements OnInit{

    @Input() conversation: Conversation;

    constructor(
        private messageFacade: MessageFacade,
        private userFacade: UserFacade
    ){}

    userInfos: User | undefined

    async ngOnInit() {
        console.log("ngOnInit")
        const currentUser = await firstValueFrom(this.userFacade.currentUser$.pipe(filter(user => !!user)))
        console.log("currentUser", currentUser)
        const currentConversation = await firstValueFrom(this.messageFacade.currentConversation$.pipe(filter(conv => !!conv)))
        console.log("currentConversation", currentConversation)
        const getAllUsers = await firstValueFrom(this.userFacade.users$.pipe(filter(users => !!users)))

        let userId: string | undefined = ''
    
        const message = currentConversation?.messages[0]
        if(message?.receiver_id === currentUser?.id){
            userId = message!.sender_id
        }
        else{
            userId = message!.receiver_id
        }

        this.userInfos = getAllUsers.find(user => user.id === userId)

        console.log(this.userInfos)
    }

    getFullName(fullname: string | undefined){
        return fullname ?? 'Unknown fullname'
    }
}