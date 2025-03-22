import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signup(authCredentialsDto);
  }

  @Post('signin')
  @HttpCode(200)
  signin(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signin(authCredentialsDto);
  }

  @Post('refresh')
  @HttpCode(200)
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  logout(@Req() req) {
    return this.authService.logout(req.user.id);
  }
}
