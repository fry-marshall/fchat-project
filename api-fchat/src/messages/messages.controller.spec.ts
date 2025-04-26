import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import {
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { DynamicMockJwtAuthGuard } from '../users/users.controller.spec';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import * as request from 'supertest';
import { MessagesService } from './messages.service';
import { randomUUID } from 'crypto';

describe('MessagesController', () => {
  let controller: MessagesController;
  let app: INestApplication;

  const mockMessagesService = {
    getUserMessages: jest.fn(),
    sendMessage: jest.fn(),
    readMessage: jest.fn(),
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

  describe('/messages/send', () => {
    it('should return forbiden access', async () => {
      DynamicMockJwtAuthGuard.allow = false;

      await request(app.getHttpServer()).post('/messages/send').expect(403);
    });

    it('should return not found for receiver user', async () => {
      DynamicMockJwtAuthGuard.allow = true;
      DynamicMockJwtAuthGuard.user = { id: 'toto' };

      mockMessagesService.sendMessage.mockRejectedValue(
        new NotFoundException(''),
      );

      const dto = {
        user_id: randomUUID(),
        content: 'Bonjour',
      };

      const res = await request(app.getHttpServer())
        .post('/messages/send')
        .send(dto);
      expect(res.status).toBe(404);
    });

    it('should return 200 for message sent successfully', async () => {
      DynamicMockJwtAuthGuard.allow = true;
      DynamicMockJwtAuthGuard.user = { id: 'toto' };

      const conversation_id = randomUUID();
      const message_id = randomUUID();

      mockMessagesService.sendMessage.mockResolvedValue({
        message: 'Message sent successfully',
        conversation: {
          id: conversation_id,
          message: { id: message_id, date: new Date() },
        },
      });

      const dto = {
        user_id: randomUUID(),
        content: 'Bonjour',
      };

      const res = await request(app.getHttpServer())
        .post('/messages/send')
        .send(dto)
        .expect(201);

      expect(res.body.message).toBe('Message sent successfully');
      expect(res.body.conversation.id).toBe(conversation_id);
      expect(res.body.conversation.message.id).toBe(message_id);
    });
  });
});
