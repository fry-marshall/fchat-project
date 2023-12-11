import { Component, Input } from "@angular/core";


@Component({
    selector: 'app-sender-message-input',
    templateUrl: './sender-message-input.component.html',
    styleUrls: [
        './sender-message-input.component.scss'
    ]
})
export class SenderMessageInputComponent{

    @Input() message: string;
    @Input() isSender: boolean;
    @Input() date: string;
}