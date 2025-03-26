import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  fullname?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ unique: true })
  email?: string;

  @Column({ nullable: true })
  email_verified_token?: string;

  @Column({ nullable: true })
  email_expiredtime?: string;

  @Column({ default: false })
  email_verified?: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  forgotpasswordtoken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  forgotpassword_expires_at?: Date;

  @Column({ nullable: true })
  forgotpasswordused?: boolean;

  @Column()
  password?: string;

  @Column({ default: 'default.png' })
  profile_img?: string;

  @Column({ type: 'text', nullable: true })
  refresh_token?: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
