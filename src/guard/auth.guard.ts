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

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // If it's a public endpoint, try to authenticate if token is provided
    if (isPublic) {
      if (token) {
        try {
          const payload = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          });
          // Set user in request for optional authentication
          request['user'] = payload;
        } catch (error) {
          // For public endpoints, we don't throw errors for invalid tokens
          // We just don't set the user, so req.user remains undefined
          console.log(
            'Optional authentication failed for public endpoint:',
            error.message,
          );
        }
      }
      return true;
    }

    // For protected endpoints, require valid authentication
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

      // Check if the token was generated before a force login
      const userRepository = this.dataSource.getRepository(UserEntity);
      const user = await userRepository.findOne({
        where: { id: payload.id },
      });

      if (
        user &&
        user.last_token_generated_at &&
        payload.platform === 'mobile'
      ) {
        // Get the token's issued at time (iat) from the payload
        const tokenIssuedAt = payload.iat ? new Date(payload.iat * 1000) : null;

        if (tokenIssuedAt && tokenIssuedAt < user.last_token_generated_at) {
          throw new UnauthorizedException({
            message: 'Token invalidated due to force logout',
            code: 'FORCE_LOGOUT_TOKEN',
          });
        }
      }

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch (error) {
      // If it's already our custom UnauthorizedException, re-throw it
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Check if the error is specifically a token expiration error
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          message: 'Authentication token expired',
          code: 'TOKEN_EXPIRED',
        });
      }
      // For other JWT or verification errors
      throw new UnauthorizedException({
        message: 'Invalid authentication token',
        code: 'INVALID_TOKEN',
      });
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
