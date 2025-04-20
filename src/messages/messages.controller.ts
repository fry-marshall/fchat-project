import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getUserMessages(@Request() req) {
    return this.messagesService.getUserMessages(req.user.id);
  }
}
