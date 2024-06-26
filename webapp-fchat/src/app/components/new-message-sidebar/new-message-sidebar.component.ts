import { Component, Input } from '@angular/core';
import { User } from '@library_v2/interfaces/user';
import { filter, firstValueFrom } from 'rxjs';
import { MessageFacade } from 'src/app/stores/message/message.facade';
import { Conversation } from 'src/app/stores/message/message.interface';
import { UserFacade } from 'src/app/stores/user/user.facade';
import { RightAction, ViewsService } from 'src/app/views/views.service';

@Component({
  selector: 'app-new-message-sidebar',
  templateUrl: './new-message-sidebar.component.html',
  styleUrls: ['./new-message-sidebar.component.scss']
})
export class NewMessageSidebarComponent{

  @Input() users: User[] = [];

  usersFiltered: User[] = this.users

  constructor(
    private viewsService: ViewsService,
    private messageFacade: MessageFacade,
    private userFacade: UserFacade
  ){}

  filterUserName: string = '';

  showConvList(){
    this.viewsService.updateShowRightComponent(RightAction.show_conversations)
  }

  async addNewConversation(user: User){
    const currentUser = await firstValueFrom(this.userFacade.currentUser$.pipe(filter(user => !!user)))
    const allMessages = await firstValueFrom(this.messageFacade.messages$.pipe(filter(msg => !!msg)))
    const isConvExist = allMessages.find(msg => msg.messages[0].sender_id === user?.id || msg.messages[0].receiver_id === user?.id)
    if(isConvExist){
      this.messageFacade.setCurrentConversation(isConvExist)
    }else{
      const newConversation: Conversation = {
        conversation_id: '',
        messages: [{
          id: '',
          content: '',
          sender_id: currentUser?.id,
          receiver_id: user.id
        }]
      }
      this.messageFacade.setCurrentConversation(newConversation)
    }
  }

  filterUser(){
    this.usersFiltered = this.users.filter(user => user.fullname?.includes(this.filterUserName) || user.fullname === null)
  }
}