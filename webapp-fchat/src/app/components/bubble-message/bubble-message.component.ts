import { Component, HostBinding, Input } from '@angular/core';
import { Message } from 'src/app/stores/message/message.interface';
import { MessageService } from 'src/app/stores/message/message.services';

@Component({
  selector: 'app-bubble-message',
  templateUrl: './bubble-message.component.html',
  styleUrls: ['./bubble-message.component.scss'],
  standalone: false,
})
export class BubbleMessageComponent {
  @Input() message: Message;
  @Input() isSender: boolean;

  constructor(private messageService: MessageService) {}

  @HostBinding('class.sender')
  get senderClass() {
    return this.isSender;
  }

  @HostBinding('class.receiver')
  get receiverClass() {
    return !this.isSender;
  }

  get date() {
    return this.messageService.getDate(this.message.date!);
  }
}
