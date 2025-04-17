import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/users.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { MailService } from '../common/mail.service';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyDto } from './dto/verify.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
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

  async signin(signinDto: SigninDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: signinDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const isValidPassword = await bcrypt.compare(
      signinDto.password,
      user.password!,
    );

    if (!isValidPassword) {
      throw new NotFoundException('user not found');
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN,
      expiresIn: '1h',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN,
      expiresIn: '7d',
    });

    await this.usersRepository.update(user.id, {
      refresh_token,
    });

    return { access_token, refresh_token };
  }

  async logout(logoutDto: LogoutDto) {
    const user = await this.usersRepository.findOne({
      where: {
        refresh_token: logoutDto.refresh_token,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.update(user.id, {
      refresh_token: null,
    });

    return { message: 'User logged out successfully' };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      await this.jwtService.verifyAsync(refreshTokenDto.refresh_token, {
        secret: process.env.REFRESH_TOKEN,
      });

      const user = await this.usersRepository.findOne({
        where: {
          refresh_token: refreshTokenDto.refresh_token,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const payload = {
        id: user.id,
        email: user.email,
      };

      const access_token = this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN,
        expiresIn: '1h',
      });

      const refresh_token = this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN,
        expiresIn: '7d',
      });

      await this.usersRepository.update(user.id, {
        refresh_token,
      });

      return { access_token, refresh_token };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verify(verifyDto: VerifyDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email_verified_token: verifyDto.token,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentTime = new Date();
    if (currentTime > user.email_expiredtime!) {
      throw new BadRequestException('Verification code expired');
    }

    await this.usersRepository.update(user.id, {
      email_verified: true,
    });

    return { message: 'Email verified successfully' };
  }
}
