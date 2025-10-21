import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterReqDto {
  @Field()
  nickname: string;

  @Field()
  idAddress: string;

  @Field()
  password: string;

  @Field(() => String, { nullable: true })
  role?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  dob?: Date;
}
