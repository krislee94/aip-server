import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { McpServer } from '../mcp/entities/mcp.entity';
import { AgentMcpRel } from '../mcp/entities/agent-mcp-rel.entity';
import { Project } from '../project/entities/project.entity';
import { Skill } from '../skills/entities/skill.entity';
import { AgentSkillRel } from '../skills/entities/agent-skill-rel.entity';
import { BindAgentMcpDto } from './dto/bind-agent-mcp.dto';
import { BindAgentRelationDto } from './dto/bind-agent-relation.dto';
import { BindAgentSkillDto } from './dto/bind-agent-skill.dto';
import { CreateAgentPromptDto } from './dto/create-agent-prompt.dto';
import { CreateAgentDto } from './dto/create-agent.dto';
import { AgentPrompt } from './entities/agent-prompt.entity';
import { AgentRel } from './entities/agent-rel.entity';
import { Agent } from './entities/agent.entity';

@Injectable()
export class AgentRepository {
  constructor(
    @InjectRepository(Agent)
    private readonly repository: Repository<Agent>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(AgentPrompt)
    private readonly promptRepository: Repository<AgentPrompt>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(AgentSkillRel)
    private readonly agentSkillRelRepository: Repository<AgentSkillRel>,
    @InjectRepository(McpServer)
    private readonly mcpRepository: Repository<McpServer>,
    @InjectRepository(AgentMcpRel)
    private readonly agentMcpRelRepository: Repository<AgentMcpRel>,
    @InjectRepository(AgentRel)
    private readonly agentRelRepository: Repository<AgentRel>,
  ) {}

  create(dto: CreateAgentDto, creator: string, agentCode: string): Agent {
    return this.repository.create({
      ...dto,
      agentCode,
      createdBy: creator,
      tenantId: creator,
    });
  }

  findAllByOwner(creator: string, projectId?: string): Promise<Agent[]> {
    const where: FindOptionsWhere<Agent> = {
      createdBy: creator,
      isDeleted: false,
    };

    if (projectId) {
      where.projectId = projectId;
    }

    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
      where,
    });
  }

  findByCode(tenantId: string, agentCode: string): Promise<Agent | null> {
    return this.repository.findOne({
      where: {
        agentCode,
        isDeleted: false,
        tenantId,
      },
    });
  }

  findOneByIdAndOwner(id: string, creator: string): Promise<Agent | null> {
    return this.repository.findOne({
      where: {
        createdBy: creator,
        id,
        isDeleted: false,
      },
    });
  }

  findOwnedProject(id: string, creator: string): Promise<Project | null> {
    return this.projectRepository.findOne({
      where: {
        createdBy: creator,
        id,
      },
    });
  }

  save(agent: Agent): Promise<Agent> {
    return this.repository.save(agent);
  }

  createPrompt(
    dto: CreateAgentPromptDto,
    agentId: string,
    creator: string,
  ): AgentPrompt {
    return this.promptRepository.create({
      ...dto,
      agentId,
      createdBy: creator,
      tenantId: creator,
      temperature: dto.temperature?.toFixed(2),
      topP: dto.topP?.toFixed(2),
    });
  }

  findPromptsByAgent(agentId: string, creator: string): Promise<AgentPrompt[]> {
    return this.promptRepository.find({
      order: {
        isDefault: 'DESC',
        createdAt: 'DESC',
      },
      where: {
        agentId,
        createdBy: creator,
        isDeleted: false,
      },
    });
  }

  findPromptByIdAndAgent(
    id: string,
    agentId: string,
    creator: string,
  ): Promise<AgentPrompt | null> {
    return this.promptRepository.findOne({
      where: {
        agentId,
        createdBy: creator,
        id,
        isDeleted: false,
      },
    });
  }

  savePrompt(prompt: AgentPrompt): Promise<AgentPrompt> {
    return this.promptRepository.save(prompt);
  }

  async unsetDefaultPrompts(agentId: string): Promise<void> {
    await this.promptRepository.update(
      {
        agentId,
        isDeleted: false,
      },
      {
        isDefault: false,
      },
    );
  }

  findOwnedSkill(id: string, creator: string): Promise<Skill | null> {
    return this.skillRepository.findOne({
      where: {
        createdBy: creator,
        id,
        isDeleted: false,
      },
    });
  }

  createSkillBinding(
    dto: BindAgentSkillDto,
    agentId: string,
    creator: string,
  ): AgentSkillRel {
    return this.agentSkillRelRepository.create({
      ...dto,
      agentId,
      createdBy: creator,
      tenantId: creator,
    });
  }

  findAgentSkillBindings(
    agentId: string,
    creator: string,
  ): Promise<AgentSkillRel[]> {
    return this.agentSkillRelRepository.find({
      order: {
        sort: 'ASC',
        createdAt: 'DESC',
      },
      relations: {
        skill: true,
      },
      where: {
        agentId,
        createdBy: creator,
        isDeleted: false,
      },
    });
  }

  findAgentSkillBinding(
    id: string,
    agentId: string,
    creator: string,
  ): Promise<AgentSkillRel | null> {
    return this.agentSkillRelRepository.findOne({
      relations: {
        skill: true,
      },
      where: {
        agentId,
        createdBy: creator,
        id,
        isDeleted: false,
      },
    });
  }

  findAgentSkillBindingBySkill(
    agentId: string,
    skillId: string,
  ): Promise<AgentSkillRel | null> {
    return this.agentSkillRelRepository.findOne({
      where: {
        agentId,
        isDeleted: false,
        skillId,
      },
    });
  }

  saveAgentSkillBinding(binding: AgentSkillRel): Promise<AgentSkillRel> {
    return this.agentSkillRelRepository.save(binding);
  }

  findOwnedMcp(id: string, creator: string): Promise<McpServer | null> {
    return this.mcpRepository.findOne({
      where: {
        createdBy: creator,
        id,
        isDeleted: false,
      },
    });
  }

  createMcpBinding(
    dto: BindAgentMcpDto,
    agentId: string,
    creator: string,
  ): AgentMcpRel {
    return this.agentMcpRelRepository.create({
      ...dto,
      agentId,
      createdBy: creator,
      tenantId: creator,
    });
  }

  findAgentMcpBindings(
    agentId: string,
    creator: string,
  ): Promise<AgentMcpRel[]> {
    return this.agentMcpRelRepository.find({
      order: {
        sort: 'ASC',
        createdAt: 'DESC',
      },
      relations: {
        mcp: true,
      },
      where: {
        agentId,
        createdBy: creator,
        isDeleted: false,
      },
    });
  }

  findAgentMcpBinding(
    id: string,
    agentId: string,
    creator: string,
  ): Promise<AgentMcpRel | null> {
    return this.agentMcpRelRepository.findOne({
      relations: {
        mcp: true,
      },
      where: {
        agentId,
        createdBy: creator,
        id,
        isDeleted: false,
      },
    });
  }

  findAgentMcpBindingByMcp(
    agentId: string,
    mcpId: string,
  ): Promise<AgentMcpRel | null> {
    return this.agentMcpRelRepository.findOne({
      where: {
        agentId,
        isDeleted: false,
        mcpId,
      },
    });
  }

  saveAgentMcpBinding(binding: AgentMcpRel): Promise<AgentMcpRel> {
    return this.agentMcpRelRepository.save(binding);
  }

  createAgentRelation(
    dto: BindAgentRelationDto,
    mainAgentId: string,
    creator: string,
  ): AgentRel {
    return this.agentRelRepository.create({
      ...dto,
      createdBy: creator,
      mainAgentId,
      tenantId: creator,
    });
  }

  findAgentRelations(
    mainAgentId: string,
    creator: string,
  ): Promise<AgentRel[]> {
    return this.agentRelRepository.find({
      order: {
        sort: 'ASC',
        createdAt: 'DESC',
      },
      relations: {
        subAgent: true,
      },
      where: {
        createdBy: creator,
        isDeleted: false,
        mainAgentId,
      },
    });
  }

  findAgentRelation(
    id: string,
    mainAgentId: string,
    creator: string,
  ): Promise<AgentRel | null> {
    return this.agentRelRepository.findOne({
      relations: {
        subAgent: true,
      },
      where: {
        createdBy: creator,
        id,
        isDeleted: false,
        mainAgentId,
      },
    });
  }

  findAgentRelationBySubAgent(
    mainAgentId: string,
    subAgentId: string,
  ): Promise<AgentRel | null> {
    return this.agentRelRepository.findOne({
      where: {
        isDeleted: false,
        mainAgentId,
        subAgentId,
      },
    });
  }

  saveAgentRelation(relation: AgentRel): Promise<AgentRel> {
    return this.agentRelRepository.save(relation);
  }
}
