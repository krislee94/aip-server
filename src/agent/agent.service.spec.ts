import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { AgentRepository } from './agent.repository';
import { AgentService } from './agent.service';
import {
  LlmModel,
  ModelStatus,
  ModelType,
} from '../model/entities/model.entity';
import {
  Agent,
  AgentRunMode,
  AgentStatus,
  AgentType,
} from './entities/agent.entity';
import { AgentRel } from './entities/agent-rel.entity';

type MockAgentRepository = {
  createAgentRelation: jest.Mock;
  create: jest.Mock;
  findAgentRelationBySubAgent: jest.Mock;
  findAllByOwner: jest.Mock;
  findByCode: jest.Mock;
  findOneByIdAndOwner: jest.Mock;
  findOwnedModel: jest.Mock;
  findOwnedProject: jest.Mock;
  saveAgentRelation: jest.Mock;
  save: jest.Mock;
};

describe('AgentService', () => {
  let service: AgentService;
  let repository: MockAgentRepository;

  const userId = '11111111-1111-4111-8111-111111111111';
  const projectId = '22222222-2222-4222-8222-222222222222';
  const now = new Date('2026-07-04T00:00:00.000Z');
  const modelId = '66666666-6666-4666-8666-666666666666';

  const createAgent = (overrides: Partial<Agent> = {}): Agent => ({
    agentCode: 'support_agent',
    agentDesc: 'Handles support requests',
    agentName: 'Support Agent',
    agentType: AgentType.Standalone,
    apiKeyRef: '',
    avatar: '',
    createdAt: now,
    createdBy: userId,
    id: '33333333-3333-4333-8333-333333333333',
    isDeleted: false,
    llmModel: '',
    maxContextLength: 8000,
    projectId,
    publishingChannel: '',
    runMode: AgentRunMode.Sync,
    status: AgentStatus.Draft,
    supportsSubAgents: false,
    tenantId: userId,
    timeoutSeconds: 30,
    updatedAt: now,
    version: '1.0.0',
    ...overrides,
  });

  const createAgentRelation = (
    overrides: Partial<AgentRel> = {},
  ): AgentRel => ({
    callPermission: 1,
    callWeight: 100,
    createdAt: now,
    createdBy: userId,
    id: '55555555-5555-4555-8555-555555555555',
    isDeleted: false,
    mainAgentId: agentId(),
    maxCallTimes: 10,
    outputMergeStrategy: 1,
    relName: 'Research helper',
    sort: 0,
    status: 1,
    subAgentId: '44444444-4444-4444-8444-444444444444',
    tenantId: userId,
    updatedAt: now,
    ...overrides,
  });

  const createModel = (overrides: Partial<LlmModel> = {}): LlmModel => ({
    apiKeyRef: 'openai-key',
    baseUrl: 'https://api.openai.com/v1',
    contextWindow: 128000,
    createdAt: now,
    createdBy: userId,
    id: modelId,
    isDeleted: false,
    modelCode: 'gpt_4_1',
    modelName: 'GPT-4.1',
    modelType: ModelType.Chat,
    priceInput: '0.010000',
    priceOutput: '0.030000',
    secretKey: '',
    status: ModelStatus.Enabled,
    supportFunctionCall: true,
    supportStream: true,
    tenantId: userId,
    updatedAt: now,
    vendor: 'openai',
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentService,
        {
          provide: AgentRepository,
          useValue: {
            createAgentRelation: jest.fn(),
            create: jest.fn(),
            findAgentRelationBySubAgent: jest.fn(),
            findAllByOwner: jest.fn(),
            findByCode: jest.fn(),
            findOneByIdAndOwner: jest.fn(),
            findOwnedModel: jest.fn(),
            findOwnedProject: jest.fn(),
            saveAgentRelation: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AgentService>(AgentService);
    repository = module.get<MockAgentRepository>(AgentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates an agent for an owned project', async () => {
    const agent = createAgent();

    repository.findOwnedProject.mockResolvedValue({ id: projectId });
    repository.findByCode.mockResolvedValue(null);
    repository.create.mockReturnValue(agent);
    repository.save.mockResolvedValue(agent);

    const result = await service.create(
      {
        agentCode: 'support_agent',
        agentDesc: 'Handles support requests',
        agentName: 'Support Agent',
        projectId,
      },
      userId,
    );

    expect(result).toMatchObject({
      agentCode: 'support_agent',
      agentName: 'Support Agent',
      createdBy: userId,
      projectId,
    });
    expect(repository.findOwnedProject).toHaveBeenCalledWith(projectId, userId);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ agentName: 'Support Agent', projectId }),
      userId,
      'support_agent',
    );
  });

  it('binds an LLM model when creating an agent', async () => {
    const model = createModel();
    const agent = createAgent({
      llmModel: model.modelCode,
      llmModelId: model.id,
    });

    repository.findOwnedProject.mockResolvedValue({ id: projectId });
    repository.findOwnedModel.mockResolvedValue(model);
    repository.findByCode.mockResolvedValue(null);
    repository.create.mockReturnValue(agent);
    repository.save.mockResolvedValue(agent);

    const result = await service.create(
      {
        agentCode: 'support_agent',
        agentName: 'Support Agent',
        llmModelId: model.id,
        projectId,
      },
      userId,
    );

    expect(result).toMatchObject({
      llmModel: 'gpt_4_1',
      llmModelId: model.id,
    });
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        llmModel: model.modelCode,
        llmModelId: model.id,
        maxContextLength: model.contextWindow,
      }),
      userId,
      'support_agent',
    );
  });

  it('throws when the agent is not owned by the user', async () => {
    repository.findOneByIdAndOwner.mockResolvedValue(null);

    await expect(service.findOne(agentId(), userId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('binds a sub agent to a main agent', async () => {
    const mainAgent = createAgent();
    const subAgent = createAgent({
      agentCode: 'research_agent',
      agentName: 'Research Agent',
      agentType: AgentType.Sub,
      id: '44444444-4444-4444-8444-444444444444',
    });
    const relation = createAgentRelation();

    repository.findOneByIdAndOwner
      .mockResolvedValueOnce(mainAgent)
      .mockResolvedValueOnce(subAgent);
    repository.findAgentRelationBySubAgent.mockResolvedValue(null);
    repository.createAgentRelation.mockReturnValue(relation);
    repository.saveAgentRelation.mockResolvedValue(relation);

    const result = await service.bindAgent(
      mainAgent.id,
      {
        relName: 'Research helper',
        subAgentId: subAgent.id,
      },
      userId,
    );

    expect(result).toMatchObject({
      mainAgentId: mainAgent.id,
      relName: 'Research helper',
      subAgentId: subAgent.id,
    });
    expect(result.subAgent?.agentName).toBe('Research Agent');
    expect(repository.createAgentRelation).toHaveBeenCalledWith(
      expect.objectContaining({ subAgentId: subAgent.id }),
      mainAgent.id,
      userId,
    );
  });

  it('rejects binding an agent to itself', async () => {
    const agent = createAgent();
    repository.findOneByIdAndOwner
      .mockResolvedValueOnce(agent)
      .mockResolvedValueOnce(agent);

    await expect(
      service.bindAgent(
        agent.id,
        {
          subAgentId: agent.id,
        },
        userId,
      ),
    ).rejects.toThrow(ConflictException);
  });

  function agentId(): string {
    return '33333333-3333-4333-8333-333333333333';
  }
});
