import { Component, HostListener, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { firstValueFrom } from "rxjs";
import { MessageFacade } from "src/app/stores/message/message.facade";
import { UserFacade } from "src/app/stores/user/user.facade";


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

    formGroup: FormGroup = new FormGroup({
        send_input: new FormControl('')
    })

    constructor(
        private messageFacade: MessageFacade,
        private userFacade: UserFacade,
    ){}

    async sendNewMessage(){
        if(this.formGroup.get('send_input')?.value.trim() !== ''){
            const receiver_id = (await firstValueFrom(this.messageFacade.receiverUserInfos$))?.id
            const sender_id = (await firstValueFrom(this.userFacade.currentUser$))?.id
            this.messageFacade.sendNewMessage(this.formGroup.get('send_input')?.value.trim(), receiver_id!, sender_id!)
            this.formGroup.reset()
        }
    }

    @HostListener('document:keydown.enter', ['$event'])
    async sendNewMessageByClickingOnEnter(){
        if(this.formGroup.get('send_input')?.value.trim() !== ''){
            const receiver_id = (await firstValueFrom(this.messageFacade.receiverUserInfos$))?.id
            const sender_id = (await firstValueFrom(this.userFacade.currentUser$))?.id
            this.messageFacade.sendNewMessage(this.formGroup.get('send_input')?.value.trim(), receiver_id!, sender_id!)
            this.formGroup.reset()
        }
    }
}