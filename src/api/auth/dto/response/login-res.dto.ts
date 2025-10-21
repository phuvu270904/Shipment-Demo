import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class UserInfo {
  @Field(() => Int)
  id: number;

  @Field()
  nickname: string;

  @Field()
  idAddress: string;
}

@ObjectType()
export class LoginResDto {
  @Field(() => UserInfo)
  user: UserInfo;

  @Field()
  access_token: string;

  @Field()
  refresh_token: string;
}
