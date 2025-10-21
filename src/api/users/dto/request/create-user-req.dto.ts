import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole, RegistrationType } from '../../entities/user.entity';

@InputType()
export class CreateUserReqDto {
  @Field()
  @ApiProperty({ example: 'John Doe', description: 'User nickname' })
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @Field()
  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @Field()
  @ApiProperty({
    example: 'EMAIL',
    description: 'User ID address',
  })
  @IsString()
  @IsEmail()
  idAddress: string;

  @Field()
  @ApiProperty({
    example: '123-456-7890',
    description: 'User phone number',
  })
  @IsString()
  phone: string;

  @Field()
  @ApiProperty({
    example: '1990-01-01',
    description: 'User date of birth',
  })
  @IsString()
  dob: Date;

  @Field(() => String)
  @ApiProperty({
    enum: UserRole,
    default: UserRole.USER,
    description: 'User role in the system',
  })
  @IsEnum(UserRole)
  role: UserRole;

  @Field(() => String, { nullable: true })
  @ApiProperty({
    enum: RegistrationType,
    description: 'User registration type',
  })
  @IsEnum(RegistrationType)
  @IsOptional()
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
