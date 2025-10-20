import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class DeleteManyUsersDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of user IDs to delete',
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  ids: number[];
}
