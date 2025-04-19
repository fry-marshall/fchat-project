/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UsersService } from './users.service';

class DynamicMockJwtAuthGuard implements CanActivate {
  static allow = true;
  static user = { id: 'default-user' };

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = DynamicMockJwtAuthGuard.user;
    return DynamicMockJwtAuthGuard.allow;
  }
}

describe('UsersController', () => {
  let controller: UsersController;
  let app: INestApplication;

  const mockUsersService = {
    getProfile: jest.fn(),
    getUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(DynamicMockJwtAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/users/me', () => {
    describe('failure cases', () => {
      it('should return Forbiden exception', async () => {
        DynamicMockJwtAuthGuard.allow = false;
        await request(app.getHttpServer()).get('/users/me').expect(403);
      });
    });

    describe('success cases', () => {
      it('should return 200 for user infos', async () => {
        const mockUser = {
          id: 'toto',
          fullname: 'Marshall FRY',
          description: "I'm a chill guy :)",
        };
        DynamicMockJwtAuthGuard.allow = true;
        DynamicMockJwtAuthGuard.user = { id: 'toto' };
        mockUsersService.getProfile.mockResolvedValue(mockUser);
        const res = await request(app.getHttpServer()).get('/users/me');

        expect(res.body.id).toBe(mockUser.id);
        expect(res.body.fullname).toBe(mockUser.fullname);
        expect(res.body.description).toBe(mockUser.description);
        expect(res.status).toBe(200);
      });
    });
  });

  describe('/users', () => {
    describe('failure cases', () => {
      it('should return Forbiden exception', async () => {
        DynamicMockJwtAuthGuard.allow = false;
        await request(app.getHttpServer()).get('/users').expect(403);
      });
    });

    describe('success cases', () => {
      it('should return 200 for users infos', async () => {
        const mockUsers = [
          {
            id: 'toto',
            fullname: 'Marshall FRY',
            description: "I'm a chill guy :)",
          },
          {
            id: 'tata',
            fullname: 'Marshall FRY',
            description: "I'm a chill guy :)",
          },
        ];
        DynamicMockJwtAuthGuard.allow = true;
        DynamicMockJwtAuthGuard.user = { id: 'toto' };
        mockUsersService.getUsers.mockResolvedValue(mockUsers);
        const res = await request(app.getHttpServer()).get('/users');

        expect(res.body.length).toBe(mockUsers.length);
        expect(res.body[0].fullname).toBe(mockUsers[0].fullname);
        expect(res.body[0].description).toBe(mockUsers[0].description);
        expect(res.status).toBe(200);
      });
    });
  });
});
