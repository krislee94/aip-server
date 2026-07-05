import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import { DatabaseConfig } from '../../config/database.config';

export const buildDataSourceOptions = (
  databaseConfig: DatabaseConfig,
): DataSourceOptions => ({
  type: 'postgres',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: databaseConfig.synchronize,
  logging: databaseConfig.logging,
});

export const buildTypeOrmModuleOptions = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  ...buildDataSourceOptions(
    configService.getOrThrow<DatabaseConfig>('database'),
  ),
  autoLoadEntities: true,
});
