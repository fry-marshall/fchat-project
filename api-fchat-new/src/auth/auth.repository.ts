import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token-dto';

@Injectable()
export class AuthRepository {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(authCredentialsDto: AuthCredentialsDto) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const passwordHashed = bcrypt.hashSync(authCredentialsDto.password, salt);
      const user = this.userRepository.create({
        email: authCredentialsDto.email,
        password: passwordHashed,
      });

      await this.userRepository.save(user);
      return { message: 'user signed up successfully' };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('email already existed');
      }
      throw error;
    }
  }

  async signin(authCredentialsDto: AuthCredentialsDto) {
    const user = await this.userRepository.findOne({
      where: { email: authCredentialsDto.email },
    });

    if (
      user &&
      bcrypt.compareSync(authCredentialsDto.password, user.password ?? '')
    ) {
      const access_token = this.jwtService.sign(
        { id: user.id, email: user.email },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: '30m',
        },
      );
      const refresh_token = this.jwtService.sign(
        { id: user.id, email: user.email },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: '7d',
        },
      );

      const hashedRefreshToken = bcrypt.hashSync(refresh_token, 10);
      await this.userRepository.update(user.id, {
        refresh_token: hashedRefreshToken,
      });
      return { access_token, refresh_token };
    }

    throw new NotFoundException({ message: 'email or password are invalid' });
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refresh_token } = refreshTokenDto;

    const refreshTokenHashed = bcrypt.hashSync(refresh_token, 10);

    const payload: { id: string; email: string } = this.jwtService.verify(
      refresh_token,
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
      },
    );

    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });

    if (
      !user ||
      !bcrypt.compareSync(refreshTokenHashed, user.refresh_token ?? '')
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      access_token: this.jwtService.sign(
        { email: user.email, id: user.id },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: '30m',
        },
      ),
    };
  }

  async logout(user_id: string) {
    await this.userRepository.update(user_id, { refresh_token: null });
    return { message: 'user logout successfully' };
  }
}
