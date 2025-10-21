import { Field, InputType } from '@nestjs/graphql';
import { UserRole } from '../../../users/entities/user.entity';

@InputType()
export class RegisterReqDto {
  @Field()
  nickname: string;

  @Field()
  idAddress: string;

  @Field()
  password: string;

  @Field(() => UserRole, { nullable: true })
  role?: UserRole;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  dob?: Date;
}
