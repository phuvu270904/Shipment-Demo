import { Field, ObjectType } from '@nestjs/graphql';
import { UserInfo } from './login-res.dto';

@ObjectType()
export class RegisterResDto {
  @Field(() => UserInfo)
  user: UserInfo;
}
