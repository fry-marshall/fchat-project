import { Component, Input, OnInit } from '@angular/core';
import { User } from '@library_v2/interfaces/user';
import { Conversation, Message } from 'src/app/stores/message/message.interface';
import { MessageService } from 'src/app/stores/message/message.services';

@Component({
  selector: 'app-conversation-card',
  templateUrl: './conversation-card.component.html',
  styleUrls: ['./conversation-card.component.scss']
})
export class ConversationCardComponent implements OnInit{

  @Input() conversation: Conversation | undefined;
  @Input() userInfos: User | undefined;
  
  lastMessage: Message
  nbMessageRead: number = 0

  constructor(
    private messageService: MessageService
  ){}

  ngOnInit() {

    const lastIndex = this.conversation?.messages.length ?? 1
    this.lastMessage = this.conversation?.messages[lastIndex - 1]!
    this.nbMessageRead = this.conversation?.messages.filter(msg => !msg.is_read).length ?? 0
    console.log(this.nbMessageRead)
  }

  getFullName(fullname?: string){
    return fullname ?? 'Unknown fullname'
  }

  get date(){
    return this.messageService.getDate(this.lastMessage.date!)
  }
}