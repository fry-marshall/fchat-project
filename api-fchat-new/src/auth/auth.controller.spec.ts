import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import {
  BadRequestException,
  ConflictException,
  INestApplication,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ResetPasswordDto } from './dto/forgot-password-dto';

describe('AuthController', () => {
  let controller: AuthController;
  let app: INestApplication;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        JwtService,
        JwtStrategy,
        {
          provide: AuthService,
          useValue: {
            signup: jest
              .fn()
              .mockResolvedValue({ message: 'user signed up successfully' }),
            signin: jest.fn().mockResolvedValue({
              access_token: 'access_token',
              refresh_token: 'refresh_token',
            }),
            logout: jest
              .fn()
              .mockResolvedValue({ message: 'user logged out successfully' }),
            refreshToken: jest
              .fn()
              .mockResolvedValue({ access_token: 'access_token' }),
            forgotPassword: jest.fn().mockResolvedValue({
              message: 'email for reset password sent successfully',
            }),
            resetPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    app = module.createNestApplication();
    await app.init();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    describe('success cases', () => {
      it('should sign up a user', async () => {
        const authCredentialsDto: AuthCredentialsDto = {
          email: 'marshalfry1998@gmail.com',
          password: 'Marshal1998',
        };

        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(authCredentialsDto)
          .expect(201);

        expect(response.body.message).toBe('user signed up successfully');
        expect(authService.signup).toHaveBeenCalledWith(authCredentialsDto);
      });
    });

    describe('error cases', () => {
      it('should return a bad request exception due to incorrect dto', async () => {
        const authCredentialsDto: AuthCredentialsDto = {
          email: 'marshal',
          password: '12345567',
        };

        authService.signup = jest
          .fn()
          .mockRejectedValue(new BadRequestException());

        await request(app.getHttpServer())
          .post('/auth/signup')
          .send(authCredentialsDto)
          .expect(400);
      });

      it('should return a conflict exception due to email already existed', async () => {
        const authCredentialsDto: AuthCredentialsDto = {
          email: 'marshalfry1998@gmail.com',
          password: 'Marshal1998',
        };

        authService.signup = jest
          .fn()
          .mockRejectedValue(new ConflictException('email already existed'));

        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(authCredentialsDto)
          .expect(409);

        expect(response.body.message).toBe('email already existed');
      });
    });
  });

  describe('signin', () => {
    describe('success cases', () => {
      it('should sign in a user', async () => {
        const authCredentialsDto: AuthCredentialsDto = {
          email: 'marshalfry1998@gmail.com',
          password: 'Marshal1998',
        };

        const response = await request(app.getHttpServer())
          .post('/auth/signin')
          .send(authCredentialsDto)
          .expect(201);

        expect(response.body.access_token).toBe('access_token');
        expect(response.body.refresh_token).toBe('refresh_token');
        expect(authService.signin).toHaveBeenCalledWith(authCredentialsDto);
      });
    });

    describe('error cases', () => {
      it('should return a bad request exception due to incorrect dto', async () => {
        const authCredentialsDto: AuthCredentialsDto = {
          email: 'marshal',
          password: '12345567',
        };

        authService.signin = jest
          .fn()
          .mockRejectedValue(new BadRequestException());

        await request(app.getHttpServer())
          .post('/auth/signin')
          .send(authCredentialsDto)
          .expect(400);
      });

      it('should return a not found exception due to invalid email or password', async () => {
        const authCredentialsDto: AuthCredentialsDto = {
          email: 'marshalfry1998@gmail.com',
          password: 'Marshal1998@',
        };

        authService.signin = jest
          .fn()
          .mockRejectedValue(
            new NotFoundException('email or password invalid'),
          );

        const response = await request(app.getHttpServer())
          .post('/auth/signin')
          .send(authCredentialsDto)
          .expect(404);

        expect(response.body.message).toBe('email or password invalid');
      });
    });
  });

  describe('logout', () => {
    describe('success cases', () => {
      it('should logout a user', async () => {
        const token: string = jwtService.sign(
          { id: 'toto', email: 'toto@gmail.com' },
          {
            secret: process.env.ACCESS_TOKEN_SECRET ?? 'access_token',
            expiresIn: '10m',
          },
        );

        const response = await request(app.getHttpServer())
          .post('/auth/logout')
          .set('Authorization', `Bearer ${token}`)
          .expect(201);

        expect(response.body.message).toBe('user logged out successfully');
      });
    });

    describe('error cases', () => {
      it('should return an unauthorize exception', async () => {
        const token: string = jwtService.sign(
          { id: 'toto', email: 'toto@gmail.com' },
          {
            secret: process.env.ACCESS_TOKEN_SECRET ?? 'access_token',
            expiresIn: '10m',
          },
        );

        authService.logout = jest
          .fn()
          .mockRejectedValue(new UnauthorizedException());

        await request(app.getHttpServer())
          .post('/auth/logout')
          .set('Authorization', `Bearer ${token}toto`)
          .expect(401);
      });
    });
  });

  describe('refreshToken', () => {
    describe('success cases', () => {
      it('should refresh token user', async () => {
        const token: string = jwtService.sign(
          { id: 'toto', email: 'toto@gmail.com' },
          {
            secret: process.env.REFRESH_TOKEN_SECRET ?? 'refresh_token',
            expiresIn: '7d',
          },
        );

        const response = await request(app.getHttpServer())
          .post('/auth/refresh')
          .send({ refresh_token: token })
          .expect(201);

        expect(response.body.access_token).toBe('access_token');
      });
    });

    describe('error cases', () => {
      it('should return an unauthorize exception', async () => {
        const token: string = jwtService.sign(
          { id: 'toto', email: 'toto@gmail.com' },
          {
            secret: process.env.REFRESH_TOKEN_SECRET ?? 'refresh_token',
            expiresIn: '7d',
          },
        );

        authService.refreshToken = jest
          .fn()
          .mockRejectedValue(new UnauthorizedException());

        await request(app.getHttpServer())
          .post('/auth/refresh')
          .send({ refresh_token: `${token}toto` })
          .expect(401);
      });
    });
  });

  describe('forgotpassword', () => {
    describe('success cases', () => {
      it('should return 200 for forgetting password', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/forgotpassword')
          .send({ email: 'toto@gmail.com' })
          .expect(200);

        expect(response.body.message).toBe(
          'email for reset password sent successfully',
        );
      });
    });

    describe('error cases', () => {
      it('should return bad request exception for missing email', async () => {
        authService.forgotPassword = jest
          .fn()
          .mockRejectedValue(new BadRequestException());

        await request(app.getHttpServer())
          .post('/auth/forgotpassword')
          .expect(400);
      });

      it('should return bad request exception for wrong email', async () => {
        authService.forgotPassword = jest
          .fn()
          .mockRejectedValue(new BadRequestException());

        await request(app.getHttpServer())
          .post('/auth/forgotpassword')
          .send({ email: 'toto' })
          .expect(400);
      });
    });
  });

  describe('resetpassword', () => {
    describe('success cases', () => {
      it('should reset password successfully', async () => {
        const resetPasswordDto: ResetPasswordDto = {
          token: 'valid-token',
          password: 'newPassword123',
        };

        authService.resetPassword = jest.fn().mockResolvedValue({
          message: 'Password reset successfully',
        });

        return request(app.getHttpServer())
          .post('/auth/resetpassword')
          .send(resetPasswordDto)
          .expect(200)
          .expect({
            message: 'Password reset successfully',
          });
      });
    });

    describe('error cases', () => {
      it('should return Unauthorized if token is invalid', async () => {
        const resetPasswordDto: ResetPasswordDto = {
          token: 'invalid-token',
          password: 'newPassword123',
        };

        authService.resetPassword = jest
          .fn()
          .mockRejectedValue(new UnauthorizedException('Invalid token'));

        return request(app.getHttpServer())
          .post('/auth/resetpassword')
          .send(resetPasswordDto)
          .expect(401)
          .expect({
            message: 'Invalid token',
            error: 'Unauthorized',
            statusCode: 401,
          });
      });

      it('should return NotFound if user not found for the token', async () => {
        const resetPasswordDto: ResetPasswordDto = {
          token: 'valid-token-but-no-user',
          password: 'newPassword123',
        };

        authService.resetPassword = jest
          .fn()
          .mockRejectedValue(new NotFoundException('User not found'));

        return request(app.getHttpServer())
          .post('/auth/resetpassword')
          .send(resetPasswordDto)
          .expect(404)
          .expect({
            message: 'User not found',
            error: 'Not Found',
            statusCode: 404,
          });
      });

      it('should return 400 if newPassword is too weak', async () => {
        const resetPasswordDto: ResetPasswordDto = {
          token: 'valid-token',
          password: '123',
        };

        authService.resetPassword = jest
          .fn()
          .mockRejectedValue(new BadRequestException('Password is too weak'));

        return request(app.getHttpServer())
          .post('/auth/resetpassword')
          .send(resetPasswordDto)
          .expect(400)
          .expect({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Password is too weak',
          });
      });
    });
  });
});
