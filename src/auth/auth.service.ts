import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/users.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { MailService } from '../common/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly mailService: MailService,
  ) {}

  async signup(signupDto: SignupDto) {
    try {
      const password = bcrypt.hashSync(signupDto.password, 10);
      const expiredTime = new Date();
      expiredTime.setMinutes(expiredTime.getMinutes() + 10);

      const user = this.usersRepository.create({
        ...signupDto,
        password,
        email_expiredtime: expiredTime,
        email_verified_token: randomUUID(),
      });

      await this.usersRepository.save(user);

      if (process.env.NODE_ENV === 'prod') {
        const url: string = `https://fchat.mfry.io/verify/${user.email_verified_token}`;
        await this.mailService.sendMail(
          signupDto.email,
          'Verification du compte',
          url,
        );
      }

      return {
        message: 'User created successfully',
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }
}
