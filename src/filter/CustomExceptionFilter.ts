import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private logger = new Logger();

  catch(exception: Error, host: ArgumentsHost) {
    const { name, message } = exception;

    this.logger.error(`[${exception.name}] : ${exception.message}`);

    // Check if this is a GraphQL context
    if (host.getType().toString() === 'graphql') {
      throw exception;
    }

    // HTTP context handling
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      response.status(status).json({
        statusCode: status,
        ...(typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : exceptionResponse),
      });

      return;
    }

    this.logger.error(exception);

    response.status(500).json({
      statusCode: 500,
      error: name,
      message,
    });
  }
}
