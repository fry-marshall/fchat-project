import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Put('/me')
  @UseInterceptors(FileInterceptor('profile_img'))
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile()
    img: Express.Multer.File,
  ) {
    if (img) {
      if (!img.mimetype.startsWith('image/')) {
        throw new BadRequestException('File must be an image');
      }

      if (img.size > 10 * 1024 * 1024) {
        throw new BadRequestException('File size must be less than 10MB');
      }

      updateUserDto.profile_img = img;
    }
    return this.usersService.updateUser(req.user.id, updateUserDto);
  }
}
