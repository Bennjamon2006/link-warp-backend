import { z } from 'zod';

const nodeEnvSchema = z
  .enum(['development', 'production', 'test'])
  .default('development');

const nodeEnvResult = nodeEnvSchema.safeParse(process.env.NODE_ENV);

if (!nodeEnvResult.success) {
  console.error('Invalid NODE_ENV:', z.treeifyError(nodeEnvResult.error));
  process.exit(1);
}

const NODE_ENV = nodeEnvResult.data;

const configSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('localhost'),
  DATABASE_URL: z.string().default(() => {
    if (NODE_ENV === 'production') {
      throw new Error('DATABASE_URL must be set in production');
    }

    return 'postgresql://linkwarp:linkwarp@localhost:5432/linkwarp';
  }),
  JWT_SECRET: z.string().default(() => {
    if (NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set in production');
    }

    return 'your_jwt_secret_key';
  }),
  SESSION_MAX_AGE: z.coerce.number().default(7 * 24 * 60 * 60),
});

const result = configSchema.safeParse(process.env);

if (!result.success) {
  console.error('Invalid environment variables:', z.treeifyError(result.error));
  process.exit(1);
}

const env = result.data;

export default {
  server: {
    port: env.PORT,
    host: env.HOST,
  },
  database: {
    url: env.DATABASE_URL,
  },
  auth: {
    secret: env.JWT_SECRET,
    sessionMaxAge: env.SESSION_MAX_AGE,
  },
  runtime: {
    env: NODE_ENV,
    isProduction: NODE_ENV === 'production',
  },
};
