import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: AuthRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
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
              .mockResolvedValue({ message: 'user logout successfully' }),
            refreshToken: jest
              .fn()
              .mockResolvedValue({ access_token: 'access_token' }),
            forgotPassword: jest.fn().mockResolvedValue({
              message: 'email for reset password sent successfully',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get<AuthRepository>(AuthRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should sign up a user', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        email: 'marshalfry1998@gmail.com',
        password: 'Marshal1998',
      };
      expect((await service.signup(authCredentialsDto)).message).toBe(
        'user signed up successfully',
      );
    });

    it('should trigger conflict exception', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        email: 'marshalfry1998@gmail.com',
        password: 'Marshal1998',
      };

      authRepository.signup = jest
        .fn()
        .mockRejectedValue(new ConflictException('email already existed'));

      await expect(service.signup(authCredentialsDto)).rejects.toThrow(
        'email already existed',
      );
    });

    it('should return a bad request exception', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        email: 'toto',
        password: '12345',
      };

      authRepository.signup = jest
        .fn()
        .mockRejectedValue(new BadRequestException('incorrect data values'));
      await expect(service.signup(authCredentialsDto)).rejects.toThrow(
        'incorrect data values',
      );
    });
  });

  describe('signin', () => {
    it('should sign in a user', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        email: 'marshalfry1998@gmail.com',
        password: 'Marshal1998',
      };
      expect((await service.signin(authCredentialsDto)).access_token).toBe(
        'access_token',
      );
      expect((await service.signin(authCredentialsDto)).refresh_token).toBe(
        'refresh_token',
      );
    });

    it('should trigger not found exception', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        email: 'marshalfry1998@gmail.com',
        password: 'Marshal1998',
      };

      authRepository.signin = jest
        .fn()
        .mockRejectedValue(new NotFoundException('user not found'));

      await expect(service.signin(authCredentialsDto)).rejects.toThrow(
        'user not found',
      );
    });

    it('should return a bad request exception', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        email: 'toto',
        password: '12345',
      };

      authRepository.signin = jest
        .fn()
        .mockRejectedValue(new BadRequestException('incorrect data values'));
      await expect(service.signin(authCredentialsDto)).rejects.toThrow(
        'incorrect data values',
      );
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      expect((await service.logout('toto')).message).toBe(
        'user logout successfully',
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh user token', async () => {
      expect(
        (await service.refreshToken({ refresh_token: 'toto' })).access_token,
      ).toBe('access_token');
    });

    it('should trigger unauthorized exception', async () => {
      authRepository.refreshToken = jest
        .fn()
        .mockRejectedValue(new UnauthorizedException('Invalid refresh token'));

      await expect(
        service.refreshToken({ refresh_token: 'toto' }),
      ).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('forgotPassword', () => {
    it('should forgot user password', async () => {
      expect(
        (await service.forgotPassword({ email: 'toto@gmail.com' })).message,
      ).toBe('email for reset password sent successfully');
    });

    it('should trigger bad request exception', async () => {
      authRepository.forgotPassword = jest
        .fn()
        .mockRejectedValue(new BadRequestException('invalid email'));

      await expect(service.forgotPassword({ email: 'toto' })).rejects.toThrow(
        'invalid email',
      );
    });
  });
});
