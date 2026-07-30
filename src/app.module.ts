import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, validationSchema } from './config';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { BenchmarksModule } from './modules/benchmarks/benchmarks.module';

@Module({
  imports: [
    AuthModule,
    AuditModule,
    BenchmarksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      validationSchema,
      expandVariables: true,
    }),
  ],
})
export class AppModule {}
