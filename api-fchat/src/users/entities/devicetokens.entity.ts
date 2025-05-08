import { Users } from './users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('devicetokens')
export class Devicetokens {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  token?: string;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
