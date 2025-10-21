import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserReqDto } from './dto/request/create-user-req.dto';
import { UpdateUserReqDto } from './dto/request/update-user-req.dto';
import UserRepository from './repositories/user.repository';
import { In } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserReqDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);
    // Check if user already exists
    const existingUser = await this.userRepository.findByIdAddress(
      createUserDto.idAddress,
    );
    if (existingUser) {
      throw new ConflictException('User with this id already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    user.password = hashedPassword;
    return this.userRepository.save(user);
  }

  async findAll(
    page = 1,
    pageSize = 10,
  ): Promise<{
    items: UserEntity[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const [items, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserReqDto): Promise<UserEntity> {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  /**
   * Delete multiple users by their IDs
   * @param ids - Array of user IDs to delete
   * @returns Object with the count of deleted users
   */
  async removeMany(ids: number[]): Promise<{ count: number }> {
    if (!ids?.length) {
      return { count: 0 };
    }

    const result = await this.userRepository.delete({ id: In(ids) });

    return { count: result.affected || 0 };
  }
}
