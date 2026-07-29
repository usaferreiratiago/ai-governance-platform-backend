import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('AI Governance Platform API')
  .setDescription('Enterprise AI Governance Platform API')
  .setVersion('1.0.0')
  .addBearerAuth()
  .build();
