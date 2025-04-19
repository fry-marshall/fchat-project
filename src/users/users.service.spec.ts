import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from './users.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepository,
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
});
