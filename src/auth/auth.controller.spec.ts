/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as request from 'supertest';
import {
  ConflictException,
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let app: INestApplication;
  const mockAuthService = {
    signup: jest.fn(),
    signin: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/signup', () => {
    describe('failure cases', () => {
      describe('dto errors', () => {
        it('should return a bad request exception empty body', async () => {
          const dto = {};

          await request(app.getHttpServer())
            .post('/auth/signup')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception missing email and password', async () => {
          const dto = {
            fullname: 'Marshall FRY',
          };

          await request(app.getHttpServer())
            .post('/auth/signup')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception fullname only spaces', async () => {
          const dto = {
            fullname: '   ',
            email: 'john@example.com',
            password: 'Password1',
          };

          await request(app.getHttpServer())
            .post('/auth/signup')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception fullname is a number', async () => {
          const dto = {
            fullname: 123,
            email: 'john@example.com',
            password: 'Password1',
          };

          await request(app.getHttpServer())
            .post('/auth/signup')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception email is missing', async () => {
          const dto = {
            fullname: '123',
            password: 'Password1',
          };

          await request(app.getHttpServer())
            .post('/auth/signup')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception email is not an email', async () => {
          const dto = {
            fullname: 'Jane Doe',
            email: 'not-an-email',
            password: 'Password1',
          };

          await request(app.getHttpServer())
            .post('/auth/signup')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception password is missing', async () => {
          const dto = {
            fullname: 'Jane Doe',
            email: 'jane@example.com',
          };

          await request(app.getHttpServer())
            .post('/auth/signup')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception password too short', async () => {
          const dto = {
            fullname: 'Jane Doe',
            email: 'jane@example.com',
            password: 'Ab1',
          };

          await request(app.getHttpServer())
            .post('/auth/signup')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception password without digits', async () => {
          const dto = {
            fullname: 'Jane Doe',
            email: 'jane@example.com',
            password: 'Password',
          };

          await request(app.getHttpServer())
            .post('/auth/signup')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception password without letters', async () => {
          const dto = {
            fullname: 'Jane Doe',
            email: 'jane@example.com',
            password: '12345678',
          };

          await request(app.getHttpServer())
            .post('/auth/signup')
            .send(dto)
            .expect(400);
        });
      });

      it('should return conflict exception for email already existed', async () => {
        const dto = {
          fullname: 'Jane Doe',
          email: 'jane@example.com',
          password: '12345678Ab',
        };

        mockAuthService.signup.mockRejectedValue(
          new ConflictException('email already existed'),
        );

        await request(app.getHttpServer())
          .post('/auth/signup')
          .send(dto)
          .expect(409);
      });
    });

    describe('success cases', () => {
      it('should return 201 for user created successfully', async () => {
        const dto = {
          fullname: 'Jane Doe',
          email: 'jane@example.com',
          password: '12455801HA',
        };

        mockAuthService.signup.mockResolvedValue({
          message: 'User created successfully',
        });

        await request(app.getHttpServer())
          .post('/auth/signup')
          .send(dto)
          .expect(201);
      });
    });
  });

  describe('/signin', () => {
    describe('failure cases', () => {
      describe('dto errors', () => {
        it('should return a bad request exception empty body', async () => {
          const dto = {};

          await request(app.getHttpServer())
            .post('/auth/signin')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception missing email', async () => {
          const dto = {
            password: '12345678ABC',
          };

          await request(app.getHttpServer())
            .post('/auth/signin')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception password is missing', async () => {
          const dto = {
            email: 'jane@example.com',
          };

          await request(app.getHttpServer())
            .post('/auth/signin')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception email is not an email', async () => {
          const dto = {
            email: 'not-an-email',
            password: 'Password1',
          };

          await request(app.getHttpServer())
            .post('/auth/signin')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception password too short', async () => {
          const dto = {
            email: 'jane@example.com',
            password: 'Ab1',
          };

          await request(app.getHttpServer())
            .post('/auth/signin')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception password without digits', async () => {
          const dto = {
            email: 'jane@example.com',
            password: 'Password',
          };

          await request(app.getHttpServer())
            .post('/auth/signin')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception password without letters', async () => {
          const dto = {
            email: 'jane@example.com',
            password: '12345678',
          };

          await request(app.getHttpServer())
            .post('/auth/signin')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception non authorized parameters', async () => {
          const dto = {
            email: 'jane@example.com',
            password: '12345678',
            toto: 'bonjour',
          };

          await request(app.getHttpServer())
            .post('/auth/signin')
            .send(dto)
            .expect(400);
        });
      });

      it("it should return 404 for email doesn't existed", async () => {
        const dto = {
          email: 'jane@example.com',
          password: '12345678ABC',
        };

        mockAuthService.signin.mockRejectedValue(
          new NotFoundException('User not found'),
        );

        await request(app.getHttpServer())
          .post('/auth/signin')
          .send(dto)
          .expect(404);
      });
    });

    describe('success cases', () => {
      it('should return 200 for user created successfully', async () => {
        const dto = {
          email: 'jane@example.com',
          password: '12455801HA',
        };

        mockAuthService.signin.mockResolvedValue({
          access_token: 'toto',
          refresh_token: 'tata',
        });

        const res = await request(app.getHttpServer())
          .post('/auth/signin')
          .send(dto);

        expect(res.body.access_token).toBe('toto');
        expect(res.body.refresh_token).toBe('tata');
        expect(res.status).toBe(200);
      });
    });
  });

  describe('/logout', () => {
    describe('failure cases', () => {
      describe('dto errors', () => {
        it('should return a bad request exception empty body', async () => {
          const dto = {};

          await request(app.getHttpServer())
            .post('/auth/logout')
            .send(dto)
            .expect(400);
        });

        it('should return a bad request exception non authorized parameters', async () => {
          const dto = {
            refresh_token: 'bonjourbonjourbonjourbonjour',
            toto: 'test',
          };

          await request(app.getHttpServer())
            .post('/auth/logout')
            .send(dto)
            .expect(400);
        });
      });

      it("it should return 404 for refresh token doesn't existed", async () => {
        const dto = {
          refresh_token: '12345678ABC',
        };

        mockAuthService.logout.mockRejectedValue(
          new NotFoundException('User not found'),
        );

        await request(app.getHttpServer())
          .post('/auth/logout')
          .send(dto)
          .expect(404);
      });
    });

    describe('success cases', () => {
      it('should return 200 for user logged out successfully', async () => {
        const dto = {
          refresh_token: '12455801HA',
        };

        mockAuthService.logout.mockResolvedValue({
          message: 'User logged out successfully',
        });

        const res = await request(app.getHttpServer())
          .post('/auth/logout')
          .send(dto);

        expect(res.body.message).toBe('User logged out successfully');
        expect(res.status).toBe(200);
      });
    });
  });
});
