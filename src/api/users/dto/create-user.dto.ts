import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole, RegistrationType } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User nickname' })
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'EMAIL',
    description: 'User ID address',
  })
  @IsString()
  @IsEmail()
  idAddress: string;

  @ApiProperty({
    example: '123-456-7890',
    description: 'User phone number',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'User date of birth',
  })
  @IsString()
  dob: Date;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.USER,
    description: 'User role in the system',
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    enum: RegistrationType,
    description: 'User registration type',
  })
  @IsEnum(RegistrationType)
  @IsOptional()
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
