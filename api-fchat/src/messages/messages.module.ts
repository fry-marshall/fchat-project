import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversations } from './entities/conversations.entity';
import { Messages } from './entities/messages.entity';
import { Users } from '../users/entities/users.entity';
import { GatewaysModule } from '../gateways/gateways.module';
import { FirebaseService } from '../common/firebase.service';
import { Devicetokens } from 'src/users/entities/devicetokens.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversations, Messages, Users, Devicetokens]),
    GatewaysModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, FirebaseService],
})
export class MessagesModule {}
