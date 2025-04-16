import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../users/users.entity';
import { MailService } from '../common/mail.service';
import { ConflictException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockMailService = {
    sendMail: jest.fn(),
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
});
