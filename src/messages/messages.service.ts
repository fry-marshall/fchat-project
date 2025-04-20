import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversations } from './entities/conversations.entity';
import { Repository } from 'typeorm';
import { SendMessageDto } from './dto/send-message.dto';
import { Users } from 'src/users/users.entity';
import { Messages } from './entities/messages.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversations)
    private readonly conversationsRepository: Repository<Conversations>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Messages)
    private readonly messagesRepository: Repository<Messages>,
  ) {}

  async getUserMessages(userId: string) {
    const conversations = await this.conversationsRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.user1', 'user1')
      .leftJoinAndSelect('conversation.user2', 'user2')
      .leftJoinAndSelect('conversation.messages', 'messages')
      .where('user1.id = :userId OR user2.id = :userId', {
        userId,
      })
      .select([
        'conversation.id',
        'user1.id',
        'user1.fullname',
        'user1.description',
        'user1.profile_img',
        'user2.id',
        'user2.fullname',
        'user2.description',
        'user2.profile_img',
        'messages.id',
        'messages.content',
        'messages.is_read',
        'messages.date',
        'messages.receiver_id',
        'messages.sender_id',
      ])
      .orderBy('messages.date', 'ASC')
      .getRawMany();

    return { conversations };
  }

  async sendMessage(userId: string, sendMessageDto: SendMessageDto) {
    const receiverUser = await this.usersRepository.findOne({
      where: { id: sendMessageDto.user_id },
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
          user2: receiverUser!,
        },
        {
          user1: receiverUser!,
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
      receiver: receiverUser!,
      conversation: conversation,
    });

    await this.messagesRepository.save(message);

    return {
      message: 'Message sent successfully',
      conversation: {
        id: conversation.id,
        message: { id: message.id, date: message.date },
      },
    };
  }
}
