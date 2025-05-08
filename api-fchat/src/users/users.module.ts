import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { S3Service } from '../common/s3.service';
import { Devicetokens } from './entities/devicetokens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Devicetokens])],
  controllers: [UsersController],
  providers: [UsersService, S3Service],
})
export class UsersModule {}
