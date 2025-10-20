// ** Nest Imports
import { Module } from '@nestjs/common';

// ** Custom Module Imports
import UsersModule from './users/users.module';
import AuthModule from './auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [],
  exports: [],
  controllers: [],
})
export default class ApiModule {}
