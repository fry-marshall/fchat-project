import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [UserService, UserRepository],
  exports: [UserRepository]
})
export class UserModule {}
