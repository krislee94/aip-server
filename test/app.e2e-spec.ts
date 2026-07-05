import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  user: {
    email: string;
    id: string;
    name: string;
  };
}

interface ProjectResponse {
  createdBy: string;
  description?: string | null;
  id: string;
  isActive: boolean;
  name: string;
  status: 'active' | 'archived' | 'draft';
}

interface AgentResponse {
  agentCode: string;
  agentDesc?: string | null;
  agentName: string;
  agentType: 'orchestrator' | 'standalone' | 'sub';
  createdBy: string;
  id: string;
  llmModel: string;
  projectId: string;
  runMode: 'async' | 'sync';
  status:
    | 'disabled'
    | 'draft'
    | 'enabled'
    | 'offline'
    | 'pending_publish'
    | 'published';
  supportsSubAgents: boolean;
  timeoutSeconds: number;
}

interface AgentPromptResponse {
  agentId: string;
  id: string;
  isDefault: boolean;
  promptName: string;
  systemPrompt: string;
}

interface SkillResponse {
  id: string;
  skillCode: string;
  skillName: string;
  skillType:
    'builtin_function' | 'custom_script' | 'database_query' | 'http_api';
  status: 'disabled' | 'enabled';
}

interface AgentSkillBindingResponse {
  id: string;
  skill?: SkillResponse;
  skillId: string;
}

interface McpResponse {
  id: string;
  mcpCode: string;
  mcpName: string;
  status: 'disabled' | 'enabled';
  transportType: 'http' | 'sse' | 'stdio';
}

interface AgentMcpBindingResponse {
  id: string;
  mcp?: McpResponse;
  mcpId: string;
}

interface AgentRelationResponse {
  id: string;
  mainAgentId: string;
  relName: string;
  subAgent?: AgentResponse;
  subAgentId: string;
}

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        whitelist: true,
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/register + /auth/login + /auth/me', async () => {
    const email = `e2e-${Date.now()}@example.com`;
    const password = 'Password123';

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        name: 'E2E User',
        password,
      })
      .expect(201);
    const registered = registerResponse.body as AuthResponse;

    expect(registered.accessToken).toEqual(expect.any(String));
    expect(registered.tokenType).toBe('Bearer');
    expect(registered.user).toMatchObject({
      email,
      name: 'E2E User',
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .expect(201);
    const loggedIn = loginResponse.body as AuthResponse;

    expect(loggedIn.accessToken).toEqual(expect.any(String));
    expect(loggedIn.user.email).toBe(email);

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${loggedIn.accessToken}`)
      .expect(200)
      .expect(({ body }: { body: AuthResponse['user'] }) => {
        expect(body.email).toBe(email);
        expect(body.name).toBe('E2E User');
      });
  });

  it('/projects CRUD', async () => {
    const email = `project-e2e-${Date.now()}@example.com`;
    const password = 'Password123';

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        name: 'Project E2E User',
        password,
      })
      .expect(201);
    const registered = registerResponse.body as AuthResponse;
    const authHeader = `Bearer ${registered.accessToken}`;

    const createResponse = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', authHeader)
      .send({
        description: 'Created from e2e',
        name: 'E2E Project',
        status: 'active',
      })
      .expect(201);
    const created = createResponse.body as ProjectResponse;

    expect(created).toMatchObject({
      createdBy: registered.user.id,
      description: 'Created from e2e',
      name: 'E2E Project',
      status: 'active',
    });

    await request(app.getHttpServer())
      .get('/projects')
      .set('Authorization', authHeader)
      .expect(200)
      .expect(({ body }: { body: ProjectResponse[] }) => {
        expect(body.some((project) => project.id === created.id)).toBe(true);
      });

    await request(app.getHttpServer())
      .get(`/projects/${created.id}`)
      .set('Authorization', authHeader)
      .expect(200)
      .expect(({ body }: { body: ProjectResponse }) => {
        expect(body.id).toBe(created.id);
      });

    await request(app.getHttpServer())
      .patch(`/projects/${created.id}`)
      .set('Authorization', authHeader)
      .send({
        description: 'Updated from e2e',
        name: 'Updated E2E Project',
      })
      .expect(200)
      .expect(({ body }: { body: ProjectResponse }) => {
        expect(body.name).toBe('Updated E2E Project');
        expect(body.description).toBe('Updated from e2e');
      });

    await request(app.getHttpServer())
      .delete(`/projects/${created.id}`)
      .set('Authorization', authHeader)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/projects/${created.id}`)
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('/agents CRUD', async () => {
    const unique = Date.now();
    const email = `agent-e2e-${unique}@example.com`;
    const password = 'Password123';

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        name: 'Agent E2E User',
        password,
      })
      .expect(201);
    const registered = registerResponse.body as AuthResponse;
    const authHeader = `Bearer ${registered.accessToken}`;

    const projectResponse = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', authHeader)
      .send({
        description: 'Agent project',
        name: 'Agent E2E Project',
        status: 'active',
      })
      .expect(201);
    const project = projectResponse.body as ProjectResponse;

    const agentCode = `support_${unique}`;
    const createResponse = await request(app.getHttpServer())
      .post('/agents')
      .set('Authorization', authHeader)
      .send({
        agentCode,
        agentDesc: 'Created from e2e',
        agentName: 'Support Agent',
        agentType: 'standalone',
        llmModel: 'gpt-4.1-mini',
        projectId: project.id,
        runMode: 'sync',
        status: 'enabled',
        supportsSubAgents: true,
        timeoutSeconds: 45,
      })
      .expect(201);
    const created = createResponse.body as AgentResponse;

    expect(created).toMatchObject({
      agentCode,
      agentDesc: 'Created from e2e',
      agentName: 'Support Agent',
      createdBy: registered.user.id,
      llmModel: 'gpt-4.1-mini',
      projectId: project.id,
      status: 'enabled',
      supportsSubAgents: true,
      timeoutSeconds: 45,
    });

    await request(app.getHttpServer())
      .get(`/agents?projectId=${project.id}`)
      .set('Authorization', authHeader)
      .expect(200)
      .expect(({ body }: { body: AgentResponse[] }) => {
        expect(body.some((agent) => agent.id === created.id)).toBe(true);
      });

    await request(app.getHttpServer())
      .get(`/agents/${created.id}`)
      .set('Authorization', authHeader)
      .expect(200)
      .expect(({ body }: { body: AgentResponse }) => {
        expect(body.id).toBe(created.id);
      });

    await request(app.getHttpServer())
      .patch(`/agents/${created.id}`)
      .set('Authorization', authHeader)
      .send({
        agentDesc: 'Updated from e2e',
        agentName: 'Updated Support Agent',
        status: 'published',
      })
      .expect(200)
      .expect(({ body }: { body: AgentResponse }) => {
        expect(body.agentName).toBe('Updated Support Agent');
        expect(body.agentDesc).toBe('Updated from e2e');
        expect(body.status).toBe('published');
      });

    await request(app.getHttpServer())
      .post('/agents')
      .set('Authorization', authHeader)
      .send({
        agentCode,
        agentName: 'Duplicate Agent',
        projectId: project.id,
      })
      .expect(409);

    await request(app.getHttpServer())
      .delete(`/agents/${created.id}`)
      .set('Authorization', authHeader)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/agents/${created.id}`)
      .set('Authorization', authHeader)
      .expect(404);
  });

  it('/agent workspace prompt + skill + mcp bindings', async () => {
    const unique = Date.now();
    const email = `workspace-e2e-${unique}@example.com`;
    const password = 'Password123';

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        name: 'Workspace E2E User',
        password,
      })
      .expect(201);
    const registered = registerResponse.body as AuthResponse;
    const authHeader = `Bearer ${registered.accessToken}`;

    const projectResponse = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', authHeader)
      .send({
        description: 'Workspace project',
        name: 'Workspace E2E Project',
        status: 'active',
      })
      .expect(201);
    const project = projectResponse.body as ProjectResponse;

    const agentResponse = await request(app.getHttpServer())
      .post('/agents')
      .set('Authorization', authHeader)
      .send({
        agentCode: `workspace_agent_${unique}`,
        agentName: 'Workspace Agent',
        projectId: project.id,
      })
      .expect(201);
    const agent = agentResponse.body as AgentResponse;

    const subAgentResponse = await request(app.getHttpServer())
      .post('/agents')
      .set('Authorization', authHeader)
      .send({
        agentCode: `workspace_sub_agent_${unique}`,
        agentName: 'Workspace Sub Agent',
        agentType: 'sub',
        projectId: project.id,
      })
      .expect(201);
    const subAgent = subAgentResponse.body as AgentResponse;

    const relationResponse = await request(app.getHttpServer())
      .post(`/agents/${agent.id}/relations`)
      .set('Authorization', authHeader)
      .send({
        relName: 'Research helper',
        subAgentId: subAgent.id,
      })
      .expect(201);
    const relation = relationResponse.body as AgentRelationResponse;

    expect(relation).toMatchObject({
      mainAgentId: agent.id,
      relName: 'Research helper',
      subAgentId: subAgent.id,
    });
    expect(relation.subAgent?.agentCode).toBe(subAgent.agentCode);

    await request(app.getHttpServer())
      .get(`/agents/${agent.id}/relations`)
      .set('Authorization', authHeader)
      .expect(200)
      .expect(({ body }: { body: AgentRelationResponse[] }) => {
        expect(body.some((item) => item.id === relation.id)).toBe(true);
      });

    const promptResponse = await request(app.getHttpServer())
      .post(`/agents/${agent.id}/prompts`)
      .set('Authorization', authHeader)
      .send({
        isDefault: true,
        promptName: 'Default Prompt',
        roleDefinition: 'You are a workspace assistant.',
        systemPrompt: 'Answer with concise project context.',
      })
      .expect(201);
    const prompt = promptResponse.body as AgentPromptResponse;

    expect(prompt).toMatchObject({
      agentId: agent.id,
      isDefault: true,
      promptName: 'Default Prompt',
    });

    await request(app.getHttpServer())
      .get(`/agents/${agent.id}/prompts`)
      .set('Authorization', authHeader)
      .expect(200)
      .expect(({ body }: { body: AgentPromptResponse[] }) => {
        expect(body.some((item) => item.id === prompt.id)).toBe(true);
      });

    const skillCode = `workspace_skill_${unique}`;
    const skillResponse = await request(app.getHttpServer())
      .post('/skills')
      .set('Authorization', authHeader)
      .send({
        invokeConfig: '{"url":"https://example.com/search"}',
        skillCode,
        skillName: 'Workspace Search',
        skillType: 'http_api',
      })
      .expect(201);
    const skill = skillResponse.body as SkillResponse;

    const skillBindingResponse = await request(app.getHttpServer())
      .post(`/agents/${agent.id}/skills`)
      .set('Authorization', authHeader)
      .send({
        aliasName: 'search',
        skillId: skill.id,
      })
      .expect(201);
    const skillBinding = skillBindingResponse.body as AgentSkillBindingResponse;

    expect(skillBinding).toMatchObject({
      skillId: skill.id,
    });
    expect(skillBinding.skill?.skillCode).toBe(skillCode);

    const mcpCode = `workspace_mcp_${unique}`;
    const mcpResponse = await request(app.getHttpServer())
      .post('/mcp')
      .set('Authorization', authHeader)
      .send({
        endpoint: 'http://localhost:7010/mcp',
        mcpCode,
        mcpName: 'Workspace MCP',
        toolList: '[{"code":"lookup"}]',
        transportType: 'http',
      })
      .expect(201);
    const mcp = mcpResponse.body as McpResponse;

    const mcpBindingResponse = await request(app.getHttpServer())
      .post(`/agents/${agent.id}/mcp`)
      .set('Authorization', authHeader)
      .send({
        allowTools: 'lookup',
        mcpId: mcp.id,
      })
      .expect(201);
    const mcpBinding = mcpBindingResponse.body as AgentMcpBindingResponse;

    expect(mcpBinding).toMatchObject({
      mcpId: mcp.id,
    });
    expect(mcpBinding.mcp?.mcpCode).toBe(mcpCode);

    await request(app.getHttpServer())
      .post(`/agents/${agent.id}/skills`)
      .set('Authorization', authHeader)
      .send({
        skillId: skill.id,
      })
      .expect(409);

    await request(app.getHttpServer())
      .post(`/agents/${agent.id}/relations`)
      .set('Authorization', authHeader)
      .send({
        subAgentId: subAgent.id,
      })
      .expect(409);

    await request(app.getHttpServer())
      .delete(`/agents/${agent.id}/skills/${skillBinding.id}`)
      .set('Authorization', authHeader)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/agents/${agent.id}/mcp/${mcpBinding.id}`)
      .set('Authorization', authHeader)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/agents/${agent.id}/relations/${relation.id}`)
      .set('Authorization', authHeader)
      .expect(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
