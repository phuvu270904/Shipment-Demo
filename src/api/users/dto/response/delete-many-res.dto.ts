import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class DeleteManyResDto {
  @Field()
  message: string;

  @Field(() => Int)
  count: number;
}
