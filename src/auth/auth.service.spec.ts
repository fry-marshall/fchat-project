import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../users/users.entity';
import { MailService } from '../common/mail.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';

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
});
