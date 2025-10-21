import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RefreshTokenReqDto {
  @Field()
  refresh_token: string;
}
