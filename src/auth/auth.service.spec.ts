import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../users/users.entity';
import { MailService } from '../common/mail.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyDto } from './dto/verify.dto';
import { ForgotpasswordDto } from './dto/forgotpassword.dto';

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
  hashSync: jest.fn().mockReturnValue('hashedRefreshToken'),
}));

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersRepository = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
  };

  const mockMailService = {
    sendMail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepository,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    describe('failure cases', () => {
      it('should return conflict exception for email already exist', async () => {
        const signupDto: SignupDto = {
          fullname: 'Jane Doe',
          email: 'jane@example.com',
          password: 'JaneDoe98',
        };

        mockUsersRepository.save.mockRejectedValue(
          new ConflictException('Conflict'),
        );

        await expect(authService.signup(signupDto)).rejects.toThrow(
          new ConflictException(),
        );
      });
    });

    describe('success cases', () => {
      it('should return 201 for user created successfully', async () => {
        const signupDto: SignupDto = {
          fullname: 'Jane Doe',
          email: 'jane@example.com',
          password: 'JaneDoe98',
        };

        mockUsersRepository.save.mockResolvedValue({
          message: 'User created successfully',
        });

        const res = await authService.signup(signupDto);

        expect(res.message).toBe('User created successfully');
      });
    });
  });

  describe('signin', () => {
    describe('failure cases', () => {
      it('should return not found exception for email not exist', async () => {
        const signinDto: SigninDto = {
          email: 'jane@example.com',
          password: 'JaneDoe98',
        };

        mockUsersRepository.findOne.mockResolvedValue(null);

        await expect(authService.signin(signinDto)).rejects.toThrow(
          NotFoundException,
        );
      });

      it('should return not found exception for wrong password', async () => {
        const signinDto: SigninDto = {
          email: 'jane@example.com',
          password: 'JaneDoe98',
        };

        mockUsersRepository.findOne.mockResolvedValue({
          id: 'toto',
          fullname: 'Jane Doe',
        });

        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(authService.signin(signinDto)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('success cases', () => {
      it('should return access_token and refresh_token', async () => {
        const signinDto: SigninDto = {
          email: 'jane@example.com',
          password: 'JaneDoe98',
        };

        const mockUser = {
          id: 'toto',
          fullname: 'Jane Doe',
          email: 'jane@example.com',
          password: 'JaneDoe98',
        };

        mockUsersRepository.findOne.mockResolvedValue(mockUser);

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        mockJwtService.sign
          .mockReturnValueOnce('mockAccessToken')
          .mockReturnValueOnce('mockRefreshToken');

        const res = await authService.signin(signinDto);

        expect(res.access_token).toBe('mockAccessToken');
        expect(res.refresh_token).toBe('mockRefreshToken');
        expect(bcrypt.compare).toHaveBeenCalledWith(
          signinDto.password,
          signinDto.password,
        );
        expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('logout', () => {
    describe('failure cases', () => {
      it("should return not found exception for refresh token doesn't exist", async () => {
        const logoutDto: LogoutDto = {
          refresh_token: 'JaneDoe98',
        };

        mockUsersRepository.findOne.mockResolvedValue(null);

        await expect(authService.logout(logoutDto)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('success cases', () => {
      it('should return access_token and refresh_token', async () => {
        const logoutDto: LogoutDto = {
          refresh_token: 'JaneDoe98',
        };

        const mockUser = {
          id: 'toto',
          fullname: 'Jane Doe',
          email: 'jane@example.com',
          password: 'JaneDoe98',
        };

        mockUsersRepository.findOne.mockResolvedValue(mockUser);

        const res = await authService.logout(logoutDto);

        expect(res.message).toBe('User logged out successfully');
        expect(mockUsersRepository.update).toHaveBeenCalledWith(mockUser.id, {
          refresh_token: null,
        });
      });
    });
  });

  describe('refreshToken', () => {
    describe('failure cases', () => {
      it('should return not found exception for invalid refresh token', async () => {
        const refreshTokenDto: RefreshTokenDto = {
          refresh_token: 'JaneDoe98',
        };

        mockJwtService.verifyAsync.mockRejectedValue(null);

        await expect(authService.refreshToken(refreshTokenDto)).rejects.toThrow(
          UnauthorizedException,
        );
        expect(mockJwtService.verifyAsync).toHaveBeenCalledTimes(1);
      });

      it("should return not found exception for refresh token doesn't exist", async () => {
        const refreshTokenDto: RefreshTokenDto = {
          refresh_token: 'JaneDoe98',
        };

        mockJwtService.verifyAsync.mockResolvedValue('');
        mockUsersRepository.findOne.mockResolvedValue(null);

        await expect(authService.refreshToken(refreshTokenDto)).rejects.toThrow(
          NotFoundException,
        );
        expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
      });
    });

    describe('success cases', () => {
      it('should return access_token and refresh_token', async () => {
        const logoutDto: LogoutDto = {
          refresh_token: 'JaneDoe98',
        };

        const mockUser = {
          id: 'toto',
          fullname: 'Jane Doe',
          email: 'jane@example.com',
          password: 'JaneDoe98',
        };

        mockUsersRepository.findOne.mockResolvedValue(mockUser);

        const res = await authService.logout(logoutDto);

        expect(res.message).toBe('User logged out successfully');
        expect(mockUsersRepository.update).toHaveBeenCalledWith(mockUser.id, {
          refresh_token: null,
        });
      });
    });
  });

  describe('verify', () => {
    describe('failure cases', () => {
      it('should return not found exception for invalid token', async () => {
        const verifyDto: VerifyDto = {
          token: 'JaneDoe98',
        };

        mockUsersRepository.findOne.mockResolvedValueOnce(null);

        await expect(authService.verify(verifyDto)).rejects.toThrow(
          NotFoundException,
        );
        expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
      });

      it("should return not found exception for refresh token doesn't exist", async () => {
        const verifyDto: VerifyDto = {
          token: 'JaneDoe98',
        };

        const expiredTime = new Date();
        expiredTime.setMinutes(expiredTime.getMinutes() - 10);

        const mockUser = {
          id: 'toto',
          email: 'toto@example.com',
          email_expiredtime: expiredTime,
        };

        mockUsersRepository.findOne.mockResolvedValueOnce(mockUser);

        await expect(authService.verify(verifyDto)).rejects.toThrow(
          BadRequestException,
        );
        expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
      });
    });

    describe('success cases', () => {
      it('should return 200 for user email verified successfully', async () => {
        const verifyDto: VerifyDto = {
          token: 'JaneDoe98',
        };

        const expiredTime = new Date();
        expiredTime.setMinutes(expiredTime.getMinutes() + 5);

        const mockUser = {
          id: 'toto',
          fullname: 'Jane Doe',
          email: 'jane@example.com',
          email_expiredtime: expiredTime,
        };

        mockUsersRepository.findOne.mockResolvedValue(mockUser);

        const res = await authService.verify(verifyDto);

        expect(res.message).toBe('Email verified successfully');
        expect(mockUsersRepository.update).toHaveBeenCalledWith(mockUser.id, {
          email_verified: true,
        });
      });
    });
  });

  describe('forgotPassword', () => {
    describe('success cases', () => {
      it('should return 200 for sending reset password request successfully', async () => {
        const forgotpasswordDto: ForgotpasswordDto = {
          email: 'jade@example.com',
        };

        const mockUser = {
          id: 'toto',
          fullname: 'Jane Doe',
          email: 'jane@example.com',
        };

        mockUsersRepository.findOne.mockResolvedValue(mockUser);

        const res = await authService.forgotPassword(forgotpasswordDto);

        expect(res.message).toBe(
          'Email to reset your password sent successfully',
        );
        expect(mockUsersRepository.update).toHaveBeenCalledTimes(1);
      });
    });
  });
});
