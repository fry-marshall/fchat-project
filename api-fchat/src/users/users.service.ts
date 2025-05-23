import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Not, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { S3Service } from '../common/s3.service';
import { DeviceTokenDto } from './dto/device-token.dto';
import { Devicetokens } from './entities/devicetokens.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Devicetokens)
    private readonly devicetokensRepository: Repository<Devicetokens>,
    private s3Service: S3Service,
  ) { }

  async getProfile(id: string) {
    return await this.usersRepository.findOne({
      where: {
        id,
      },
      select: ['id', 'fullname', 'description', 'email', 'profile_img'],
    });
  }

  async getUsers(id: string) {
    return await this.usersRepository.find({
      where: {
        email_verified: true,
        id: Not(id),
      },
      select: ['id', 'fullname', 'description', 'email', 'profile_img'],
    });
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const updateData: Partial<Users> = {};

    if (updateUserDto.fullname) {
      updateData.fullname = updateUserDto.fullname;
    }

    if (updateUserDto.description) {
      updateData.description = updateUserDto.description;
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    if (updateUserDto.profile_img) {
      updateData.profile_img = await this.s3Service.uploadFile(
        updateUserDto.profile_img,
        'fchat',
      );
    }

    await this.usersRepository.update(userId, updateData);

    delete updateData.password;

    return {
      message: 'User infos udpated successfully',
      user: {
        ...updateData,
      },
    };
  }

  async deleteUser(userId: string) {
    await this.usersRepository.delete(userId);

    return { message: 'User deleted successfully' };
  }

  async addDeviceToken(userId: string, deviceTokenDto: DeviceTokenDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    const deviceTokenExisted = await this.devicetokensRepository.findOne({ where: { user: user! } });

    if (deviceTokenExisted) {
      await this.devicetokensRepository.update(deviceTokenExisted.id, {
        token: deviceTokenDto.device_token
      });
    }
    else {
      const deviceToken = this.devicetokensRepository.create({
        token: deviceTokenDto.device_token,
        user: user!,
      });
      await this.devicetokensRepository.save(deviceToken);
    }

    return { message: 'Device token setted' };
  }
}
