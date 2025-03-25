/* eslint-disable @typescript-eslint/unbound-method */
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
import { ResetPasswordDto } from './dto/forgot-password-dto';

describe('AuthService', () => {
  let authService: AuthService;
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
            resetPassword: jest
              .fn()
              .mockResolvedValue({ message: 'Password reset successfully' }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authRepository = module.get<AuthRepository>(AuthRepository);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should sign up a user', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        email: 'marshalfry1998@gmail.com',
        password: 'Marshal1998',
      };
      expect((await authService.signup(authCredentialsDto)).message).toBe(
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

      await expect(authService.signup(authCredentialsDto)).rejects.toThrow(
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
      await expect(authService.signup(authCredentialsDto)).rejects.toThrow(
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
      expect((await authService.signin(authCredentialsDto)).access_token).toBe(
        'access_token',
      );
      expect((await authService.signin(authCredentialsDto)).refresh_token).toBe(
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

      await expect(authService.signin(authCredentialsDto)).rejects.toThrow(
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
      await expect(authService.signin(authCredentialsDto)).rejects.toThrow(
        'incorrect data values',
      );
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      expect((await authService.logout('toto')).message).toBe(
        'user logout successfully',
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh user token', async () => {
      expect(
        (await authService.refreshToken({ refresh_token: 'toto' }))
          .access_token,
      ).toBe('access_token');
    });

    it('should trigger unauthorized exception', async () => {
      authRepository.refreshToken = jest
        .fn()
        .mockRejectedValue(new UnauthorizedException('Invalid refresh token'));

      await expect(
        authService.refreshToken({ refresh_token: 'toto' }),
      ).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('forgotPassword', () => {
    it('should forgot user password', async () => {
      expect(
        (await authService.forgotPassword({ email: 'toto@gmail.com' })).message,
      ).toBe('email for reset password sent successfully');
    });

    it('should trigger bad request exception', async () => {
      authRepository.forgotPassword = jest
        .fn()
        .mockRejectedValue(new BadRequestException('invalid email'));

      await expect(
        authService.forgotPassword({ email: 'toto' }),
      ).rejects.toThrow('invalid email');
    });
  });

  describe('resetpassword', () => {
    describe('success cases', () => {
      it('should return success message when resetPassword is called with a valid token', async () => {
        const resetPasswordDto: ResetPasswordDto = {
          token: 'valid-token',
          password: 'newPassword123',
        };

        const result = await authService.resetPassword(resetPasswordDto);

        expect(result).toEqual({ message: 'Password reset successfully' });
        expect(authRepository.resetPassword).toHaveBeenCalledWith(
          resetPasswordDto,
        );
      });
    });

    describe('failure cases', () => {
      it('should throw an error when the token is invalid', async () => {
        const resetPasswordDto: ResetPasswordDto = {
          token: 'invalid-token',
          password: 'newPassword123',
        };

        authRepository.resetPassword = jest
          .fn()
          .mockRejectedValue(new NotFoundException('Invalid token'));

        await expect(
          authService.resetPassword(resetPasswordDto),
        ).rejects.toThrow(new NotFoundException('Invalid token'));
      });

      it('should throw an error when no token is provided', async () => {
        const resetPasswordDto: ResetPasswordDto = {
          token: '',
          password: 'newPassword123',
        };

        authRepository.resetPassword = jest
          .fn()
          .mockRejectedValue(new NotFoundException('Token is required'));

        await expect(
          authService.resetPassword(resetPasswordDto),
        ).rejects.toThrow(new BadRequestException('Token is required'));
      });

      it('should throw an error if the password is too weak', async () => {
        const resetPasswordDto: ResetPasswordDto = {
          token: 'valid-token',
          password: 'weak',
        };

        // Mock valid token, but weak password should fail validation
        authRepository.resetPassword = jest
          .fn()
          .mockRejectedValue(new BadRequestException('Password is too weak'));

        await expect(
          authService.resetPassword(resetPasswordDto),
        ).rejects.toThrow(new BadRequestException('Password is too weak'));
      });

      it('should throw an error if the user is not found with the provided token', async () => {
        const resetPasswordDto: ResetPasswordDto = {
          token: 'valid-token',
          password: 'newPassword123',
        };

        authRepository.resetPassword = jest
          .fn()
          .mockRejectedValue(new NotFoundException('User not found'));

        await expect(
          authService.resetPassword(resetPasswordDto),
        ).rejects.toThrow(new NotFoundException('User not found'));
      });

      it('should throw an error if there is an issue during password update', async () => {
        const resetPasswordDto: ResetPasswordDto = {
          token: 'valid-token',
          password: 'newPassword123',
        };

        // Simuler une erreur lors de la mise à jour du mot de passe
        authRepository.resetPassword = jest
          .fn()
          .mockRejectedValue(new Error('Failed to update password'));

        await expect(
          authService.resetPassword(resetPasswordDto),
        ).rejects.toThrow(new Error('Failed to update password'));
      });
    });
  });
});
