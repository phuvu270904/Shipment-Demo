import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsNumber } from 'class-validator';

@InputType()
export class DeleteManyUsersReqDto {
  @Field(() => [Int])
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of user IDs to delete',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];
}
