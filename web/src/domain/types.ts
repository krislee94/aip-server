export type AgentRunMode = 'async' | 'sync';
export type AgentStatus =
  | 'disabled'
  | 'draft'
  | 'enabled'
  | 'offline'
  | 'pending_publish'
  | 'published';
export type AgentType = 'orchestrator' | 'standalone' | 'sub';
export type DetailTab = 'agents' | 'mcp' | 'prompts' | 'skills';
export type McpStatus = 'disabled' | 'enabled';
export type McpTransportType = 'http' | 'sse' | 'stdio';
export type AuthMode = 'login' | 'register';
export type ModelStatus = 0 | 1 | 2;
export type ModelType = 1 | 2 | 3 | 4;
export type ProjectStatus = 'active' | 'archived' | 'draft';
export type SkillStatus = 'disabled' | 'enabled';
export type SkillType =
  | 'builtin_function'
  | 'custom_script'
  | 'database_query'
  | 'http_api';
export type View = 'agent' | 'home' | 'models' | 'projects';

export interface AuthUser {
  email: string;
  id: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  user: AuthUser;
}

export interface Project {
  createdAt: string;
  createdBy: string;
  description?: string | null;
  id: string;
  isActive: boolean;
  name: string;
  status: ProjectStatus;
  updatedAt: string;
}

export interface Agent {
  agentCode: string;
  agentDesc?: string | null;
  agentName: string;
  agentType: AgentType;
  apiKeyRef: string;
  avatar: string;
  createdAt: string;
  createdBy: string;
  id: string;
  llmModel: string;
  llmModelId?: string | null;
  maxContextLength: number;
  model?: LlmModel;
  projectId: string;
  publishingChannel: string;
  runMode: AgentRunMode;
  status: AgentStatus;
  supportsSubAgents: boolean;
  timeoutSeconds: number;
  updatedAt: string;
  updatedBy?: string | null;
  version: string;
}

export interface LlmModel {
  apiKeyRef: string;
  baseUrl: string;
  contextWindow: number;
  createdAt: string;
  createdBy: string;
  defaultParams?: string | null;
  hasSecretKey: boolean;
  id: string;
  modelCode: string;
  modelName: string;
  modelType: ModelType;
  priceInput: string;
  priceOutput: string;
  status: ModelStatus;
  supportFunctionCall: boolean;
  supportStream: boolean;
  updatedAt: string;
  updatedBy?: string | null;
  vendor: string;
}

export interface AgentPrompt {
  agentId: string;
  id: string;
  isDefault: boolean;
  outputFormat?: string | null;
  promptName: string;
  promptVersion: string;
  roleDefinition?: string | null;
  status: number;
  systemPrompt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  invokeConfig?: string | null;
  skillCode: string;
  skillDesc?: string | null;
  skillName: string;
  skillType: SkillType;
  status: SkillStatus;
}

export interface AgentSkillBinding {
  aliasName: string;
  enableFlag: boolean;
  id: string;
  invokeFilter?: string | null;
  skill?: Skill;
  skillId: string;
  sort: number;
}

export interface McpServer {
  endpoint: string;
  id: string;
  mcpCode: string;
  mcpDesc?: string | null;
  mcpName: string;
  status: McpStatus;
  toolList?: string | null;
  transportType: McpTransportType;
}

export interface AgentMcpBinding {
  allowTools?: string | null;
  denyTools?: string | null;
  enableFlag: boolean;
  id: string;
  mcp?: McpServer;
  mcpId: string;
  sort: number;
}

export interface AgentRelation {
  id: string;
  mainAgentId: string;
  relName: string;
  sort: number;
  status: number;
  subAgent?: Agent;
  subAgentId: string;
}

export interface ProjectForm {
  description: string;
  name: string;
  status: ProjectStatus;
}

export interface AgentForm {
  agentCode: string;
  agentDesc: string;
  agentName: string;
  agentType: AgentType;
  llmModel: string;
  llmModelId: string;
  maxContextLength: number;
  runMode: AgentRunMode;
  status: AgentStatus;
  supportsSubAgents: boolean;
  timeoutSeconds: number;
}

export interface ModelForm {
  apiKeyRef: string;
  baseUrl: string;
  contextWindow: number;
  defaultParams: string;
  modelCode: string;
  modelName: string;
  modelType: ModelType;
  priceInput: string;
  priceOutput: string;
  secretKey: string;
  status: ModelStatus;
  supportFunctionCall: boolean;
  supportStream: boolean;
  vendor: string;
}

export interface PromptForm {
  isDefault: boolean;
  outputFormat: string;
  promptName: string;
  promptVersion: string;
  roleDefinition: string;
  systemPrompt: string;
}

export interface SkillForm {
  invokeConfig: string;
  skillCode: string;
  skillDesc: string;
  skillName: string;
  skillType: SkillType;
  status: SkillStatus;
}

export interface SkillBindingForm {
  aliasName: string;
  skillId: string;
}

export interface McpForm {
  endpoint: string;
  mcpCode: string;
  mcpDesc: string;
  mcpName: string;
  status: McpStatus;
  toolList: string;
  transportType: McpTransportType;
}

export interface McpBindingForm {
  allowTools: string;
  mcpId: string;
}

export interface AgentRelationForm {
  relName: string;
  subAgentId: string;
}
