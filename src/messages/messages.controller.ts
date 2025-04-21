import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ReadMessageDto } from './dto/read-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getUserMessages(@Request() req) {
    return this.messagesService.getUserMessages(req.user.id);
  }

  @Post('/send')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  sendMessage(@Request() req, @Body() sendMessageDto: SendMessageDto) {
    return this.messagesService.sendMessage(req.user.id, sendMessageDto);
  }

  @Put('/send')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  readMessage(@Request() req, @Body() readMessageDto: ReadMessageDto) {
    return this.messagesService.readMessage(req.user.id, readMessageDto);
  }
}
