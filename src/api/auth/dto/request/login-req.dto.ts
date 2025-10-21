import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginReqDto {
  @Field()
  idAddress: string;

  @Field()
  password: string;
}
