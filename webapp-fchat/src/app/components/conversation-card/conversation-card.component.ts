import { Component, Input, OnInit } from '@angular/core';
import { User } from '@library_v2/interfaces/user';
import { filter, firstValueFrom } from 'rxjs';
import { MessageFacade } from 'src/app/stores/message/message.facade';
import { Conversation, Message } from 'src/app/stores/message/message.interface';
import { UserFacade } from 'src/app/stores/user/user.facade';

@Component({
  selector: 'app-conversation-card',
  templateUrl: './conversation-card.component.html',
  styleUrls: ['./conversation-card.component.scss']
})
export class ConversationCardComponent implements OnInit{

  @Input() conversation: Conversation | undefined;

  constructor(
    private messageFacade: MessageFacade,
    private userFacade: UserFacade
  ){}

  userInfos: User | undefined
  lastMessage: Message

  async ngOnInit() {
    const allUsers = await firstValueFrom(this.userFacade.users$.pipe(filter(users => !!users)))
    const currentUser = await firstValueFrom(this.userFacade.currentUser$.pipe(filter(user => !!user)))
    
    this.userInfos = this.messageFacade.getUserInfos(this.conversation, currentUser!, allUsers)

    const lastIndex = this.conversation?.messages.length ?? 1
    this.lastMessage = this.conversation?.messages[lastIndex - 1]!
  }

  getFullName(fullname?: string){
    return fullname ?? 'Unknown fullname'
  }
}