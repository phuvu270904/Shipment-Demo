import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../api/users/entities/user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
