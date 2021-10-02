import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '../common/helpers/mockFactory';
import { Repository } from 'typeorm';
import { FactoryModule } from 'typeorm-factories';
import { User } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let mockRepository: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FactoryModule],
      providers: [
        UserService,
        UserResolver,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    mockRepository = module.get(getRepositoryToken(User));
    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
