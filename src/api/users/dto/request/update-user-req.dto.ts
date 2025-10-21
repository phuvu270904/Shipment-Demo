import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole, RegistrationType } from '../../entities/user.entity';

@InputType()
export class UpdateUserReqDto {
  @Field({ nullable: true })
  @ApiProperty({
    example: 'John Doe',
    description: 'User nickname',
    required: false,
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @Field({ nullable: true })
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  isAddress?: string;

  @Field({ nullable: true })
  @ApiProperty({
    example: 'password123',
    description: 'User password',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @Field(() => String, { nullable: true })
  @ApiProperty({
    enum: UserRole,
    description: 'User role in the system',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @Field(() => String, { nullable: true })
  @ApiProperty({
    enum: RegistrationType,
    description: 'User registration type',
    required: false,
  })
  @IsOptional()
  @IsEnum(RegistrationType)
  registration_type?: RegistrationType;

  @Field({ nullable: true })
  @ApiProperty({
    example: '{"preferences": {"theme": "dark"}}',
    description: 'Additional user metadata as JSON string',
    required: false,
  })
  @IsOptional()
  @IsString()
  metadata?: string;
}
