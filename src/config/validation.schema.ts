/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  PORT: Joi.number().default(3000),

  APP_NAME: Joi.string().default('AI Governance Platform'),

  FRONTEND_URL: Joi.string().uri().required(),

  API_PREFIX: Joi.string().default('api'),

  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'log', 'debug', 'verbose')
    .default('debug'),

  DATABASE_URL: Joi.string().required(),

  DB_HOST: Joi.string().optional(),
  DB_PORT: Joi.number().optional(),
  DB_USERNAME: Joi.string().optional(),
  DB_PASSWORD: Joi.string().optional(),
  DB_NAME: Joi.string().optional(),
  DB_SSL: Joi.boolean().optional(),

  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),

  JWT_REFRESH_SECRET: Joi.string().min(16).required(),

  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  BCRYPT_ROUNDS: Joi.number().default(12),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  REDIS_DB: Joi.number().default(0),

  AI_PROVIDER: Joi.string().valid('openai', 'azure-openai').default('openai'),

  OPENAI_API_KEY: Joi.string().allow('').optional(),
  OPENAI_MODEL: Joi.string().optional(),

  AZURE_OPENAI_ENDPOINT: Joi.string().allow('').optional(),

  AZURE_OPENAI_API_KEY: Joi.string().allow('').optional(),

  AZURE_OPENAI_DEPLOYMENT: Joi.string().allow('').optional(),

  EMBEDDING_MODEL: Joi.string().optional(),

  AI_TEMPERATURE: Joi.number().min(0).max(2).default(0.1),

  AI_MAX_TOKENS: Joi.number().default(2048),
});
