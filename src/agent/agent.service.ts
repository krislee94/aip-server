import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { AgentRepository } from './agent.repository';
import { AgentMcpBindingResponseDto } from './dto/agent-mcp-binding-response.dto';
import { AgentPromptResponseDto } from './dto/agent-prompt-response.dto';
import { AgentRelationResponseDto } from './dto/agent-relation-response.dto';
import { AgentResponseDto } from './dto/agent-response.dto';
import { AgentSkillBindingResponseDto } from './dto/agent-skill-binding-response.dto';
import { BindAgentMcpDto } from './dto/bind-agent-mcp.dto';
import { BindAgentRelationDto } from './dto/bind-agent-relation.dto';
import { BindAgentSkillDto } from './dto/bind-agent-skill.dto';
import { CreateAgentPromptDto } from './dto/create-agent-prompt.dto';
import { CreateAgentDto } from './dto/create-agent.dto';
import { FindAgentsQueryDto } from './dto/find-agents-query.dto';
import { UpdateAgentMcpBindingDto } from './dto/update-agent-mcp-binding.dto';
import { UpdateAgentPromptDto } from './dto/update-agent-prompt.dto';
import { UpdateAgentRelationDto } from './dto/update-agent-relation.dto';
import { UpdateAgentSkillBindingDto } from './dto/update-agent-skill-binding.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { LlmModel } from '../model/entities/model.entity';

@Injectable()
export class AgentService {
  constructor(private readonly agentRepository: AgentRepository) {}

  async create(
    createAgentDto: CreateAgentDto,
    creator: string,
  ): Promise<AgentResponseDto> {
    await this.ensureOwnedProject(createAgentDto.projectId, creator);
    const model = await this.resolveOwnedModel(
      createAgentDto.llmModelId,
      creator,
    );

    const agentCode =
      createAgentDto.agentCode ??
      this.generateAgentCode(createAgentDto.agentName);
    await this.ensureUniqueCode(creator, agentCode);

    const agent = this.agentRepository.create(
      this.withModelDefaults(createAgentDto, model),
      creator,
      agentCode,
    );
    const savedAgent = await this.agentRepository.save(agent);
    savedAgent.llmModelConfig = model ?? undefined;

    return new AgentResponseDto(savedAgent);
  }

  async findAll(
    query: FindAgentsQueryDto,
    creator: string,
  ): Promise<AgentResponseDto[]> {
    if (query.projectId) {
      await this.ensureOwnedProject(query.projectId, creator);
    }

    const agents = await this.agentRepository.findAllByOwner(
      creator,
      query.projectId,
    );
    return agents.map((agent) => new AgentResponseDto(agent));
  }

  async findOne(id: string, creator: string): Promise<AgentResponseDto> {
    const agent = await this.findOwnedAgent(id, creator);
    return new AgentResponseDto(agent);
  }

  async update(
    id: string,
    updateAgentDto: UpdateAgentDto,
    updater: string,
  ): Promise<AgentResponseDto> {
    const agent = await this.findOwnedAgent(id, updater);

    if (updateAgentDto.projectId) {
      await this.ensureOwnedProject(updateAgentDto.projectId, updater);
    }

    if (
      updateAgentDto.agentCode &&
      updateAgentDto.agentCode !== agent.agentCode
    ) {
      await this.ensureUniqueCode(updater, updateAgentDto.agentCode);
    }

    const model = await this.resolveOwnedModel(
      updateAgentDto.llmModelId,
      updater,
    );
    Object.assign(agent, updateAgentDto, {
      updatedBy: updater,
    });

    if (updateAgentDto.llmModelId !== undefined) {
      agent.llmModelId = model?.id ?? null;
      agent.llmModel = model?.modelCode ?? '';
      agent.llmModelConfig = model ?? undefined;
    }

    return new AgentResponseDto(await this.agentRepository.save(agent));
  }

  async remove(id: string, updater: string): Promise<void> {
    const agent = await this.findOwnedAgent(id, updater);
    agent.isDeleted = true;
    agent.updatedBy = updater;

    await this.agentRepository.save(agent);
  }

  async createPrompt(
    agentId: string,
    createPromptDto: CreateAgentPromptDto,
    creator: string,
  ): Promise<AgentPromptResponseDto> {
    const agent = await this.findOwnedAgent(agentId, creator);
    const prompt = this.agentRepository.createPrompt(
      createPromptDto,
      agent.id,
      creator,
    );

    if (createPromptDto.isDefault) {
      await this.agentRepository.unsetDefaultPrompts(agent.id);
    }

    const savedPrompt = await this.agentRepository.savePrompt(prompt);

    if (savedPrompt.isDefault) {
      agent.defaultPromptId = savedPrompt.id;
      agent.updatedBy = creator;
      await this.agentRepository.save(agent);
    }

    return new AgentPromptResponseDto(savedPrompt);
  }

  async findPrompts(
    agentId: string,
    creator: string,
  ): Promise<AgentPromptResponseDto[]> {
    await this.findOwnedAgent(agentId, creator);
    const prompts = await this.agentRepository.findPromptsByAgent(
      agentId,
      creator,
    );

    return prompts.map((prompt) => new AgentPromptResponseDto(prompt));
  }

  async updatePrompt(
    agentId: string,
    promptId: string,
    updatePromptDto: UpdateAgentPromptDto,
    updater: string,
  ): Promise<AgentPromptResponseDto> {
    const agent = await this.findOwnedAgent(agentId, updater);
    const prompt = await this.findOwnedPrompt(promptId, agentId, updater);

    if (updatePromptDto.isDefault) {
      await this.agentRepository.unsetDefaultPrompts(agentId);
    }

    Object.assign(prompt, updatePromptDto);

    if (typeof updatePromptDto.temperature === 'number') {
      prompt.temperature = updatePromptDto.temperature.toFixed(2);
    }

    if (typeof updatePromptDto.topP === 'number') {
      prompt.topP = updatePromptDto.topP.toFixed(2);
    }

    const savedPrompt = await this.agentRepository.savePrompt(prompt);

    if (savedPrompt.isDefault) {
      agent.defaultPromptId = savedPrompt.id;
      agent.updatedBy = updater;
      await this.agentRepository.save(agent);
    } else if (agent.defaultPromptId === savedPrompt.id) {
      agent.defaultPromptId = null;
      agent.updatedBy = updater;
      await this.agentRepository.save(agent);
    }

    return new AgentPromptResponseDto(savedPrompt);
  }

  async removePrompt(
    agentId: string,
    promptId: string,
    updater: string,
  ): Promise<void> {
    const agent = await this.findOwnedAgent(agentId, updater);
    const prompt = await this.findOwnedPrompt(promptId, agentId, updater);

    prompt.isDeleted = true;
    prompt.isDefault = false;
    await this.agentRepository.savePrompt(prompt);

    if (agent.defaultPromptId === prompt.id) {
      agent.defaultPromptId = null;
      agent.updatedBy = updater;
      await this.agentRepository.save(agent);
    }
  }

  async bindSkill(
    agentId: string,
    bindSkillDto: BindAgentSkillDto,
    creator: string,
  ): Promise<AgentSkillBindingResponseDto> {
    await this.findOwnedAgent(agentId, creator);
    const skill = await this.agentRepository.findOwnedSkill(
      bindSkillDto.skillId,
      creator,
    );

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    await this.ensureSkillNotBound(agentId, skill.id);

    const binding = this.agentRepository.createSkillBinding(
      bindSkillDto,
      agentId,
      creator,
    );
    const savedBinding =
      await this.agentRepository.saveAgentSkillBinding(binding);

    savedBinding.skill = skill;
    return new AgentSkillBindingResponseDto(savedBinding);
  }

  async findSkillBindings(
    agentId: string,
    creator: string,
  ): Promise<AgentSkillBindingResponseDto[]> {
    await this.findOwnedAgent(agentId, creator);
    const bindings = await this.agentRepository.findAgentSkillBindings(
      agentId,
      creator,
    );

    return bindings.map((binding) => new AgentSkillBindingResponseDto(binding));
  }

  async updateSkillBinding(
    agentId: string,
    bindingId: string,
    dto: UpdateAgentSkillBindingDto,
    updater: string,
  ): Promise<AgentSkillBindingResponseDto> {
    await this.findOwnedAgent(agentId, updater);
    const binding = await this.findOwnedSkillBinding(
      bindingId,
      agentId,
      updater,
    );
    Object.assign(binding, dto);

    return new AgentSkillBindingResponseDto(
      await this.agentRepository.saveAgentSkillBinding(binding),
    );
  }

  async removeSkillBinding(
    agentId: string,
    bindingId: string,
    updater: string,
  ): Promise<void> {
    await this.findOwnedAgent(agentId, updater);
    const binding = await this.findOwnedSkillBinding(
      bindingId,
      agentId,
      updater,
    );
    binding.isDeleted = true;

    await this.agentRepository.saveAgentSkillBinding(binding);
  }

  async bindMcp(
    agentId: string,
    bindMcpDto: BindAgentMcpDto,
    creator: string,
  ): Promise<AgentMcpBindingResponseDto> {
    await this.findOwnedAgent(agentId, creator);
    const mcp = await this.agentRepository.findOwnedMcp(
      bindMcpDto.mcpId,
      creator,
    );

    if (!mcp) {
      throw new NotFoundException('MCP server not found');
    }

    await this.ensureMcpNotBound(agentId, mcp.id);

    const binding = this.agentRepository.createMcpBinding(
      bindMcpDto,
      agentId,
      creator,
    );
    const savedBinding =
      await this.agentRepository.saveAgentMcpBinding(binding);

    savedBinding.mcp = mcp;
    return new AgentMcpBindingResponseDto(savedBinding);
  }

  async findMcpBindings(
    agentId: string,
    creator: string,
  ): Promise<AgentMcpBindingResponseDto[]> {
    await this.findOwnedAgent(agentId, creator);
    const bindings = await this.agentRepository.findAgentMcpBindings(
      agentId,
      creator,
    );

    return bindings.map((binding) => new AgentMcpBindingResponseDto(binding));
  }

  async updateMcpBinding(
    agentId: string,
    bindingId: string,
    dto: UpdateAgentMcpBindingDto,
    updater: string,
  ): Promise<AgentMcpBindingResponseDto> {
    await this.findOwnedAgent(agentId, updater);
    const binding = await this.findOwnedMcpBinding(bindingId, agentId, updater);
    Object.assign(binding, dto);

    return new AgentMcpBindingResponseDto(
      await this.agentRepository.saveAgentMcpBinding(binding),
    );
  }

  async removeMcpBinding(
    agentId: string,
    bindingId: string,
    updater: string,
  ): Promise<void> {
    await this.findOwnedAgent(agentId, updater);
    const binding = await this.findOwnedMcpBinding(bindingId, agentId, updater);
    binding.isDeleted = true;

    await this.agentRepository.saveAgentMcpBinding(binding);
  }

  async bindAgent(
    mainAgentId: string,
    dto: BindAgentRelationDto,
    creator: string,
  ): Promise<AgentRelationResponseDto> {
    await this.findOwnedAgent(mainAgentId, creator);
    const subAgent = await this.findOwnedAgent(dto.subAgentId, creator);

    if (mainAgentId === subAgent.id) {
      throw new ConflictException('Agent cannot bind itself as a sub agent');
    }

    await this.ensureAgentNotBound(mainAgentId, subAgent.id);

    const relation = this.agentRepository.createAgentRelation(
      dto,
      mainAgentId,
      creator,
    );
    const savedRelation =
      await this.agentRepository.saveAgentRelation(relation);

    savedRelation.subAgent = subAgent;
    return new AgentRelationResponseDto(savedRelation);
  }

  async findAgentBindings(
    mainAgentId: string,
    creator: string,
  ): Promise<AgentRelationResponseDto[]> {
    await this.findOwnedAgent(mainAgentId, creator);
    const relations = await this.agentRepository.findAgentRelations(
      mainAgentId,
      creator,
    );

    return relations.map((relation) => new AgentRelationResponseDto(relation));
  }

  async updateAgentBinding(
    mainAgentId: string,
    relationId: string,
    dto: UpdateAgentRelationDto,
    updater: string,
  ): Promise<AgentRelationResponseDto> {
    await this.findOwnedAgent(mainAgentId, updater);
    const relation = await this.findOwnedAgentRelation(
      relationId,
      mainAgentId,
      updater,
    );

    if (dto.subAgentId && dto.subAgentId !== relation.subAgentId) {
      const subAgent = await this.findOwnedAgent(dto.subAgentId, updater);

      if (mainAgentId === subAgent.id) {
        throw new ConflictException('Agent cannot bind itself as a sub agent');
      }

      await this.ensureAgentNotBound(mainAgentId, subAgent.id);
      relation.subAgent = subAgent;
    }

    Object.assign(relation, dto);

    return new AgentRelationResponseDto(
      await this.agentRepository.saveAgentRelation(relation),
    );
  }

  async removeAgentBinding(
    mainAgentId: string,
    relationId: string,
    updater: string,
  ): Promise<void> {
    await this.findOwnedAgent(mainAgentId, updater);
    const relation = await this.findOwnedAgentRelation(
      relationId,
      mainAgentId,
      updater,
    );
    relation.isDeleted = true;

    await this.agentRepository.saveAgentRelation(relation);
  }

  private async ensureOwnedProject(
    projectId: string,
    creator: string,
  ): Promise<void> {
    const project = await this.agentRepository.findOwnedProject(
      projectId,
      creator,
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }
  }

  private async resolveOwnedModel(
    modelId: string | null | undefined,
    creator: string,
  ): Promise<LlmModel | null> {
    if (!modelId) {
      return null;
    }

    const model = await this.agentRepository.findOwnedModel(modelId, creator);

    if (!model) {
      throw new NotFoundException('Model not found');
    }

    return model;
  }

  private withModelDefaults(
    dto: CreateAgentDto,
    model: LlmModel | null,
  ): CreateAgentDto {
    if (!model) {
      return dto;
    }

    return {
      ...dto,
      llmModel: model.modelCode,
      maxContextLength: dto.maxContextLength ?? model.contextWindow,
    };
  }

  private async ensureUniqueCode(
    tenantId: string,
    agentCode: string,
  ): Promise<void> {
    const existing = await this.agentRepository.findByCode(tenantId, agentCode);

    if (existing) {
      throw new ConflictException('Agent code already exists');
    }
  }

  private async findOwnedAgent(id: string, creator: string) {
    const agent = await this.agentRepository.findOneByIdAndOwner(id, creator);

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return agent;
  }

  private async findOwnedPrompt(id: string, agentId: string, creator: string) {
    const prompt = await this.agentRepository.findPromptByIdAndAgent(
      id,
      agentId,
      creator,
    );

    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }

    return prompt;
  }

  private async ensureSkillNotBound(
    agentId: string,
    skillId: string,
  ): Promise<void> {
    const existing = await this.agentRepository.findAgentSkillBindingBySkill(
      agentId,
      skillId,
    );

    if (existing) {
      throw new ConflictException('Skill already bound to this agent');
    }
  }

  private async findOwnedSkillBinding(
    id: string,
    agentId: string,
    creator: string,
  ) {
    const binding = await this.agentRepository.findAgentSkillBinding(
      id,
      agentId,
      creator,
    );

    if (!binding) {
      throw new NotFoundException('Agent skill binding not found');
    }

    return binding;
  }

  private async ensureMcpNotBound(
    agentId: string,
    mcpId: string,
  ): Promise<void> {
    const existing = await this.agentRepository.findAgentMcpBindingByMcp(
      agentId,
      mcpId,
    );

    if (existing) {
      throw new ConflictException('MCP server already bound to this agent');
    }
  }

  private async findOwnedMcpBinding(
    id: string,
    agentId: string,
    creator: string,
  ) {
    const binding = await this.agentRepository.findAgentMcpBinding(
      id,
      agentId,
      creator,
    );

    if (!binding) {
      throw new NotFoundException('Agent MCP binding not found');
    }

    return binding;
  }

  private async ensureAgentNotBound(
    mainAgentId: string,
    subAgentId: string,
  ): Promise<void> {
    const existing = await this.agentRepository.findAgentRelationBySubAgent(
      mainAgentId,
      subAgentId,
    );

    if (existing) {
      throw new ConflictException('Sub agent already bound to this agent');
    }
  }

  private async findOwnedAgentRelation(
    id: string,
    mainAgentId: string,
    creator: string,
  ) {
    const relation = await this.agentRepository.findAgentRelation(
      id,
      mainAgentId,
      creator,
    );

    if (!relation) {
      throw new NotFoundException('Agent binding not found');
    }

    return relation;
  }

  private generateAgentCode(agentName: string): string {
    const normalized = agentName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40);
    const prefix = normalized || 'agent';
    const suffix = randomUUID().replace(/-/g, '').slice(0, 10);

    return `${prefix}_${suffix}`.slice(0, 64);
  }
}
