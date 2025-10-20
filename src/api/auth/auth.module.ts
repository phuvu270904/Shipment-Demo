import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import UsersModule from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../guard/auth.guard';
import { TypeOrmExModule } from '../../repository/typeorm-ex.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import UserRepository from '../users/repositories/user.repository';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { UserRolesGuard } from '../../guard/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '3600s',
      },
    }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UserRolesGuard,
    },
    AuthService,
  ],
  exports: [JwtModule],
})
export default class AuthModule {}
