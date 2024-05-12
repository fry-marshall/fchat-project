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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateProfileSidebarComponent } from './update-profile-sidebar/update-profile-sidebar.component';
import { UserProfilePictureComponent } from './user-profile-picture/user-profile-picture.component';


@NgModule({
  declarations: [
    ConversationCardComponent,
    ConversationsSidebarComponent,
    NewMessageSidebarComponent,
    UserCardComponent,
    BubbleMessageComponent,
    SenderMessageInputComponent,
    ConversationDetailComponent,
    UpdateProfileSidebarComponent,
    UserProfilePictureComponent
  ],
  imports: [
    UiModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ConversationCardComponent,
    ConversationsSidebarComponent,
    NewMessageSidebarComponent,
    UserCardComponent,
    BubbleMessageComponent,
    SenderMessageInputComponent,
    ConversationDetailComponent,
    UpdateProfileSidebarComponent,
    UserProfilePictureComponent
  ]
})
export class ComponentsModule { }
