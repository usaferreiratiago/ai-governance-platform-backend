/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, _host: ArgumentsHost) {
    switch (exception.code) {
      case 'P2002':
        throw new ConflictException('Unique constraint violation');

      case 'P2025':
        throw new NotFoundException('Record not found');

      default:
        throw exception;
    }
  }
}
