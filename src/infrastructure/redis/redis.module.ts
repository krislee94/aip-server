import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { RedisConfig } from '../../config/redis.config';
import { REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.getOrThrow<RedisConfig>('redis');
        const client = new Redis({
          db: redisConfig.db,
          host: redisConfig.host,
          keyPrefix: redisConfig.keyPrefix,
          lazyConnect: true,
          maxRetriesPerRequest: 3,
          password: redisConfig.password,
          port: redisConfig.port,
        });

        await client.connect();
        await client.ping();

        return client;
      },
    },
    RedisService,
  ],
  exports: [RedisService, REDIS_CLIENT],
})
export class RedisModule {}
