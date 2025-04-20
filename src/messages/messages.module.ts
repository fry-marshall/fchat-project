import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversations } from './entities/conversations.entity';
import { Messages } from './entities/messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversations, Messages])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
