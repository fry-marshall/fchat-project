import { Users } from '../../users/users.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Messages } from './messages.entity';

@Entity('conversations')
@Unique(['user1', 'user2'])
export class Conversations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id_1' })
  user1: Users;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id_2' })
  user2: Users;

  @OneToMany(() => Messages, (message) => message.conversation)
  messages: Messages[];
}
