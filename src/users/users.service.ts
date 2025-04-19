import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getProfile(id: string) {
    return await this.usersRepository.findOne({
      where: {
        id,
      },
      select: ['id', 'fullname', 'description', 'email', 'profile_img'],
    });
  }

  async getUsers() {
    return await this.usersRepository.find({
      where: {
        email_verified: true,
      },
      select: ['id', 'fullname', 'description', 'email', 'profile_img'],
    });
  }
}
