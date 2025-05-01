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
import { ForgotpasswordDto } from './dto/forgotpassword.dto';
import { ResetpasswordDto } from './dto/resetpassword';
import { GenerateTokenDto } from './dto/generatetoken.dto';

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
          'Account verification',
          url,
          'verify-account',
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

    if (!user.email_verified) {
      throw new UnauthorizedException('email is not verified');
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '1h',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
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
        secret: process.env.REFRESH_TOKEN_SECRET,
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
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '1h',
      });

      const refresh_token = this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
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

  async forgotPassword(forgotpasswordDto: ForgotpasswordDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: forgotpasswordDto.email,
      },
    });

    if (user) {
      const forgotpasswordtoken = randomUUID();

      await this.usersRepository.update(user.id, {
        forgotpasswordtoken,
        forgotpasswordused: false,
      });

      if (process.env.NODE_ENV === 'prod') {
        const url: string = `https://fchat.mfry.io/resetpassword?token${forgotpasswordtoken}`;
        await this.mailService.sendMail(
          user.email!,
          'Reset your password',
          url,
          'reset-password',
        );
      }
    }

    return { message: 'Email to reset your password sent successfully' };
  }

  async resetPassword(resetpasswordDto: ResetpasswordDto) {
    const user = await this.usersRepository.findOne({
      where: {
        forgotpasswordtoken: resetpasswordDto.token,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.forgotpasswordused) {
      throw new BadRequestException('Token already used');
    }

    const password = await bcrypt.hash(resetpasswordDto.password, 10);

    await this.usersRepository.update(user.id, {
      forgotpasswordtoken: null,
      forgotpasswordused: true,
      password,
    });

    return { message: 'Password reset successfully' };
  }

  async generateToken(generateTokenDto: GenerateTokenDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: generateTokenDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email_verified) {
      throw new UnauthorizedException('Email already verified');
    }

    const expiredTime = new Date();
    expiredTime.setMinutes(expiredTime.getMinutes() + 10);

    const token = randomUUID();

    await this.usersRepository.update(user.id, {
      email_expiredtime: expiredTime,
      email_verified_token: token,
    });

    //if (process.env.NODE_ENV === 'prod') {
    const url: string = `https://fchat.mfry.io/verify/${token}`;
    await this.mailService.sendMail(
      user.email!,
      'Account verification',
      url,
      'verify-account',
    );
    //}

    return { message: 'Token generated successfully' };
  }
}
