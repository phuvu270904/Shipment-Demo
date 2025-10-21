import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class UserProfileResDto {
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

  @Field()
  last_access: Date;

  @Field({ nullable: true })
  metadata?: string;
}
