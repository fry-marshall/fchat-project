import { NgModule } from '@angular/core';
import { UiModule } from '@library_v2/ui-module';
import { ConversationCardComponent } from './conversation-card/conversation-card.component';
import { ConversationsSidebarComponent } from './conversations-sidebar/conversations-sidebar.component';
import { NewMessageSidebarComponent } from './new-message-sidebar/new-message-sidebar.component';
import { UserCardComponent } from './user-card/user-card.component';
import { CommonModule } from '@angular/common';
import { BubbleMessageComponent } from './bubble-message/bubble-message.component';
import { SenderMessageInputComponent } from './sender-message-input/sender-message-input.component';
import { ConversationDetailComponent } from './conversation-detail/conversation-detail.component';


@NgModule({
  declarations: [
    ConversationCardComponent,
    ConversationsSidebarComponent,
    NewMessageSidebarComponent,
    UserCardComponent,
    BubbleMessageComponent,
    SenderMessageInputComponent,
    ConversationDetailComponent
  ],
  imports: [
    UiModule,
    CommonModule
  ],
  exports: [
    ConversationCardComponent,
    ConversationsSidebarComponent,
    NewMessageSidebarComponent,
    UserCardComponent,
    BubbleMessageComponent,
    SenderMessageInputComponent,
    ConversationDetailComponent
  ]
})
export class ComponentsModule { }
