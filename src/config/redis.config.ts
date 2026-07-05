import { registerAs } from '@nestjs/config';

export interface RedisConfig {
  db: number;
  host: string;
  keyPrefix: string;
  password: string;
  port: number;
}

export const buildRedisConfig = (): RedisConfig => ({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379),
  password: process.env.REDIS_PASSWORD ?? 'redis@123',
  db: Number(process.env.REDIS_DB ?? 1),
  keyPrefix: process.env.REDIS_KEY_PREFIX ?? 'aip-developer:',
});

export default registerAs('redis', buildRedisConfig);
