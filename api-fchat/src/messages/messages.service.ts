import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversations } from './entities/conversations.entity';
import { Repository } from 'typeorm';
import { SendMessageDto } from './dto/send-message.dto';
import { Users } from '../users/entities/users.entity';
import { Messages } from './entities/messages.entity';
import { ChatGateway } from '../gateways/chat.gateway';
import { ReadMessageDto } from './dto/read-message.dto';
import { FirebaseService } from 'src/common/firebase.service';
import { Devicetokens } from 'src/users/entities/devicetokens.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversations)
    private readonly conversationsRepository: Repository<Conversations>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Messages)
    private readonly messagesRepository: Repository<Messages>,
    @InjectRepository(Devicetokens)
    private readonly deviceTokensRepository: Repository<Devicetokens>,
    private readonly chatGateway: ChatGateway,
    private readonly firebaseService: FirebaseService,
  ) {}

  async getUserMessages(userId: string) {
    const conversations = await this.conversationsRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.user1', 'user1')
      .leftJoin('conversation.user2', 'user2')
      .leftJoin('conversation.messages', 'messages')
      .leftJoin('messages.sender', 'sender')
      .leftJoin('messages.receiver', 'receiver')
      .where('user1.id = :userId OR user2.id = :userId', {
        userId,
      })
      .select([
        'conversation.id',
        'user1.id',
        'user2.id',
        'messages.id',
        'messages.content',
        'messages.is_read',
        'messages.date',
        'receiver.id',
        'sender.id',
      ])
      .orderBy('messages.date', 'ASC')
      .getMany();
    return { conversations };
  }

  async sendMessage(userId: string, sendMessageDto: SendMessageDto) {
    const receiverUser = await this.usersRepository.findOne({
      where: { id: sendMessageDto.user_id, email_verified: true },
    });

    if (!receiverUser) {
      throw new NotFoundException('User not found');
    }

    const senderUser = await this.usersRepository.findOne({
      where: { id: userId },
    });

    let conversation = await this.conversationsRepository.findOne({
      where: [
        {
          user1: senderUser!,
          user2: receiverUser,
        },
        {
          user1: receiverUser,
          user2: senderUser!,
        },
      ],
    });

    if (!conversation) {
      conversation = this.conversationsRepository.create({
        user1: senderUser!,
        user2: receiverUser,
      });

      await this.conversationsRepository.save(conversation);
    }

    const message = this.messagesRepository.create({
      content: sendMessageDto.content,
      date: new Date(),
      sender: senderUser!,
      receiver: receiverUser,
      conversation: conversation,
    });

    await this.messagesRepository.save(message);
    this.chatGateway.sendMessage(receiverUser.id, {
      id: message.id,
      date: message.date,
      sender_id: senderUser?.id,
      content: message.content,
      conversation_id: conversation.id,
    });

    const userToken = await this.deviceTokensRepository.findOne({
      where: { user: receiverUser },
    });

    if (userToken) {
      const messageNotification = {
        title: 'New message',
        body: message.content ?? '',
      };
      await this.firebaseService.sendNotification(
        userToken?.token!,
        messageNotification,
      );
    }

    return {
      message: 'Message sent successfully',
      conversation: {
        id: conversation.id,
        message: { id: message.id, date: message.date },
      },
    };
  }

  async readMessage(userId: string, readMessageDto: ReadMessageDto) {
    const conversation = await this.conversationsRepository.findOne({
      relations: ['user1', 'user2'],
      where: [
        {
          id: readMessageDto.conversation_id,
        },
      ],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const allMessages = await this.messagesRepository.find({
      relations: ['receiver'],
      where: { conversation: conversation },
    });

    for (const message of allMessages) {
      if (message.receiver.id === userId) {
        await this.messagesRepository.update(message.id, { is_read: true });
      }
    }

    if (conversation.user1.id !== userId) {
      this.chatGateway.readMessage(conversation.user1?.id, {
        conversation_id: conversation.id,
      });
    } else if (conversation.user2.id !== userId) {
      this.chatGateway.readMessage(conversation.user2?.id, {
        conversation_id: conversation.id,
      });
    }

    return {
      message: 'Message read successfully',
      conversation: {
        id: readMessageDto.conversation_id,
      },
    };
  }
}
