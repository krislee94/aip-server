import { Agent } from '../entities/agent.entity';
import { ModelResponseDto } from '../../model/dto/model-response.dto';

export class AgentResponseDto {
  agentCode: string;
  agentDesc?: string;
  agentName: string;
  agentType: Agent['agentType'];
  apiKeyRef: string;
  avatar: string;
  createdAt: Date;
  createdBy: string;
  id: string;
  llmModel: string;
  llmModelId?: string | null;
  maxContextLength: number;
  model?: ModelResponseDto;
  projectId: string;
  publishingChannel: string;
  runMode: Agent['runMode'];
  status: Agent['status'];
  supportsSubAgents: boolean;
  timeoutSeconds: number;
  updatedAt: Date;
  updatedBy?: string;
  version: string;

  constructor(agent: Agent) {
    this.agentCode = agent.agentCode;
    this.agentDesc = agent.agentDesc;
    this.agentName = agent.agentName;
    this.agentType = agent.agentType;
    this.apiKeyRef = agent.apiKeyRef;
    this.avatar = agent.avatar;
    this.createdAt = agent.createdAt;
    this.createdBy = agent.createdBy;
    this.id = agent.id;
    this.llmModel = agent.llmModel;
    this.llmModelId = agent.llmModelId;
    this.maxContextLength = agent.maxContextLength;
    this.model = agent.llmModelConfig
      ? new ModelResponseDto(agent.llmModelConfig)
      : undefined;
    this.projectId = agent.projectId;
    this.publishingChannel = agent.publishingChannel;
    this.runMode = agent.runMode;
    this.status = agent.status;
    this.supportsSubAgents = agent.supportsSubAgents;
    this.timeoutSeconds = agent.timeoutSeconds;
    this.updatedAt = agent.updatedAt;
    this.updatedBy = agent.updatedBy;
    this.version = agent.version;
  }
}
