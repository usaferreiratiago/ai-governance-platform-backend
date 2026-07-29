import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  provider: process.env.AI_PROVIDER || 'openai',

  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4.1-mini',

  azureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
  azureOpenAiApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAiDeployment: process.env.AZURE_OPENAI_DEPLOYMENT,

  embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',

  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.1'),

  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '2048', 10),
}));
