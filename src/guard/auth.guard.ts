import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { DataSource } from 'typeorm';
import { UserEntity } from '../api/users/entities/user.entity';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();
    const request: Request = gqlContext?.req ?? context.switchToHttp().getRequest();

    if (!request) {
      throw new UnauthorizedException('Cannot extract request from context');
    }

    const token = this.extractTokenFromHeader(request);

    if (isPublic) {
      if (token) {
        try {
          const payload = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          });
          request['user'] = payload;
        } catch (error) {
          console.log(
            'Optional authentication failed for public endpoint:',
            error.message,
          );
        }
      }
      return true;
    }

    if (!token) {
      throw new UnauthorizedException({
        message: 'Authentication token missing',
        code: 'TOKEN_MISSING',
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });

      const userRepository = this.dataSource.getRepository(UserEntity);
      const user = await userRepository.findOne({ where: { id: payload.id } });

      if (
        user &&
        user.last_token_generated_at &&
        payload.platform === 'mobile'
      ) {
        const tokenIssuedAt = payload.iat ? new Date(payload.iat * 1000) : null;

        if (tokenIssuedAt && tokenIssuedAt < user.last_token_generated_at) {
          throw new UnauthorizedException({
            message: 'Token invalidated due to force logout',
            code: 'FORCE_LOGOUT_TOKEN',
          });
        }
      }

      request['user'] = payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          message: 'Authentication token expired',
          code: 'TOKEN_EXPIRED',
        });
      }

      throw new UnauthorizedException({
        message: 'Invalid authentication token',
        code: 'INVALID_TOKEN',
      });
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}