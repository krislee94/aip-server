import { registerAs } from '@nestjs/config';

import { toBoolean } from './config.utils';

export interface DatabaseConfig {
  database: string;
  host: string;
  logging: boolean;
  password: string;
  port: number;
  synchronize: boolean;
  username: string;
}

export const buildDatabaseConfig = (): DatabaseConfig => ({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'admin',
  password: process.env.DB_PASSWORD ?? 'admin@123',
  database: process.env.DB_DATABASE ?? 'platform',
  synchronize: toBoolean(process.env.DB_SYNCHRONIZE, false),
  logging: toBoolean(process.env.DB_LOGGING, false),
});

export default registerAs('database', buildDatabaseConfig);
