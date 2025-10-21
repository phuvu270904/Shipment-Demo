import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserReqDto } from './dto/request/create-user-req.dto';
import { UpdateUserReqDto } from './dto/request/update-user-req.dto';
import { UserResDto } from './dto/response/user-res.dto';
import { UsersListResDto } from './dto/response/users-list-res.dto';
import { DeleteManyUsersReqDto } from './dto/request/delete-many-users-req.dto';
import { DeleteManyResDto } from './dto/response/delete-many-res.dto';
import { Role } from '../../decorators/roles.decorator';
import { UserRole } from '../../common/enum/user.role';

@Resolver(() => UserResDto)
@Role(UserRole.ADMIN)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserResDto, {
    description: 'Create a new user',
  })
  async createUser(
    @Args('input') createUserDto: CreateUserReqDto,
  ): Promise<UserResDto> {
    return this.usersService.create(createUserDto);
  }

  @Query(() => UsersListResDto, {
    description: 'Get all users with pagination',
  })
  async users(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Int, defaultValue: 10 }) pageSize: number,
  ): Promise<UsersListResDto> {
    return this.usersService.findAll(page, pageSize);
  }

  @Query(() => UserResDto, {
    description: 'Get a user by ID',
  })
  async user(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<UserResDto> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => UserResDto, {
    description: 'Update a user',
  })
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Mutation(() => Boolean, {
    description: 'Delete a user',
  })
  async removeUser(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    await this.usersService.remove(id);
    return true;
  }

  @Mutation(() => DeleteManyResDto, {
    description: 'Delete multiple users',
  })
  async removeUsers(
    @Args('input') deleteManyUsersDto: DeleteManyUsersReqDto,
  ): Promise<DeleteManyResDto> {
    const result = await this.usersService.removeMany(deleteManyUsersDto.ids);
    return {
      message: 'Users successfully deleted',
      count: result.count,
    };
  }
}
