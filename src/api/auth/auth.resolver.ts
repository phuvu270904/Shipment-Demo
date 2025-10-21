import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Public } from '../../decorators/public.decorator';
import { AuthGuard } from '../../guard/auth.guard';
import { UserRole } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginReqDto } from './dto/request/login-req.dto';
import { RegisterReqDto } from './dto/request/register-req.dto';
import { RefreshTokenReqDto } from './dto/request/refresh-token-req.dto';
import { LoginResDto } from './dto/response/login-res.dto';
import { RegisterResDto } from './dto/response/register-res.dto';
import { RefreshTokenResDto } from './dto/response/refresh-token-res.dto';
import { UserProfileResDto } from './dto/response/user-profile-res.dto';
import { CustomMutation, CustomQuery } from '../../decorators/custom-graphql.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @CustomMutation(() => LoginResDto, 'Login with id and password')
  async login(@Args('input') loginInput: LoginReqDto): Promise<LoginResDto> {
    return this.authService.login(loginInput);
  }

  @Public()
  @CustomMutation(() => RegisterResDto, 'Register a new user')
  async register(
    @Args('input') registerInput: RegisterReqDto,
  ): Promise<RegisterResDto> {
    return this.authService.register(registerInput as any);
  }

  @Public()
  @CustomMutation(() => RefreshTokenResDto, 'Refresh access token')
  async refreshToken(
    @Args('input') refreshTokenInput: RefreshTokenReqDto,
  ): Promise<RefreshTokenResDto> {
    return this.authService.refreshToken(refreshTokenInput);
  }

  @CustomQuery(() => UserProfileResDto, 'Get current user profile')
  async profile(@Context() context): Promise<UserProfileResDto> {
    const userId = context.req.user.id;
    return this.authService.getProfile(userId);
  }
}

