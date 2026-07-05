import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { ProjectModule } from './project/project.module';
import { AgentModule } from './agent/agent.module';
import { SkillsModule } from './skills/skills.module';
import { McpModule } from './mcp/mcp.module';
import { ModelModule } from './model/model.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    RedisModule,
    AuthModule,
    ProjectModule,
    AgentModule,
    SkillsModule,
    McpModule,
    ModelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
