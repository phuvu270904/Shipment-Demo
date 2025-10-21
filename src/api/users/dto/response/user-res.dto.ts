import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class UserResDto {
  @Field(() => Int)
  id: number;

  @Field()
  idAddress: string;

  @Field()
  nickname: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  dob?: Date;

  @Field()
  role: string;

  @Field()
  registration_type: string;

  @Field()
  registration_date: Date;

  @Field({ nullable: true })
  last_access?: Date;

  @Field({ nullable: true })
  metadata?: string;

  @Field({ nullable: true })
  fcm_token?: string;

  @Field({ nullable: true })
  last_token_generated_at?: Date;
}
