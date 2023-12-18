import { Component, Input, OnInit } from '@angular/core';
import { User } from '@library_v2/interfaces/user';
import { Conversation, Message } from 'src/app/stores/message/message.interface';

@Component({
  selector: 'app-conversation-card',
  templateUrl: './conversation-card.component.html',
  styleUrls: ['./conversation-card.component.scss']
})
export class ConversationCardComponent implements OnInit{

  @Input() conversation: Conversation | undefined;
  @Input() userInfos: User | undefined;
  
  lastMessage: Message

  ngOnInit() {

    const lastIndex = this.conversation?.messages.length ?? 1
    this.lastMessage = this.conversation?.messages[lastIndex - 1]!
  }

  getFullName(fullname?: string){
    return fullname ?? 'Unknown fullname'
  }
}