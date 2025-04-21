import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversations } from './entities/conversations.entity';
import { Messages } from './entities/messages.entity';
import { Users } from 'src/users/users.entity';
import { GatewaysModule } from 'src/gateways/gateways.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversations, Messages, Users]),
    GatewaysModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
