import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

const development = process.env.NODE_ENV || 'development';

dotenv.config({
  path: development ? '.env.development' : '.env.staging',
});

const ormConfig = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/api/**/*.entity.js'],
  synchronize: false,
  migrations: [
    process.env.NODE_ENV === 'development'
      ? 'dist/migrations/*.js'
      : `dist/migrations-${process.env.NODE_ENV}/*.js`,
  ],
  migrationsTransactionMode: 'all',
  logging: true,
  logger: 'file',
} as TypeOrmModuleOptions;

export default ormConfig;

export const AppDataSource = new DataSource(ormConfig as any);
