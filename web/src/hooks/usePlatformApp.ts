import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  emptyAgentForm,
  emptyAgentRelationForm,
  emptyMcpBindingForm,
  emptyMcpForm,
  emptyModelForm,
  emptyProjectForm,
  emptyPromptForm,
  emptySkillBindingForm,
  emptySkillForm,
  tokenStorageKey,
} from '../domain/constants';
import type {
  Agent,
  AgentMcpBinding,
  AgentPrompt,
  AgentRelation,
  AgentSkillBinding,
  AuthMode,
  AuthResponse,
  AuthUser,
  DetailTab,
  LlmModel,
  McpServer,
  Project,
  Skill,
  View,
} from '../domain/types';
import { authHeaders, getErrorMessage, requestJson } from '../lib/api';

function optional(value: string): string | undefined {
  return value || undefined;
}

function optionalNumber(value: string): number | undefined {
  if (value.trim() === '') {
    return undefined;
  }

  return Number(value);
}

export function usePlatformApp() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(
    () => localStorage.getItem(tokenStorageKey) ?? '',
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(Boolean(token));
  const [view, setView] = useState<View>('home');
  const [detailTab, setDetailTab] = useState<DetailTab>('agents');

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [editingProjectId, setEditingProjectId] = useState('');
  const [projectMessage, setProjectMessage] = useState('');
  const [isProjectLoading, setIsProjectLoading] = useState(false);
  const [isProjectSaving, setIsProjectSaving] = useState(false);

  const [models, setModels] = useState<LlmModel[]>([]);
  const [modelForm, setModelForm] = useState(emptyModelForm);
  const [editingModelId, setEditingModelId] = useState('');
  const [modelMessage, setModelMessage] = useState('');
  const [isModelLoading, setIsModelLoading] = useState(false);

  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [agentForm, setAgentForm] = useState(emptyAgentForm);
  const [editingAgentId, setEditingAgentId] = useState('');
  const [agentMessage, setAgentMessage] = useState('');
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [isAgentSaving, setIsAgentSaving] = useState(false);

  const [prompts, setPrompts] = useState<AgentPrompt[]>([]);
  const [promptForm, setPromptForm] = useState(emptyPromptForm);
  const [editingPromptId, setEditingPromptId] = useState('');
  const [promptMessage, setPromptMessage] = useState('');

  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillForm, setSkillForm] = useState(emptySkillForm);
  const [editingSkillId, setEditingSkillId] = useState('');
  const [skillBindings, setSkillBindings] = useState<AgentSkillBinding[]>([]);
  const [skillBindingForm, setSkillBindingForm] = useState(
    emptySkillBindingForm,
  );
  const [skillMessage, setSkillMessage] = useState('');

  const [mcpServers, setMcpServers] = useState<McpServer[]>([]);
  const [mcpForm, setMcpForm] = useState(emptyMcpForm);
  const [editingMcpId, setEditingMcpId] = useState('');
  const [mcpBindings, setMcpBindings] = useState<AgentMcpBinding[]>([]);
  const [mcpBindingForm, setMcpBindingForm] = useState(emptyMcpBindingForm);
  const [mcpMessage, setMcpMessage] = useState('');

  const [agentRelations, setAgentRelations] = useState<AgentRelation[]>([]);
  const [agentRelationForm, setAgentRelationForm] = useState(
    emptyAgentRelationForm,
  );
  const [agentRelationMessage, setAgentRelationMessage] = useState('');

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId),
    [projects, selectedProjectId],
  );
  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId),
    [agents, selectedAgentId],
  );
  const relationCandidates = useMemo(
    () => agents.filter((agent) => agent.id !== selectedAgentId),
    [agents, selectedAgentId],
  );
  const activeProjectsCount = useMemo(
    () => projects.filter((project) => project.status === 'active').length,
    [projects],
  );
  const enabledAgentsCount = useMemo(
    () =>
      agents.filter(
        (agent) => agent.status === 'enabled' || agent.status === 'published',
      ).length,
    [agents],
  );
  const enabledModelsCount = useMemo(
    () => models.filter((model) => model.status === 1).length,
    [models],
  );

  const loadProjects = useCallback(
    async (accessToken = token): Promise<Project[]> => {
      if (!accessToken) {
        setProjects([]);
        return [];
      }

      setIsProjectLoading(true);

      try {
        const data = await requestJson<Project[]>('/projects', {
          headers: authHeaders(accessToken),
        });
        setProjects(data);
        return data;
      } catch (error) {
        setProjectMessage(getErrorMessage(error));
        return [];
      } finally {
        setIsProjectLoading(false);
      }
    },
    [token],
  );

  const loadModels = useCallback(
    async (accessToken = token): Promise<LlmModel[]> => {
      if (!accessToken) {
        setModels([]);
        return [];
      }

      setIsModelLoading(true);

      try {
        const data = await requestJson<LlmModel[]>('/models', {
          headers: authHeaders(accessToken),
        });
        setModels(data);
        return data;
      } catch (error) {
        setModelMessage(getErrorMessage(error));
        return [];
      } finally {
        setIsModelLoading(false);
      }
    },
    [token],
  );

  const loadAgents = useCallback(
    async (
      projectId = selectedProjectId,
      accessToken = token,
    ): Promise<Agent[]> => {
      if (!accessToken || !projectId) {
        setAgents([]);
        return [];
      }

      setIsAgentLoading(true);

      try {
        const query = new URLSearchParams({ projectId }).toString();
        const data = await requestJson<Agent[]>(`/agents?${query}`, {
          headers: authHeaders(accessToken),
        });
        setAgents(data);
        return data;
      } catch (error) {
        setAgentMessage(getErrorMessage(error));
        return [];
      } finally {
        setIsAgentLoading(false);
      }
    },
    [selectedProjectId, token],
  );

  const loadPrompts = useCallback(
    async (agentId = selectedAgentId, accessToken = token) => {
      if (!accessToken || !agentId) {
        setPrompts([]);
        return [];
      }

      try {
        const data = await requestJson<AgentPrompt[]>(
          `/agents/${agentId}/prompts`,
          { headers: authHeaders(accessToken) },
        );
        setPrompts(data);
        return data;
      } catch (error) {
        setPromptMessage(getErrorMessage(error));
        return [];
      }
    },
    [selectedAgentId, token],
  );

  const loadSkills = useCallback(
    async (accessToken = token) => {
      if (!accessToken) {
        setSkills([]);
        return [];
      }

      try {
        const data = await requestJson<Skill[]>('/skills', {
          headers: authHeaders(accessToken),
        });
        setSkills(data);
        return data;
      } catch (error) {
        setSkillMessage(getErrorMessage(error));
        return [];
      }
    },
    [token],
  );

  const loadSkillBindings = useCallback(
    async (agentId = selectedAgentId, accessToken = token) => {
      if (!accessToken || !agentId) {
        setSkillBindings([]);
        return [];
      }

      try {
        const data = await requestJson<AgentSkillBinding[]>(
          `/agents/${agentId}/skills`,
          { headers: authHeaders(accessToken) },
        );
        setSkillBindings(data);
        return data;
      } catch (error) {
        setSkillMessage(getErrorMessage(error));
        return [];
      }
    },
    [selectedAgentId, token],
  );

  const loadMcpServers = useCallback(
    async (accessToken = token) => {
      if (!accessToken) {
        setMcpServers([]);
        return [];
      }

      try {
        const data = await requestJson<McpServer[]>('/mcp', {
          headers: authHeaders(accessToken),
        });
        setMcpServers(data);
        return data;
      } catch (error) {
        setMcpMessage(getErrorMessage(error));
        return [];
      }
    },
    [token],
  );

  const loadMcpBindings = useCallback(
    async (agentId = selectedAgentId, accessToken = token) => {
      if (!accessToken || !agentId) {
        setMcpBindings([]);
        return [];
      }

      try {
        const data = await requestJson<AgentMcpBinding[]>(
          `/agents/${agentId}/mcp`,
          { headers: authHeaders(accessToken) },
        );
        setMcpBindings(data);
        return data;
      } catch (error) {
        setMcpMessage(getErrorMessage(error));
        return [];
      }
    },
    [selectedAgentId, token],
  );

  const loadAgentRelations = useCallback(
    async (agentId = selectedAgentId, accessToken = token) => {
      if (!accessToken || !agentId) {
        setAgentRelations([]);
        return [];
      }

      try {
        const data = await requestJson<AgentRelation[]>(
          `/agents/${agentId}/relations`,
          { headers: authHeaders(accessToken) },
        );
        setAgentRelations(data);
        return data;
      } catch (error) {
        setAgentRelationMessage(getErrorMessage(error));
        return [];
      }
    },
    [selectedAgentId, token],
  );

  useEffect(() => {
    if (!token) {
      setUser(null);
      setProjects([]);
      setModels([]);
      setAgents([]);
      setIsCheckingSession(false);
      return;
    }

    let isActive = true;
    setIsCheckingSession(true);
    setIsProjectLoading(true);
    setIsModelLoading(true);

    void Promise.all([
      requestJson<AuthUser>('/auth/me', {
        headers: authHeaders(token),
      }),
      requestJson<Project[]>('/projects', {
        headers: authHeaders(token),
      }),
      requestJson<LlmModel[]>('/models', {
        headers: authHeaders(token),
      }),
    ])
      .then(([currentUser, projectData, modelData]) => {
        if (!isActive) {
          return;
        }

        setUser(currentUser);
        setProjects(projectData);
        setModels(modelData);
        setMessage('会话已恢复');
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        localStorage.removeItem(tokenStorageKey);
        setToken('');
        setUser(null);
        setProjects([]);
        setModels([]);
        setAgents([]);
      })
      .finally(() => {
        if (!isActive) {
          return;
        }

        setIsProjectLoading(false);
        setIsModelLoading(false);
        setIsCheckingSession(false);
      });

    return () => {
      isActive = false;
    };
  }, [token]);

  useEffect(() => {
    if (agents.length === 0) {
      setSelectedAgentId('');
      return;
    }

    if (!agents.some((agent) => agent.id === selectedAgentId)) {
      setSelectedAgentId(agents[0].id);
    }
  }, [agents, selectedAgentId]);

  useEffect(() => {
    if (!token || (view !== 'agent' && view !== 'models')) {
      return;
    }

    if (view === 'models') {
      void loadModels(token);
      return;
    }

    void Promise.all([
      loadModels(token),
      loadSkills(token),
      loadMcpServers(token),
    ]);
  }, [loadMcpServers, loadModels, loadSkills, token, view]);

  useEffect(() => {
    if (!token || !selectedAgentId || !user) {
      setPrompts([]);
      setSkillBindings([]);
      setMcpBindings([]);
      setAgentRelations([]);
      return;
    }

    void Promise.all([
      loadPrompts(selectedAgentId, token),
      loadSkillBindings(selectedAgentId, token),
      loadMcpBindings(selectedAgentId, token),
      loadAgentRelations(selectedAgentId, token),
    ]);
  }, [
    loadAgentRelations,
    loadMcpBindings,
    loadPrompts,
    loadSkillBindings,
    selectedAgentId,
    token,
    user,
  ]);

  useEffect(() => {
    setAgentRelationForm(emptyAgentRelationForm);
    setAgentRelationMessage('');
  }, [selectedAgentId]);

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const payload =
        authMode === 'login' ? { email, password } : { email, name, password };
      const auth = await requestJson<AuthResponse>(`/auth/${authMode}`, {
        body: JSON.stringify(payload),
        method: 'POST',
      });

      localStorage.setItem(tokenStorageKey, auth.accessToken);
      setToken(auth.accessToken);
      setUser(auth.user);
      setView('home');
      setMessage(authMode === 'login' ? '已登录' : '账号已创建');
      setPassword('');
      await Promise.all([
        loadProjects(auth.accessToken),
        loadModels(auth.accessToken),
      ]);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleProjectSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    const isEditing = Boolean(editingProjectId);
    setIsProjectSaving(true);
    setProjectMessage('');

    try {
      const savedProject = await requestJson<Project>(
        isEditing ? `/projects/${editingProjectId}` : '/projects',
        {
          body: JSON.stringify({
            description: optional(projectForm.description),
            name: projectForm.name,
            status: projectForm.status,
          }),
          headers: authHeaders(token),
          method: isEditing ? 'PATCH' : 'POST',
        },
      );
      const data = await loadProjects(token);

      setProjectForm(emptyProjectForm);
      setEditingProjectId('');
      setSelectedProjectId(savedProject.id);
      setProjectMessage(isEditing ? '项目已更新' : '项目已创建');

      if (!isEditing && data.length > 0) {
        setView('home');
      }
    } catch (error) {
      setProjectMessage(getErrorMessage(error));
    } finally {
      setIsProjectSaving(false);
    }
  }

  async function handleProjectDelete(projectId: string) {
    if (!token || !window.confirm('确认删除这个项目？')) {
      return;
    }

    try {
      await requestJson<void>(`/projects/${projectId}`, {
        headers: authHeaders(token),
        method: 'DELETE',
      });
      await loadProjects(token);

      if (selectedProjectId === projectId) {
        setSelectedProjectId('');
        setAgents([]);
        setSelectedAgentId('');
        setView('home');
      }

      setProjectMessage('项目已删除');
    } catch (error) {
      setProjectMessage(getErrorMessage(error));
    }
  }

  async function handleModelSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    const isEditing = Boolean(editingModelId);
    setModelMessage('');

    try {
      await requestJson<LlmModel>(
        isEditing ? `/models/${editingModelId}` : '/models',
        {
          body: JSON.stringify({
            apiKeyRef: optional(modelForm.apiKeyRef),
            baseUrl: optional(modelForm.baseUrl),
            contextWindow: modelForm.contextWindow,
            defaultParams: optional(modelForm.defaultParams),
            modelCode: optional(modelForm.modelCode),
            modelName: modelForm.modelName,
            modelType: modelForm.modelType,
            priceInput: optionalNumber(modelForm.priceInput),
            priceOutput: optionalNumber(modelForm.priceOutput),
            secretKey: optional(modelForm.secretKey),
            status: modelForm.status,
            supportFunctionCall: modelForm.supportFunctionCall,
            supportStream: modelForm.supportStream,
            vendor: modelForm.vendor,
          }),
          headers: authHeaders(token),
          method: isEditing ? 'PATCH' : 'POST',
        },
      );
      await loadModels(token);
      setModelForm(emptyModelForm);
      setEditingModelId('');
      setModelMessage(isEditing ? '模型已更新' : '模型已创建');
    } catch (error) {
      setModelMessage(getErrorMessage(error));
    }
  }

  async function handleModelDelete(modelId: string) {
    if (!token || !window.confirm('确认删除这个模型？')) {
      return;
    }

    try {
      await requestJson<void>(`/models/${modelId}`, {
        headers: authHeaders(token),
        method: 'DELETE',
      });
      await loadModels(token);
      setModelMessage('模型已删除');
    } catch (error) {
      setModelMessage(getErrorMessage(error));
    }
  }

  async function handleAgentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !selectedProject) {
      return;
    }

    const isEditing = Boolean(editingAgentId);
    setIsAgentSaving(true);
    setAgentMessage('');

    try {
      const savedAgent = await requestJson<Agent>(
        isEditing ? `/agents/${editingAgentId}` : '/agents',
        {
          body: JSON.stringify({
            agentCode: optional(agentForm.agentCode),
            agentDesc: optional(agentForm.agentDesc),
            agentName: agentForm.agentName,
            agentType: agentForm.agentType,
            llmModel: optional(agentForm.llmModel),
            llmModelId: agentForm.llmModelId || null,
            maxContextLength: agentForm.maxContextLength,
            projectId: selectedProject.id,
            runMode: agentForm.runMode,
            status: agentForm.status,
            supportsSubAgents: agentForm.supportsSubAgents,
            timeoutSeconds: agentForm.timeoutSeconds,
          }),
          headers: authHeaders(token),
          method: isEditing ? 'PATCH' : 'POST',
        },
      );

      await loadAgents(selectedProject.id, token);
      setAgentForm(emptyAgentForm);
      setEditingAgentId('');
      setSelectedAgentId(savedAgent.id);
      setAgentMessage(isEditing ? '智能体已更新' : '智能体已创建');
    } catch (error) {
      setAgentMessage(getErrorMessage(error));
    } finally {
      setIsAgentSaving(false);
    }
  }

  async function handleAgentDelete(agentId: string) {
    if (!token || !selectedProject || !window.confirm('确认删除这个智能体？')) {
      return;
    }

    try {
      await requestJson<void>(`/agents/${agentId}`, {
        headers: authHeaders(token),
        method: 'DELETE',
      });
      await loadAgents(selectedProject.id, token);

      if (editingAgentId === agentId) {
        setEditingAgentId('');
        setAgentForm(emptyAgentForm);
      }

      setAgentMessage('智能体已删除');
    } catch (error) {
      setAgentMessage(getErrorMessage(error));
    }
  }

  async function handlePromptSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !selectedAgentId) {
      return;
    }

    const isEditing = Boolean(editingPromptId);
    setPromptMessage('');

    try {
      await requestJson<AgentPrompt>(
        isEditing
          ? `/agents/${selectedAgentId}/prompts/${editingPromptId}`
          : `/agents/${selectedAgentId}/prompts`,
        {
          body: JSON.stringify({
            isDefault: promptForm.isDefault,
            outputFormat: optional(promptForm.outputFormat),
            promptName: promptForm.promptName,
            promptVersion: optional(promptForm.promptVersion),
            roleDefinition: optional(promptForm.roleDefinition),
            systemPrompt: promptForm.systemPrompt,
          }),
          headers: authHeaders(token),
          method: isEditing ? 'PATCH' : 'POST',
        },
      );
      await loadPrompts(selectedAgentId, token);
      setPromptForm(emptyPromptForm);
      setEditingPromptId('');
      setPromptMessage(isEditing ? 'Prompt 已更新' : 'Prompt 已创建');
    } catch (error) {
      setPromptMessage(getErrorMessage(error));
    }
  }

  async function handlePromptDelete(promptId: string) {
    if (!token || !selectedAgentId || !window.confirm('确认删除这个 Prompt？')) {
      return;
    }

    try {
      await requestJson<void>(
        `/agents/${selectedAgentId}/prompts/${promptId}`,
        {
          headers: authHeaders(token),
          method: 'DELETE',
        },
      );
      await loadPrompts(selectedAgentId, token);
      setPromptMessage('Prompt 已删除');
    } catch (error) {
      setPromptMessage(getErrorMessage(error));
    }
  }

  async function handleSkillSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    const isEditing = Boolean(editingSkillId);
    setSkillMessage('');

    try {
      await requestJson<Skill>(
        isEditing ? `/skills/${editingSkillId}` : '/skills',
        {
          body: JSON.stringify({
            invokeConfig: optional(skillForm.invokeConfig),
            skillCode: optional(skillForm.skillCode),
            skillDesc: optional(skillForm.skillDesc),
            skillName: skillForm.skillName,
            skillType: skillForm.skillType,
            status: skillForm.status,
          }),
          headers: authHeaders(token),
          method: isEditing ? 'PATCH' : 'POST',
        },
      );
      await loadSkills(token);
      setSkillForm(emptySkillForm);
      setEditingSkillId('');
      setSkillMessage(isEditing ? 'Skill 已更新' : 'Skill 已创建');
    } catch (error) {
      setSkillMessage(getErrorMessage(error));
    }
  }

  async function handleSkillDelete(skillId: string) {
    if (!token || !window.confirm('确认删除这个 Skill？')) {
      return;
    }

    try {
      await requestJson<void>(`/skills/${skillId}`, {
        headers: authHeaders(token),
        method: 'DELETE',
      });
      await loadSkills(token);
      setSkillMessage('Skill 已删除');
    } catch (error) {
      setSkillMessage(getErrorMessage(error));
    }
  }

  async function handleSkillBind(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !selectedAgentId || !skillBindingForm.skillId) {
      return;
    }

    try {
      await requestJson<AgentSkillBinding>(`/agents/${selectedAgentId}/skills`, {
        body: JSON.stringify({
          aliasName: optional(skillBindingForm.aliasName),
          skillId: skillBindingForm.skillId,
        }),
        headers: authHeaders(token),
        method: 'POST',
      });
      await loadSkillBindings(selectedAgentId, token);
      setSkillBindingForm(emptySkillBindingForm);
      setSkillMessage('Skill 已绑定');
    } catch (error) {
      setSkillMessage(getErrorMessage(error));
    }
  }

  async function handleSkillUnbind(bindingId: string) {
    if (!token || !selectedAgentId) {
      return;
    }

    try {
      await requestJson<void>(`/agents/${selectedAgentId}/skills/${bindingId}`, {
        headers: authHeaders(token),
        method: 'DELETE',
      });
      await loadSkillBindings(selectedAgentId, token);
      setSkillMessage('Skill 绑定已移除');
    } catch (error) {
      setSkillMessage(getErrorMessage(error));
    }
  }

  async function handleMcpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    const isEditing = Boolean(editingMcpId);
    setMcpMessage('');

    try {
      await requestJson<McpServer>(
        isEditing ? `/mcp/${editingMcpId}` : '/mcp',
        {
          body: JSON.stringify({
            endpoint: optional(mcpForm.endpoint),
            mcpCode: optional(mcpForm.mcpCode),
            mcpDesc: optional(mcpForm.mcpDesc),
            mcpName: mcpForm.mcpName,
            status: mcpForm.status,
            toolList: optional(mcpForm.toolList),
            transportType: mcpForm.transportType,
          }),
          headers: authHeaders(token),
          method: isEditing ? 'PATCH' : 'POST',
        },
      );
      await loadMcpServers(token);
      setMcpForm(emptyMcpForm);
      setEditingMcpId('');
      setMcpMessage(isEditing ? 'MCP 已更新' : 'MCP 已创建');
    } catch (error) {
      setMcpMessage(getErrorMessage(error));
    }
  }

  async function handleMcpDelete(mcpId: string) {
    if (!token || !window.confirm('确认删除这个 MCP 服务？')) {
      return;
    }

    try {
      await requestJson<void>(`/mcp/${mcpId}`, {
        headers: authHeaders(token),
        method: 'DELETE',
      });
      await loadMcpServers(token);
      setMcpMessage('MCP 已删除');
    } catch (error) {
      setMcpMessage(getErrorMessage(error));
    }
  }

  async function handleMcpBind(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !selectedAgentId || !mcpBindingForm.mcpId) {
      return;
    }

    try {
      await requestJson<AgentMcpBinding>(`/agents/${selectedAgentId}/mcp`, {
        body: JSON.stringify({
          allowTools: optional(mcpBindingForm.allowTools),
          mcpId: mcpBindingForm.mcpId,
        }),
        headers: authHeaders(token),
        method: 'POST',
      });
      await loadMcpBindings(selectedAgentId, token);
      setMcpBindingForm(emptyMcpBindingForm);
      setMcpMessage('MCP 已挂载');
    } catch (error) {
      setMcpMessage(getErrorMessage(error));
    }
  }

  async function handleMcpUnbind(bindingId: string) {
    if (!token || !selectedAgentId) {
      return;
    }

    try {
      await requestJson<void>(`/agents/${selectedAgentId}/mcp/${bindingId}`, {
        headers: authHeaders(token),
        method: 'DELETE',
      });
      await loadMcpBindings(selectedAgentId, token);
      setMcpMessage('MCP 挂载已移除');
    } catch (error) {
      setMcpMessage(getErrorMessage(error));
    }
  }

  async function handleAgentRelationBind(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !selectedAgentId || !agentRelationForm.subAgentId) {
      return;
    }

    setAgentRelationMessage('');

    try {
      await requestJson<AgentRelation>(`/agents/${selectedAgentId}/relations`, {
        body: JSON.stringify({
          relName: optional(agentRelationForm.relName),
          subAgentId: agentRelationForm.subAgentId,
        }),
        headers: authHeaders(token),
        method: 'POST',
      });
      await loadAgentRelations(selectedAgentId, token);
      setAgentRelationForm(emptyAgentRelationForm);
      setAgentRelationMessage('子 Agent 已绑定');
    } catch (error) {
      setAgentRelationMessage(getErrorMessage(error));
    }
  }

  async function handleAgentRelationUnbind(relationId: string) {
    if (!token || !selectedAgentId) {
      return;
    }

    try {
      await requestJson<void>(
        `/agents/${selectedAgentId}/relations/${relationId}`,
        {
          headers: authHeaders(token),
          method: 'DELETE',
        },
      );
      await loadAgentRelations(selectedAgentId, token);
      setAgentRelationMessage('子 Agent 绑定已移除');
    } catch (error) {
      setAgentRelationMessage(getErrorMessage(error));
    }
  }

  function handleModeChange(nextMode: AuthMode) {
    setAuthMode(nextMode);
    setMessage('');
  }

  function handleProjectEdit(project: Project) {
    setProjectForm({
      description: project.description ?? '',
      name: project.name,
      status: project.status,
    });
    setEditingProjectId(project.id);
    setView('projects');
  }

  function handleProjectOpen(project: Project) {
    setSelectedProjectId(project.id);
    setEditingAgentId('');
    setAgentForm(emptyAgentForm);
    setAgentMessage('');
    setAgentRelations([]);
    setAgentRelationForm(emptyAgentRelationForm);
    setAgentRelationMessage('');
    setDetailTab('agents');
    setView('agent');
    void loadAgents(project.id, token);
  }

  function handleModelEdit(model: LlmModel) {
    setModelForm({
      apiKeyRef: model.apiKeyRef,
      baseUrl: model.baseUrl,
      contextWindow: model.contextWindow,
      defaultParams: model.defaultParams ?? '',
      modelCode: model.modelCode,
      modelName: model.modelName,
      modelType: model.modelType,
      priceInput: model.priceInput,
      priceOutput: model.priceOutput,
      secretKey: '',
      status: model.status,
      supportFunctionCall: model.supportFunctionCall,
      supportStream: model.supportStream,
      vendor: model.vendor,
    });
    setEditingModelId(model.id);
    setView('models');
  }

  function handleAgentEdit(agent: Agent) {
    setAgentForm({
      agentCode: agent.agentCode,
      agentDesc: agent.agentDesc ?? '',
      agentName: agent.agentName,
      agentType: agent.agentType,
      llmModel: agent.llmModel,
      llmModelId: agent.llmModelId ?? '',
      maxContextLength: agent.maxContextLength,
      runMode: agent.runMode,
      status: agent.status,
      supportsSubAgents: agent.supportsSubAgents,
      timeoutSeconds: agent.timeoutSeconds,
    });
    setEditingAgentId(agent.id);
    setSelectedAgentId(agent.id);
    setAgentMessage('');
  }

  function handlePromptEdit(prompt: AgentPrompt) {
    setPromptForm({
      isDefault: prompt.isDefault,
      outputFormat: prompt.outputFormat ?? '',
      promptName: prompt.promptName,
      promptVersion: prompt.promptVersion,
      roleDefinition: prompt.roleDefinition ?? '',
      systemPrompt: prompt.systemPrompt,
    });
    setEditingPromptId(prompt.id);
  }

  function handleSkillEdit(skill: Skill) {
    setSkillForm({
      invokeConfig: skill.invokeConfig ?? '',
      skillCode: skill.skillCode,
      skillDesc: skill.skillDesc ?? '',
      skillName: skill.skillName,
      skillType: skill.skillType,
      status: skill.status,
    });
    setEditingSkillId(skill.id);
  }

  function handleMcpEdit(mcp: McpServer) {
    setMcpForm({
      endpoint: mcp.endpoint,
      mcpCode: mcp.mcpCode,
      mcpDesc: mcp.mcpDesc ?? '',
      mcpName: mcp.mcpName,
      status: mcp.status,
      toolList: mcp.toolList ?? '',
      transportType: mcp.transportType,
    });
    setEditingMcpId(mcp.id);
  }

  function handleSignOut() {
    localStorage.removeItem(tokenStorageKey);
    setToken('');
    setUser(null);
    setProjects([]);
    setModels([]);
    setAgents([]);
    setPrompts([]);
    setSkills([]);
    setSkillBindings([]);
    setMcpServers([]);
    setMcpBindings([]);
    setAgentRelations([]);
    setSelectedProjectId('');
    setSelectedAgentId('');
    setEditingProjectId('');
    setEditingModelId('');
    setEditingAgentId('');
    setEditingPromptId('');
    setEditingSkillId('');
    setEditingMcpId('');
    setProjectForm(emptyProjectForm);
    setModelForm(emptyModelForm);
    setAgentForm(emptyAgentForm);
    setPromptForm(emptyPromptForm);
    setSkillForm(emptySkillForm);
    setMcpForm(emptyMcpForm);
    setAgentRelationForm(emptyAgentRelationForm);
    setView('home');
    setAuthMode('login');
    setMessage('已退出');
    setProjectMessage('');
    setModelMessage('');
    setAgentMessage('');
    setPromptMessage('');
    setSkillMessage('');
    setMcpMessage('');
    setAgentRelationMessage('');
  }

  return {
    activeProjectsCount,
    agentForm,
    agentMessage,
    agentRelationForm,
    agentRelationMessage,
    agentRelations,
    agents,
    authMode,
    detailTab,
    editingAgentId,
    editingMcpId,
    editingModelId,
    editingProjectId,
    editingPromptId,
    editingSkillId,
    email,
    enabledAgentsCount,
    enabledModelsCount,
    handleAgentDelete,
    handleAgentEdit,
    handleAgentRelationBind,
    handleAgentRelationUnbind,
    handleAgentSubmit,
    handleAuthSubmit,
    handleMcpBind,
    handleMcpDelete,
    handleMcpEdit,
    handleMcpSubmit,
    handleMcpUnbind,
    handleModeChange,
    handleModelDelete,
    handleModelEdit,
    handleModelSubmit,
    handleProjectDelete,
    handleProjectEdit,
    handleProjectOpen,
    handleProjectSubmit,
    handlePromptDelete,
    handlePromptEdit,
    handlePromptSubmit,
    handleSignOut,
    handleSkillBind,
    handleSkillDelete,
    handleSkillEdit,
    handleSkillSubmit,
    handleSkillUnbind,
    isAgentLoading,
    isAgentSaving,
    isCheckingSession,
    isModelLoading,
    isProjectLoading,
    isProjectSaving,
    isSubmitting,
    mcpBindingForm,
    mcpBindings,
    mcpForm,
    mcpMessage,
    mcpServers,
    message,
    modelForm,
    modelMessage,
    models,
    name,
    password,
    projectForm,
    projectMessage,
    projects,
    promptForm,
    promptMessage,
    prompts,
    relationCandidates,
    selectedAgent,
    selectedAgentId,
    selectedProject,
    selectedProjectId,
    setAgentForm,
    setAgentRelationForm,
    setAuthMode,
    setDetailTab,
    setEmail,
    setEditingAgentId,
    setEditingMcpId,
    setEditingModelId,
    setEditingProjectId,
    setEditingPromptId,
    setEditingSkillId,
    setMcpBindingForm,
    setMcpForm,
    setModelForm,
    setName,
    setPassword,
    setProjectForm,
    setPromptForm,
    setSelectedAgentId,
    setSkillBindingForm,
    setSkillForm,
    setView,
    skillBindingForm,
    skillBindings,
    skillForm,
    skillMessage,
    skills,
    user,
    view,
  };
}

export type PlatformApp = ReturnType<typeof usePlatformApp>;
