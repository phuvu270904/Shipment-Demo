// ** Nest Imports
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// ** Logger Imports
import LoggerService from './util/logger/logger.service';

// ** Typeorm Imports
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from './repository/typeorm-ex.module';
import ApiModule from './api/api.module';

import ormconfig from './ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/api/**/*.entity.js'],
      synchronize: false,
      logging: true,
      logger: 'file',
    }),
    TypeOrmExModule,
    ApiModule,
  ],
  controllers: [],
  providers: [LoggerService],
})
export class AppModule {}
