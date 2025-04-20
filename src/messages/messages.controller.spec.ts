import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DynamicMockJwtAuthGuard } from '../users/users.controller.spec';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import * as request from 'supertest';
import { MessagesService } from './messages.service';

describe('MessagesController', () => {
  let controller: MessagesController;
  let app: INestApplication;

  const mockMessagesService = {
    getUserMessages: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(DynamicMockJwtAuthGuard)
      .compile();

    controller = module.get<MessagesController>(MessagesController);
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

  describe('/messages/me', () => {
    it('should return forbiden access', async () => {
      DynamicMockJwtAuthGuard.allow = false;

      await request(app.getHttpServer()).get('/messages/me').expect(403);
    });

    it('should return all user messages', async () => {
      DynamicMockJwtAuthGuard.allow = true;
      DynamicMockJwtAuthGuard.user = { id: 'toto' };

      const mockConversations = [
        {
          id: 'toto',
          user1: {
            id: 'toto',
          },
          user2: {
            id: 'toto',
          },
          messages: [
            {
              id: 'toto',
              content: 'Bonjour',
              date: new Date(),
            },
            {
              id: 'toto',
              content: 'Bonjour',
              date: new Date(),
            },
            {
              id: 'toto',
              content: 'Bonjour',
              date: new Date(),
            },
          ],
        },
      ];

      mockMessagesService.getUserMessages.mockResolvedValue({
        conversations: mockConversations,
      });

      const res = await request(app.getHttpServer())
        .get('/messages/me')
        .expect(200);

      console.log(res.body);
      expect(res.body.conversations.length).toBe(mockConversations.length);
    });
  });
});
