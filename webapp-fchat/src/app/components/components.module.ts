import { NgModule } from '@angular/core';
import { UiModule } from '@library_v2/ui-module';
import { ConversationCardComponent } from './conversation-card/conversation-card.component';


@NgModule({
  declarations: [
    ConversationCardComponent
  ],
  imports: [
    UiModule
  ],
  exports: [
    ConversationCardComponent
  ]
})
export class ComponentsModule { }
