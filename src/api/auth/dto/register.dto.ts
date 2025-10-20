import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

enum UserRole {
  USER = 'user',
}
export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsEmail()
  idAddress: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'user', description: 'User role' })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: '123-456-7890', description: 'User phone number' })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'User date of birth',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  dob: Date;
}
