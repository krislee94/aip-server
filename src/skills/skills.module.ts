import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AgentSkillRel } from './entities/agent-skill-rel.entity';
import { Skill } from './entities/skill.entity';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { SkillsRepository } from './skills.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, AgentSkillRel])],
  controllers: [SkillsController],
  providers: [SkillsRepository, SkillsService],
})
export class SkillsModule {}
