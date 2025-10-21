import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
  @Query(() => String)
  sayHello(): string {
    return 'Hello from GraphQL!';
  }
}
