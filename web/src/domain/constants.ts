import type {
  AgentForm,
  AgentRunMode,
  AgentRelationForm,
  AgentStatus,
  AgentType,
  DetailTab,
  McpBindingForm,
  McpForm,
  McpStatus,
  McpTransportType,
  ModelForm,
  ModelStatus,
  ModelType,
  ProjectForm,
  ProjectStatus,
  PromptForm,
  SkillBindingForm,
  SkillForm,
  SkillStatus,
  SkillType,
  View,
} from './types';

export const tokenStorageKey = 'platform_access_token';

export const emptyProjectForm: ProjectForm = {
  description: '',
  name: '',
  status: 'draft',
};

export const emptyAgentForm: AgentForm = {
  agentCode: '',
  agentDesc: '',
  agentName: '',
  agentType: 'standalone',
  llmModel: '',
  llmModelId: '',
  maxContextLength: 8000,
  runMode: 'sync',
  status: 'draft',
  supportsSubAgents: false,
  timeoutSeconds: 30,
};

export const emptyModelForm: ModelForm = {
  apiKeyRef: '',
  baseUrl: '',
  contextWindow: 8192,
  defaultParams: '',
  modelCode: '',
  modelName: '',
  modelType: 1,
  priceInput: '0',
  priceOutput: '0',
  secretKey: '',
  status: 1,
  supportFunctionCall: false,
  supportStream: true,
  vendor: 'openai',
};

export const emptyPromptForm: PromptForm = {
  isDefault: false,
  outputFormat: '',
  promptName: '',
  promptVersion: '1.0.0',
  roleDefinition: '',
  systemPrompt: '',
};

export const emptySkillForm: SkillForm = {
  invokeConfig: '',
  skillCode: '',
  skillDesc: '',
  skillName: '',
  skillType: 'http_api',
  status: 'enabled',
};

export const emptySkillBindingForm: SkillBindingForm = {
  aliasName: '',
  skillId: '',
};

export const emptyMcpForm: McpForm = {
  endpoint: '',
  mcpCode: '',
  mcpDesc: '',
  mcpName: '',
  status: 'enabled',
  toolList: '',
  transportType: 'http',
};

export const emptyMcpBindingForm: McpBindingForm = {
  allowTools: '',
  mcpId: '',
};

export const emptyAgentRelationForm: AgentRelationForm = {
  relName: '',
  subAgentId: '',
};

export const appNavItems: Array<{
  code: string;
  label: string;
  view: Extract<View, 'home' | 'models' | 'projects'>;
}> = [
  { code: '01', label: '首页总览', view: 'home' },
  { code: '02', label: '项目管理', view: 'projects' },
  { code: '03', label: '模型中心', view: 'models' },
];

export const projectStatusLabels: Record<ProjectStatus, string> = {
  active: '进行中',
  archived: '已归档',
  draft: '草稿',
};

export const agentStatusLabels: Record<AgentStatus, string> = {
  disabled: '禁用',
  draft: '草稿',
  enabled: '启用',
  offline: '已下线',
  pending_publish: '待发布',
  published: '已发布',
};

export const agentTypeLabels: Record<AgentType, string> = {
  orchestrator: '主 Agent',
  standalone: '独立 Agent',
  sub: '子 Agent',
};

export const agentRunModeLabels: Record<AgentRunMode, string> = {
  async: '异步',
  sync: '同步',
};

export const skillTypeLabels: Record<SkillType, string> = {
  builtin_function: '内置函数',
  custom_script: '自定义脚本',
  database_query: '数据库查询',
  http_api: 'HTTP 接口',
};

export const statusLabels: Record<SkillStatus | McpStatus, string> = {
  disabled: '禁用',
  enabled: '启用',
};

export const mcpTransportLabels: Record<McpTransportType, string> = {
  http: 'HTTP',
  sse: 'SSE',
  stdio: 'stdio',
};

export const modelTypeLabels: Record<ModelType, string> = {
  1: '对话 LLM',
  2: '向量 Embedding',
  3: '图像生成',
  4: '语音',
};

export const modelStatusLabels: Record<ModelStatus, string> = {
  0: '禁用',
  1: '正常',
  2: '维护中',
};

export const detailTabLabels: Record<DetailTab, string> = {
  agents: '智能体',
  mcp: 'MCP',
  prompts: 'Prompt',
  skills: 'Skill',
};
