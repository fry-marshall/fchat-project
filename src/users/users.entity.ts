import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  fullname?: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ unique: true })
  email?: string;

  @Column()
  email_verified_token?: string;

  @Column({ type: 'timestamptz', nullable: true })
  email_expiredtime?: Date;

  @Column({ type: 'boolean', default: false })
  email_verified?: boolean;

  @Column({ type: 'varchar', nullable: true })
  forgotpasswordtoken?: string;

  @Column({ type: 'boolean', default: false })
  forgotpasswordused?: boolean;

  @Column()
  password?: string;

  @Column({ type: 'varchar', default: 'default.png' })
  profile_img?: string;

  @Column({ type: 'varchar', nullable: true })
  refresh_token?: string | null;
}
