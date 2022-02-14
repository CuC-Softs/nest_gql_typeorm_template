import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAllUsers(limit?: number, offset = 1): Promise<User[]> {
    const users = limit
      ? this.userRepository.find({ take: limit, skip: offset - 1 })
      : await this.userRepository.find();
    return users;
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async createUser(data: CreateUserInput): Promise<User> {
    let exists = false;
    try {
      const userExists = await this.findUserByEmail(data.email);
      exists = !!userExists;
    } catch (err) {}
    if (exists) {
      throw new BadRequestException(
        `the user with email: ${data.email} already exists`,
      );
    }
    const user = this.userRepository.create(data);
    const saved = await this.userRepository.save(user);
    if (!saved) {
      throw new InternalServerErrorException('fail to create user');
    }
    return saved;
  }

  async updateUser(id: number, data: UpdateUserInput) {
    const user = await this.findUserById(id);
    const updatedUser = await this.userRepository.save(
      Object.assign(user, data),
    );
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findUserById(id);
    const deleted = await this.userRepository.delete(user.id);
    if (!deleted) {
      throw new InternalServerErrorException(
        'cannot delete the user: ' + user.name,
      );
    }
  }
}
