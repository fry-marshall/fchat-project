/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as request from 'supertest';
import {
  ConflictException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let app: INestApplication;
  const mockAuthService = {
    signup: jest.fn(),
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
});
