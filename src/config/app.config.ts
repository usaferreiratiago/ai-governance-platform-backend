import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'AI Governance Platform',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  apiPrefix: process.env.API_PREFIX || 'api',
  logLevel: process.env.LOG_LEVEL || 'debug',
}));
