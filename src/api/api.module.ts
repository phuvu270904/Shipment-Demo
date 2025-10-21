// ** Nest Imports
import { Module } from '@nestjs/common';

// ** Custom Module Imports
import UsersModule from './users/users.module';
import AuthModule from './auth/auth.module';
import { AuthResolver } from './auth/auth.resolver';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [AuthResolver],
  exports: [],
  controllers: [],
})
export default class ApiModule {}
