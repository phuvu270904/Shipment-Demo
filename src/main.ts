// ** Nest Imports
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';

// ** Custom Module Imports
import { AppModule } from './app.module';
import LoggerService from './util/logger/logger.service';

// ** Security Imports
import csurf from 'csurf';
import helmet from 'helmet';

// ** Interceptor Imports
import { LoggingInterceptor } from './interceptor/LoggingInterceptor';

// ** Filter Imports
import { CustomExceptionFilter } from './filter/CustomExceptionFilter';

// ** Swagger Imports
import swaggerConfig from './config/swaggerConfig';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    snapshot: true,
  });

  // ** Base URL
  app.setGlobalPrefix('api');

  // ** Nest Version
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ** Logger
  app.useLogger(app.get(LoggerService));

  // ** FIlter
  app.useGlobalFilters(new CustomExceptionFilter());

  // ** Interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // ** Global Pipe Line
  app.useGlobalPipes(new ValidationPipe());

  // ** Security
  app.enableCors();
  if (process.env.NODE_ENV === 'production') {
    app.use(csurf());
  }
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );


  // ** Swagger Setting
  if (process.env.NODE_ENV !== 'production') {
    swaggerConfig(app);
  }

  // ** Server ON Handler
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
