/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const method = request.method;
    const path = request.originalUrl;
    const user = request.user;

    return next.handle().pipe(
      tap(() => {
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          console.log('[AUDIT]', {
            method,
            path,
            userId: user?.sub ?? null,
            timestamp: new Date().toISOString(),
          });
        }
      }),
    );
  }
}

// constructor(private readonly auditService: AuditService) {}

// await this.auditService.log({
//   userId: user?.sub,
//   action: method,
//   entity: path,
//   metadata: {
//     ip: request.ip,
//     userAgent: request.headers['user-agent'],
//   },
// });
