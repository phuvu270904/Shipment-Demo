import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RefreshTokenResDto {
  @Field()
  access_token: string;
}
