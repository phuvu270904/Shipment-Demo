// ** Nest Imports
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { CommonResponseType } from '../type';
import { isEmpty } from 'lodash';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('LoggingInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let request: any;
    let method = '';
    let path = '';

    const httpCtx = context.switchToHttp().getRequest();
    if (httpCtx) {
      request = httpCtx;
      method = request.method;
      path = request.url;
    } else {
      const gqlCtx = GqlExecutionContext.create(context);
      const gqlInfo = gqlCtx.getInfo();
      const gqlReq = gqlCtx.getContext().req;

      request = gqlReq;
      method = 'GRAPHQL';
      path = `${gqlInfo.parentType.name} → ${gqlInfo.fieldName}`;
    }

    this.logger.log(`[${method}] ${path}`);

    if (request && !isEmpty(request.body)) {
      this.logger.log(`Body: ${JSON.stringify(request.body)}`);
    }

    if (request && !isEmpty(request.query)) {
      this.logger.log(`Query: ${JSON.stringify(request.query)}`);
    }

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (response: CommonResponseType) => {
          const elapsed = Date.now() - now;
          this.logger.log(
            `[${method}] ${path} → ${response.statusCode} (${elapsed}ms) : ${response.message}`,
          );
        },
        error: (error: Error) => {
          const elapsed = Date.now() - now;
          this.logger.error(
            `[${method}] ${path} → Error (${elapsed}ms): ${error.message}`,
          );
        },
      }),
    );
  }
}
