/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { swaggerConfig } from './config';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const frontendUrl = configService.getOrThrow<string>('app.frontendUrl');

  const apiPrefix = configService.getOrThrow<string>('app.apiPrefix');

  const port = configService.getOrThrow<number>('app.port');

  app.enableCors({
    origin: [frontendUrl],
    credentials: true,
  });

  app.setGlobalPrefix(apiPrefix);

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document);

  await app.listen(port);

  console.log(`Server running on http://localhost:${port}/${apiPrefix}`);
}

const reflector = app.get(Reflector);

app.useGlobalGuards(
  new JwtAuthGuard(reflector),
  new RolesGuard(reflector),
);

bootstrap();
