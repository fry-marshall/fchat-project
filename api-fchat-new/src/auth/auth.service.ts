import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password-dto';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  signup(authCredentialsDto: AuthCredentialsDto) {
    return this.authRepository.signup(authCredentialsDto);
  }

  signin(authCredentialsDto: AuthCredentialsDto) {
    return this.authRepository.signin(authCredentialsDto);
  }

  refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.authRepository.refreshToken(refreshTokenDto);
  }

  logout(user_id: string) {
    return this.authRepository.logout(user_id);
  }

  forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return this.authRepository.forgotPassword(forgotPasswordDto);
  }

  resetPassword(resetPasswordDto: ResetPasswordDto) {
    return this.authRepository.resetPassword(resetPasswordDto);
  }
}
