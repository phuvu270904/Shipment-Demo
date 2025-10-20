import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import RequestPagingDto from '../../common/dto/paging.dto';
import { DeleteManyUsersDto } from './dto/delete-many-users.dto';
import { UsersService } from './users.service';
import { Role } from '../../decorators/roles.decorator';
import { UserRole } from '../../common/enum/user.role';

@ApiTags('Users')
@Controller('users')
@Role(UserRole.ADMIN)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  @Get()
  findAll(@Query() pagingDto: RequestPagingDto) {
    return this.usersService.findAll(pagingDto.page, pagingDto.pageSize);
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @ApiOperation({ summary: 'Delete multiple users' })
  @ApiResponse({
    status: 200,
    description: 'Users successfully deleted',
    schema: {
      properties: {
        message: { type: 'string' },
        count: { type: 'number' },
      },
    },
  })
  @Delete()
  async removeMany(
    @Body() deleteManyUsersDto: DeleteManyUsersDto,
  ): Promise<{ message: string; count: number }> {
    const result = await this.usersService.removeMany(deleteManyUsersDto.ids);
    return {
      message: 'Users successfully deleted',
      count: result.count,
    };
  }
}
