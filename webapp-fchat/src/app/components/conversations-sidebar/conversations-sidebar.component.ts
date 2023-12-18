import { Component, Input } from '@angular/core';
import { User } from '@library_v2/interfaces/user';
import { MessageFacade } from 'src/app/stores/message/message.facade';
import { Conversation } from 'src/app/stores/message/message.interface';
import { ViewsService } from 'src/app/views/views.service';

@Component({
  selector: 'app-conversations-sidebar',
  templateUrl: './conversations-sidebar.component.html',
  styleUrls: ['./conversations-sidebar.component.scss']
})
export class ConversationsSidebarComponent{

  @Input() conversations: Conversation[] = [];
  @Input() currentUser: User;
  @Input() allUsers: User[];

  conversationFiltered: Conversation[] = this.conversations;

  filterUserName: string

  constructor(
    private viewsService: ViewsService,
    private messageFacade: MessageFacade
  ){}

  showNewMessage(){
    this.viewsService.updateShowConvList(false)
  }

  setCurrentConversation(conversation :Conversation){
    this.messageFacade.setCurrentConversation(conversation)
  }

  getUserInfos(conversation: Conversation){
    return this.messageFacade.getUserInfos(conversation, this.currentUser, this.allUsers)
  }

  filterConversation(){
    this.conversationFiltered = this.conversations.filter(conv => this.getUserInfos(conv)?.fullname.includes(this.filterUserName) || this.getUserInfos(conv)?.fullname === null)
  }
}