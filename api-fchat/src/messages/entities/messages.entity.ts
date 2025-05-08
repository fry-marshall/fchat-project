import { Users } from '../../users/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversations } from './conversations.entity';

@Entity('messages')
export class Messages {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content?: string;

  @Column({ type: 'boolean', default: false })
  is_read: boolean;

  @Column({ type: 'timestamptz' })
  date: Date;

  @ManyToOne(() => Users, { eager: false })
  @JoinColumn({ name: 'sender_id' })
  sender: Users;

  @ManyToOne(() => Users, { eager: false })
  @JoinColumn({ name: 'receiver_id' })
  receiver: Users;

  @ManyToOne(() => Conversations, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversations;
}
