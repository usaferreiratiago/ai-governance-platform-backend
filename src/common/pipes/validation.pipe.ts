import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ValidationPipe as NestValidationPipe,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        return new BadRequestException({
          message: 'Validation failed',
          errors: errors.map((e) => ({
            property: e.property,
            constraints: e.constraints,
          })),
        });
      },
    });
  }

  transform(value: any, metadata: ArgumentMetadata) {
    return super.transform(value, metadata);
  }
}
