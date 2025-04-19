import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from './users.entity';
import * as bcrypt from 'bcryptjs';
import { S3Service } from '../common/s3.service';

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
  hashSync: jest.fn(),
}));
describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockS3Service = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepository,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return the user info profile', async () => {
      const mockUser = {
        id: 'toto',
        fullname: 'Marshall FRY',
        description: "I'm a chill guy :)",
      };

      mockUsersRepository.findOne.mockResolvedValue(mockUser);
      const res = await service.getProfile('toto');
      expect(res?.id).toBe(mockUser.id);
      expect(res?.fullname).toBe(mockUser.fullname);
      expect(res?.description).toBe(mockUser.description);
    });
  });

  describe('getUsers', () => {
    it('should return the users info profile', async () => {
      const mockUsers = [
        {
          id: 'toto',
          fullname: 'Marshall FRY',
          description: "I'm a chill guy :)",
        },
        {
          id: 'tata',
          fullname: 'Marshall FRY',
          description: "I'm a chill guy :)",
        },
      ];

      mockUsersRepository.find.mockResolvedValue(mockUsers);
      const res = await service.getUsers();
      expect(res[0]?.id).toBe(mockUsers[0].id);
      expect(res[0]?.fullname).toBe(mockUsers[0].fullname);
      expect(res[0]?.description).toBe(mockUsers[0].description);
    });
  });

  describe('updateUser', () => {
    it('should return the user infos updated', async () => {
      const dto = {
        fullname: 'toto',
        description: "I'm a chill guy :)",
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUsersRepository.update.mockResolvedValue({});
      const res = await service.updateUser('toto', dto);
      expect(res.message).toBe('User infos udpated successfully');
      expect(res.user.fullname).toBe(dto.fullname);
      expect(res.user.description).toBe(dto.description);

      expect(mockUsersRepository.update).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.update).toHaveBeenCalledWith('toto', dto);
    });
  });

  describe('deleteUser', () => {
    it('should return the right message for user deleted', async () => {
      mockUsersRepository.delete.mockResolvedValue({});
      const res = await service.deleteUser('toto');
      expect(res.message).toBe('User deleted successfully');

      expect(mockUsersRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.delete).toHaveBeenCalledWith('toto');
    });
  });
});
