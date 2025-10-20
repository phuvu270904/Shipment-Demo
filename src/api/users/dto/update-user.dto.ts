import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole, RegistrationType } from '../entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'User nickname',
    required: false,
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  isAddress?: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    enum: UserRole,
    description: 'User role in the system',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    enum: RegistrationType,
    description: 'User registration type',
    required: false,
  })
  @IsOptional()
  @IsEnum(RegistrationType)
  registration_type?: RegistrationType;

  @ApiProperty({
    example: '{"preferences": {"theme": "dark"}}',
    description: 'Additional user metadata as JSON string',
    required: false,
  })
  @IsOptional()
  @IsString()
  metadata?: string;
}
