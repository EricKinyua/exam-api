import Joi from 'joi';

export default () => ({
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  NODE_ENV: process.env.NODE_ENV,
  WORKSPACE: process.env.WORKSPACE,
  DATABASE_URL: process.env.DATABASE_URL,
});

export const validationSchema = Joi.object({
  // Basic configuration
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('local', 'development', 'staging', 'production', 'test')
    .required(),

  // Cloud / App configuration
  WORKSPACE: Joi.string().valid('dev', 'prod').required(),

  // Database
  DATABASE_URL: Joi.string().required(),
});
