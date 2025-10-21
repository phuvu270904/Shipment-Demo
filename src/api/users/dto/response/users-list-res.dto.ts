import { Field, ObjectType, Int } from '@nestjs/graphql';
import { UserResDto } from './user-res.dto';

@ObjectType()
export class UsersListResDto {
  @Field(() => [UserResDto])
  items: UserResDto[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;
}
