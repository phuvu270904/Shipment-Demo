import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'User information',
    example: {
      id: 1,
      nickname: 'User123',
      idAddress: 'user@example.com',
      phone: '123-456-7890',
      dob: '1990-01-01T00:00:00.000Z',
      role: 'general',
      registration_type: 'general',
      member_type: 'free',
      registration_date: '2023-04-21T23:55:04.954Z',
    },
  })
  user: {
    id: number;
    nickname: string;
    idAddress: string;
    phone: string;
    dob: Date;
    role: string;
    registration_type: string;
    member_type: string;
    registration_date: Date;
  };

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token: string;
}
