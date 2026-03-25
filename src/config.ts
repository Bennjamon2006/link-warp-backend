import { z } from 'zod';

const configSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('localhost'),
  DATABASE_URL: z
    .string()
    .default('postgresql://linkwarp:linkwarp@localhost:5432/linkwarp'),
});

const env = configSchema.parse(process.env);

export default {
  server: {
    port: env.PORT,
    host: env.HOST,
  },
  database: {
    url: env.DATABASE_URL,
  },
};
