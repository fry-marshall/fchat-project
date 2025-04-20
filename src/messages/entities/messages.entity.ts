import { Users } from '../../users/users.entity';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Conversations } from './conversations.entity';

export class Messages {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content?: string;

  @Column({ type: 'boolean', default: false })
  is_read: boolean;

  @Column({ type: 'timestamptz' })
  date: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'sender_id' })
  sender: Users;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'receiver_id' })
  receiver: Users;

  @ManyToOne(() => Conversations, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversations;
}
