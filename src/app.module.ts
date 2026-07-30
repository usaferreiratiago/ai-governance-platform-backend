/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, validationSchema } from './config';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    AuditModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      validationSchema,
      expandVariables: true,
    }),
  ],
})
export class AppModule {}
