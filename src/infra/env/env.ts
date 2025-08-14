import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_SECRET_KEY: z.string(),
  OMS_SECRET: z.string(),
  OMS_CLIENT_ID: z.string(),
});

export type Env = z.infer<typeof envSchema>;
