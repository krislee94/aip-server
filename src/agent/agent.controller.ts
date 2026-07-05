import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/interfaces/auth-response.interface';
import { AgentService } from './agent.service';
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

@Controller('agents')
@UseGuards(JwtAuthGuard)
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  create(
    @Body() createAgentDto: CreateAgentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.create(createAgentDto, user.id);
  }

  @Get()
  findAll(@Query() query: FindAgentsQueryDto, @CurrentUser() user: AuthUser) {
    return this.agentService.findAll(query, user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAgentDto: UpdateAgentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.update(id, updateAgentDto, user.id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.remove(id, user.id);
  }

  @Post(':id/prompts')
  createPrompt(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createPromptDto: CreateAgentPromptDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.createPrompt(id, createPromptDto, user.id);
  }

  @Get(':id/prompts')
  findPrompts(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.findPrompts(id, user.id);
  }

  @Patch(':id/prompts/:promptId')
  updatePrompt(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('promptId', ParseUUIDPipe) promptId: string,
    @Body() updatePromptDto: UpdateAgentPromptDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.updatePrompt(
      id,
      promptId,
      updatePromptDto,
      user.id,
    );
  }

  @Delete(':id/prompts/:promptId')
  removePrompt(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('promptId', ParseUUIDPipe) promptId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.removePrompt(id, promptId, user.id);
  }

  @Post(':id/skills')
  bindSkill(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() bindSkillDto: BindAgentSkillDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.bindSkill(id, bindSkillDto, user.id);
  }

  @Get(':id/skills')
  findSkillBindings(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.findSkillBindings(id, user.id);
  }

  @Patch(':id/skills/:bindingId')
  updateSkillBinding(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('bindingId', ParseUUIDPipe) bindingId: string,
    @Body() updateBindingDto: UpdateAgentSkillBindingDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.updateSkillBinding(
      id,
      bindingId,
      updateBindingDto,
      user.id,
    );
  }

  @Delete(':id/skills/:bindingId')
  removeSkillBinding(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('bindingId', ParseUUIDPipe) bindingId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.removeSkillBinding(id, bindingId, user.id);
  }

  @Post(':id/mcp')
  bindMcp(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() bindMcpDto: BindAgentMcpDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.bindMcp(id, bindMcpDto, user.id);
  }

  @Get(':id/mcp')
  findMcpBindings(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.findMcpBindings(id, user.id);
  }

  @Patch(':id/mcp/:bindingId')
  updateMcpBinding(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('bindingId', ParseUUIDPipe) bindingId: string,
    @Body() updateBindingDto: UpdateAgentMcpBindingDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.updateMcpBinding(
      id,
      bindingId,
      updateBindingDto,
      user.id,
    );
  }

  @Delete(':id/mcp/:bindingId')
  removeMcpBinding(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('bindingId', ParseUUIDPipe) bindingId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.removeMcpBinding(id, bindingId, user.id);
  }

  @Post(':id/relations')
  bindAgent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() bindAgentDto: BindAgentRelationDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.bindAgent(id, bindAgentDto, user.id);
  }

  @Get(':id/relations')
  findAgentBindings(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.findAgentBindings(id, user.id);
  }

  @Patch(':id/relations/:relationId')
  updateAgentBinding(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('relationId', ParseUUIDPipe) relationId: string,
    @Body() updateBindingDto: UpdateAgentRelationDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.updateAgentBinding(
      id,
      relationId,
      updateBindingDto,
      user.id,
    );
  }

  @Delete(':id/relations/:relationId')
  removeAgentBinding(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('relationId', ParseUUIDPipe) relationId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.agentService.removeAgentBinding(id, relationId, user.id);
  }
}
