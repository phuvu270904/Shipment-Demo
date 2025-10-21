import { Query, Resolver } from '@nestjs/graphql';
import { Public } from '../../decorators/public.decorator';

@Resolver()
export class AuthResolver {
    @Public()
  @Query(() => String)
  sayHello(): string {
    return 'Hello from GraphQL!';
  }
}
