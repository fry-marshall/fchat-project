import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyDto } from './dto/verify.dto';
import { ForgotpasswordDto } from './dto/forgotpassword.dto';
import { ResetpasswordDto } from './dto/resetpassword';
import { GenerateTokenDto } from './dto/generatetoken.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @HttpCode(200)
  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @HttpCode(200)
  @Post('logout')
  logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }

  @HttpCode(200)
  @Post('refresh')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @HttpCode(200)
  @Post('verify')
  verify(@Body() verifyDto: VerifyDto) {
    return this.authService.verify(verifyDto);
  }

  @HttpCode(200)
  @Post('forgotpassword')
  forgotPassword(@Body() forgotpasswordDto: ForgotpasswordDto) {
    return this.authService.forgotPassword(forgotpasswordDto);
  }

  @HttpCode(200)
  @Post('resetpassword')
  resetPassword(@Body() resetpasswordDto: ResetpasswordDto) {
    return this.authService.resetPassword(resetpasswordDto);
  }

  @HttpCode(200)
  @Post('generatetoken')
  generateToken(@Body() generateTokenDto: GenerateTokenDto) {
    return this.authService.generateToken(generateTokenDto);
  }
}
