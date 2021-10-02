import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '../common/helpers/mockFactory';
import { Repository } from 'typeorm';
import { FactoryModule } from 'typeorm-factories';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FactoryModule],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
          useValue: mockRepository,
        },
      ],
    }).compile();
    mockRepository = module.get(getRepositoryToken(User));
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when finding all users', () => {
    it('should list all users', async () => {
      const mockUser = new User();
      mockUser.email = 'test@example.com';
      mockUser.name = 'test';
      mockUser.id = '1';
      mockRepository.find.mockReturnValue([mockUser, mockUser]);
      const users = await service.findAllUsers();
      expect(users).toHaveLength(2);
    });
  });

  describe('when create user', () => {
    it('should create a new user with valid data', async () => {
      const mockUser = new User();
      mockUser.email = 'test@example.com';
      mockUser.name = 'test';
      mockUser.id = '1';
      mockRepository.save.mockReturnValue(mockUser);
      mockRepository.findOne.mockReturnValue(null);
      const user = await service.createUser({
        email: 'test@example.com',
        name: 'test',
        password: '12345678',
      });
      expect(user).toMatchObject({
        email: 'test@example.com',
        name: 'test',
      });
    });
    it('should throw an error if an user with de given email aready exists', async () => {
      const mockUser = new User();
      mockUser.email = 'test@example.com';
      mockUser.name = 'test';
      mockUser.id = '1';
      mockRepository.save.mockReturnValue(mockUser);
      mockRepository.findOne.mockReturnValue(mockUser);
      await service
        .createUser({
          email: 'test@example.com',
          name: 'test',
          password: '12345678',
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(BadRequestException);
          expect(e).toMatchObject({
            message: `the user with email:${mockUser.email} already exists`,
          });
        });
    });
    it('should throw an error if the storing fails', async () => {
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.save.mockReturnValue(null);
      await service
        .createUser({
          email: 'test@example.com',
          name: 'test',
          password: '12345678',
        })
        .catch((err) => {
          expect(err).toBeInstanceOf(InternalServerErrorException);
          expect(err).toMatchObject({
            message: `Failed to create user`,
          });
        });
    });
  });

  describe('when update user', () => {
    it('should update the selected user data with de given new data', async () => {
      const mockUser = new User();
      mockUser.email = 'test@example.com';
      mockUser.name = 'test';
      mockUser.id = '1';
      mockRepository.findOne.mockReturnValue(mockUser);
      mockRepository.save.mockReturnValue({
        email: 'test@example.com',
        name: 'testando',
      });
      const user = await service.updateUser('1', { name: 'testando' });
      expect(user.name).toBe('testando');
    });
  });

  describe('when finding user by id', () => {
    it('should return the user by id', async () => {
      const mockUser = new User();
      mockUser.email = 'test@example.com';
      mockUser.name = 'test';
      mockUser.id = '1';
      mockRepository.findOne.mockReturnValue(mockUser);
      const user = await service.findUserById('1');
      expect(user.id).toBe('1');
      expect(user).toBeInstanceOf(User);
    });
    it('should return an error if the user with de given id does not exist', async () => {
      mockRepository.findOne.mockReturnValue(null);
      await service.findUserById('1').catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toMatchObject({ message: 'user not found' });
      });
    });
  });

  describe('when deleting a new user', () => {
    it("should don't throw an error while finding user", async () => {
      const mockUser = new User();
      mockUser.email = 'test@example.com';
      mockUser.name = 'test';
      mockUser.id = '1';
      mockRepository.findOne.mockReturnValue(mockUser);
      await service.deleteUser(mockUser.id);
    });
    it('should throw an error if cannot delete the user', async () => {
      const mockUser = new User();
      mockUser.email = 'test@example.com';
      mockUser.name = 'test';
      mockUser.id = '1';
      mockRepository.findOne.mockReturnValue(mockUser);
      mockRepository.delete.mockReturnValue(null);
      await service.deleteUser('1').catch((err) => {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err).toMatchObject({
          message: 'cannot delete the user: ' + mockUser.name,
        });
      });
    });
  });
});
