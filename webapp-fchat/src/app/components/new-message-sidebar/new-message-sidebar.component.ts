import { Component, Input } from '@angular/core';
import { User } from '@library_v2/interfaces/user';
import { Conversation } from 'src/app/stores/message/message.interface';
import { ViewsService } from 'src/app/views/views.service';

@Component({
  selector: 'app-new-message-sidebar',
  templateUrl: './new-message-sidebar.component.html',
  styleUrls: ['./new-message-sidebar.component.scss']
})
export class NewMessageSidebarComponent{

  @Input() users: User[] = [];

  constructor(
    private viewsService: ViewsService
  ){}

  showConvList(){
    this.viewsService.updateShowConvList(true)
  }
}