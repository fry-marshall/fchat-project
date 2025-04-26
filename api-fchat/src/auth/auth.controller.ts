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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create a user account' })
  @ApiBody({ type: SignupDto })
  @ApiCreatedResponse({
    description: 'Create a new account',
    schema: {
      example: {
        is_error: false,
        statusCode: 201,
        data: {
          message: 'User created successfully',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        is_error: true,
        statusCode: 400,
        message: 'Invalid input data',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Email user already exist',
    schema: {
      example: {
        is_error: true,
        statusCode: 409,
        message: 'Email already exists',
      },
    },
  })
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @ApiOperation({ summary: 'Authenticate the user account' })
  @ApiBody({ type: SigninDto })
  @ApiResponse({
    status: 200,
    description: 'User founded and email validated',
    schema: {
      example: {
        is_error: false,
        status: 200,
        data: { access_token: 'access_token', refresh_token: 'refresh_token' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        is_error: true,
        statusCode: 400,
        message: 'Invalid input data',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User account not found',
    schema: {
      example: {
        is_error: true,
        statusCode: 404,
        message: 'user not found',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Email user is not verified',
    schema: {
      example: {
        is_error: true,
        statusCode: 401,
        message: 'email is not verified',
      },
    },
  })
  @HttpCode(200)
  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @ApiOperation({ summary: 'Log out a user' })
  @ApiBody({ type: LogoutDto })
  @ApiResponse({
    status: 200,
    description: 'User logged out',
    schema: {
      example: {
        is_error: false,
        status: 200,
        data: {
          message: 'User logged out successfully',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        is_error: true,
        statusCode: 400,
        message: 'Invalid input data',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User account not found',
    schema: {
      example: {
        is_error: true,
        statusCode: 404,
        message: 'user not found',
      },
    },
  })
  @HttpCode(200)
  @Post('logout')
  logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }

  @ApiOperation({ summary: 'Refresh user token when invalid access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'User token refreshed successfully',
    schema: {
      example: {
        is_error: false,
        status: 200,
        data: {
          access_token: 'access_token',
          refresh_token: 'refresh_token',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        is_error: true,
        statusCode: 400,
        message: 'Invalid input data',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User account not found',
    schema: {
      example: {
        is_error: true,
        statusCode: 404,
        message: 'user not found',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token is invalid',
    schema: {
      example: {
        is_error: true,
        statusCode: 401,
        message: 'Invalid refresh token',
      },
    },
  })
  @HttpCode(200)
  @Post('refresh')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @ApiOperation({ summary: 'Verify email user' })
  @ApiBody({ type: VerifyDto })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    schema: {
      example: {
        is_error: false,
        status: 200,
        data: {
          message: 'Email verified successfully',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        is_error: true,
        statusCode: 400,
        message: 'Invalid input data',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User account not found',
    schema: {
      example: {
        is_error: true,
        statusCode: 404,
        message: 'user not found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Verification code expired',
    schema: {
      example: {
        is_error: true,
        statusCode: 400,
        message: 'Verification code expired',
      },
    },
  })
  @HttpCode(200)
  @Post('verify')
  verify(@Body() verifyDto: VerifyDto) {
    return this.authService.verify(verifyDto);
  }

  @ApiOperation({ summary: 'Forgot user password' })
  @ApiBody({ type: ForgotpasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Forgot password sent successfully',
    schema: {
      example: {
        is_error: false,
        status: 200,
        data: {
          message: 'Email to reset your password sent successfully',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        is_error: true,
        statusCode: 400,
        message: 'Invalid input data',
      },
    },
  })
  @HttpCode(200)
  @Post('forgotpassword')
  forgotPassword(@Body() forgotpasswordDto: ForgotpasswordDto) {
    return this.authService.forgotPassword(forgotpasswordDto);
  }

  @ApiOperation({ summary: 'Reset user password' })
  @ApiBody({ type: ResetpasswordDto })
  @ApiResponse({
    status: 200,
    description: 'User password reset successfully',
    schema: {
      example: {
        is_error: false,
        status: 200,
        data: {
          message: 'Email to reset your password sent successfully',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        is_error: true,
        statusCode: 400,
        message: 'Invalid input data',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Token already used',
    schema: {
      example: {
        is_error: true,
        statusCode: 400,
        message: 'Token already used',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      example: {
        is_error: true,
        statusCode: 404,
        message: 'User not found',
      },
    },
  })
  @HttpCode(200)
  @Post('resetpassword')
  resetPassword(@Body() resetpasswordDto: ResetpasswordDto) {
    return this.authService.resetPassword(resetpasswordDto);
  }

  @ApiOperation({ summary: 'Generate email verification token' })
  @ApiBody({ type: GenerateTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token generated successfully',
    schema: {
      example: {
        is_error: false,
        status: 200,
        data: {
          message: 'Token generated successfully',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        is_error: true,
        statusCode: 400,
        message: 'Invalid input data',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Email already verified',
    schema: {
      example: {
        is_error: true,
        statusCode: 401,
        message: 'Email already verified',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      example: {
        is_error: true,
        statusCode: 404,
        message: 'User not found',
      },
    },
  })
  @HttpCode(200)
  @Post('generatetoken')
  generateToken(@Body() generateTokenDto: GenerateTokenDto) {
    return this.authService.generateToken(generateTokenDto);
  }
}
