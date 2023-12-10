import { Component, Input } from '@angular/core';
import { User } from '@library_v2/interfaces/user';
import { Conversation } from 'src/app/stores/message/message.interface';
import { ViewsService } from 'src/app/views/views.service';

@Component({
  selector: 'app-conversations-sidebar',
  templateUrl: './conversations-sidebar.component.html',
  styleUrls: ['./conversations-sidebar.component.scss']
})
export class ConversationsSidebarComponent{

  @Input() conversations: Conversation[];

  constructor(
    private viewsService: ViewsService
  ){}

  showNewMessage(){
    this.viewsService.updateShowConvList(false)
  }
}