import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { RefreshTokenDto } from './dto/refresh-token-dto';

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockAccessToken'),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    authRepository = module.get<AuthRepository>(AuthRepository);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('should successfully sign up a user', async () => {
      const dto: AuthCredentialsDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const mockUser = {
        id: '123',
        email: dto.email,
        password: 'hashedPassword',
      };

      jest.spyOn(bcrypt, 'genSaltSync').mockReturnValue('salt');
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(mockUser.password);
      userRepository.create = jest.fn().mockReturnValue(mockUser);
      userRepository.save = jest.fn().mockResolvedValue(mockUser);

      const result = await authRepository.signup(dto);

      expect(userRepository.create).toHaveBeenCalledWith({
        email: dto.email,
        password: 'hashedPassword',
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ message: 'user signed up successfully' });
    });

    it('should throw ConflictException when email already exists', async () => {
      const dto: AuthCredentialsDto = {
        email: 'test@example.com',
        password: 'password',
      };
      userRepository.save = jest.fn().mockRejectedValue({ code: '23505' });

      await expect(authRepository.signup(dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('signin', () => {
    it('should successfully sign in a user', async () => {
      const dto: AuthCredentialsDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const mockUser = {
        id: '123',
        email: dto.email,
        password: 'hashedPassword',
        refresh_token: null,
      };

      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      const result = await authRepository.signin(dto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(result).toHaveProperty('access_token', 'mockAccessToken');
      expect(result).toHaveProperty('refresh_token', 'mockAccessToken');
    });

    it('should throw NotFoundException if user does not exist or password is incorrect', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        authRepository.signin({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('refreshToken', () => {
    it('should return a new access token when refresh token is valid', async () => {
      const dto: RefreshTokenDto = { refresh_token: 'validToken' };
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        refresh_token: 'hashedToken',
      };

      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedToken');
      jwtService.verify = jest
        .fn()
        .mockReturnValue({ id: mockUser.id, email: mockUser.email });
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      const result = await authRepository.refreshToken(dto);

      expect(jwtService.verify).toHaveBeenCalledWith(dto.refresh_token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toHaveProperty('access_token', 'mockAccessToken');
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      jwtService.verify = jest.fn().mockImplementation(() => {
        throw new UnauthorizedException();
      });

      await expect(
        authRepository.refreshToken({ refresh_token: 'invalidToken' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      jwtService.verify = jest
        .fn()
        .mockReturnValue({ id: '123', email: 'test@example.com' });
      userRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        authRepository.refreshToken({ refresh_token: 'validToken' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when refresh tokens do not match', async () => {
      const dto: RefreshTokenDto = { refresh_token: 'validToken' };
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        refresh_token: 'differentHash',
      };

      jwtService.verify = jest
        .fn()
        .mockReturnValue({ id: mockUser.id, email: mockUser.email });
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      await expect(authRepository.refreshToken(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should successfully log out a user', async () => {
      userRepository.update = jest.fn().mockResolvedValue({ affected: 1 });

      const result = await authRepository.logout('123');

      expect(userRepository.update).toHaveBeenCalledWith('123', {
        refresh_token: null,
      });
      expect(result).toEqual({ message: 'user logout successfully' });
    });
  });
});
