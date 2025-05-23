import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '@library_v2/interfaces/user';
import {
  Conversation,
  Message,
} from 'src/app/stores/message/message.interface';
import { MessageService } from 'src/app/stores/message/message.services';

@Component({
  selector: 'app-conversation-card',
  templateUrl: './conversation-card.component.html',
  styleUrls: ['./conversation-card.component.scss'],
  standalone: false,
})
export class ConversationCardComponent implements OnInit {
  @Input() conversation: Conversation | undefined;
  @Input() receiverUserInfos: Partial<User> | undefined;
  @Input() currentUser: Partial<User>;

  lastMessage: Message;
  nbMessageRead: number = 0;
  showReadMessage: boolean = true;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    const lastIndex = this.conversation?.messages.length ?? 1;
    this.lastMessage = this.conversation?.messages[lastIndex - 1]!;
    this.showReadMessage = this.lastMessage.sender.id === this.currentUser.id;
    this.nbMessageRead =
      this.conversation?.messages.filter(
        (msg) => msg.receiver.id !== this.receiverUserInfos?.id && !msg.is_read
      ).length ?? 0;
  }

  getFullName(fullname?: string) {
    return fullname ?? 'Unknown fullname';
  }

  get profileImg() {
    const img = this.receiverUserInfos?.profile_img ?? 'default.png'
    return environment.assetsUrl + img;
  }

  get date() {
    if (this.messageService.isToday(this.lastMessage.date!)) {
      return this.messageService.getDate(this.lastMessage.date!);
    } else if (this.messageService.isYesterday(this.lastMessage.date!)) {
      return 'Yesterday';
    } else {
      return this.messageService.getNormalDate(this.lastMessage.date!);
    }
  }
}
