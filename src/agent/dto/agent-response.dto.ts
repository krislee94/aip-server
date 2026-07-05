import { Agent } from '../entities/agent.entity';

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
  maxContextLength: number;
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
    this.maxContextLength = agent.maxContextLength;
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
