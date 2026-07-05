import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AgentMcpRel } from '../mcp/entities/agent-mcp-rel.entity';
import { McpServer } from '../mcp/entities/mcp.entity';
import { Project } from '../project/entities/project.entity';
import { AgentSkillRel } from '../skills/entities/agent-skill-rel.entity';
import { Skill } from '../skills/entities/skill.entity';
import { AgentRepository } from './agent.repository';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { AgentA2AProtocol } from './entities/agent-a2a-protocol.entity';
import { AgentPrompt } from './entities/agent-prompt.entity';
import { AgentRel } from './entities/agent-rel.entity';
import { Agent } from './entities/agent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agent,
      AgentPrompt,
      AgentA2AProtocol,
      AgentRel,
      Project,
      Skill,
      AgentSkillRel,
      McpServer,
      AgentMcpRel,
    ]),
  ],
  controllers: [AgentController],
  providers: [AgentRepository, AgentService],
})
export class AgentModule {}
