import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversations } from './entities/conversations.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversations)
    private readonly conversationsRepository: Repository<Conversations>,
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
}
