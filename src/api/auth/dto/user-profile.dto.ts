import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User ID address (email)',
    example: 'user@example.com',
  })
  idAddress: string;

  @ApiProperty({
    description: 'User nickname',
    example: 'JohnDoe',
  })
  nickname: string;

  @ApiProperty({
    description: 'User phone number',
    example: '123-456-7890',
  })
  phone: string;

  @ApiProperty({
    description: 'User date of birth',
    example: '1990-01-01',
  })
  dob: Date;

  @ApiProperty({
    description: 'User role',
    example: 'user',
    enum: ['user', 'admin'],
  })
  role: string;

  @ApiProperty({
    description: 'User registration type',
    example: 'general',
    enum: ['general', 'kakao', 'google', 'apple'],
  })
  registration_type: string;

  @ApiProperty({
    description: 'User registration date',
    example: '2023-04-21T23:55:04.954Z',
  })
  registration_date: Date;

  @ApiProperty({
    description: 'User last access date',
    example: '2023-04-23T06:47:16.000Z',
  })
  last_access: Date;

  @ApiProperty({
    description: 'Additional user metadata',
    example: null,
    required: false,
  })
  metadata?: any;
}
