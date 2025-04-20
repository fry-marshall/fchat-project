import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getUserMessages(@Request() req) {
    return this.messagesService.getUserMessages(req.user.id);
  }

  @Post('/send')
  @UseGuards(JwtAuthGuard)
  sendMessage(@Request() req, @Body() sendMessageDto: SendMessageDto) {
    return this.messagesService.sendMessage(req.user.id, sendMessageDto);
  }
}
