import { Component, Input } from '@angular/core';
import { User } from '@library_v2/interfaces/user';
import { Conversation } from 'src/app/stores/message/message.interface';

@Component({
  selector: 'app-conversation-card',
  templateUrl: './conversation-card.component.html',
  styleUrls: ['./conversation-card.component.scss']
})
export class ConversationCardComponent{

  @Input() user: User | undefined;
  @Input() conversation: Conversation | undefined;
}