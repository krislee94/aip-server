import { AgentPrompt } from '../entities/agent-prompt.entity';

export class AgentPromptResponseDto {
  agentId: string;
  createdAt: Date;
  createdBy: string;
  id: string;
  isDefault: boolean;
  limitConstraint?: string;
  maxTokens: number;
  outputFormat?: string;
  promptName: string;
  promptVersion: string;
  roleDefinition?: string;
  status: number;
  systemPrompt: string;
  temperature: string;
  topP: string;
  updatedAt: Date;
  workBoundary?: string;

  constructor(prompt: AgentPrompt) {
    this.agentId = prompt.agentId;
    this.createdAt = prompt.createdAt;
    this.createdBy = prompt.createdBy;
    this.id = prompt.id;
    this.isDefault = prompt.isDefault;
    this.limitConstraint = prompt.limitConstraint;
    this.maxTokens = prompt.maxTokens;
    this.outputFormat = prompt.outputFormat;
    this.promptName = prompt.promptName;
    this.promptVersion = prompt.promptVersion;
    this.roleDefinition = prompt.roleDefinition;
    this.status = prompt.status;
    this.systemPrompt = prompt.systemPrompt;
    this.temperature = prompt.temperature;
    this.topP = prompt.topP;
    this.updatedAt = prompt.updatedAt;
    this.workBoundary = prompt.workBoundary;
  }
}
