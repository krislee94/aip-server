import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AgentMcpRel } from './entities/agent-mcp-rel.entity';
import { McpServer } from './entities/mcp.entity';
import { McpService } from './mcp.service';
import { McpController } from './mcp.controller';
import { McpRepository } from './mcp.repository';

@Module({
  imports: [TypeOrmModule.forFeature([McpServer, AgentMcpRel])],
  controllers: [McpController],
  providers: [McpRepository, McpService],
})
export class McpModule {}
