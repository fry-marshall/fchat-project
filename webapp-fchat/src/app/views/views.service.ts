import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export enum RightAction{
    new_message = 'new_message',
    show_conversations = 'show_conversations',
    update_profile = 'update_profile'
}

@Injectable({
    providedIn: 'root'
})
export class ViewsService{

    private showRightComponent = new BehaviorSubject(RightAction.show_conversations)
    showRightComponent$ = this.showRightComponent.asObservable()

    updateShowRightComponent(value: RightAction){
        this.showRightComponent.next(value)
    }
}