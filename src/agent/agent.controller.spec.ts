import { Test, TestingModule } from '@nestjs/testing';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { AgentStatus, AgentType } from './entities/agent.entity';

type MockAgentService = {
  create: jest.Mock;
  findAll: jest.Mock;
  findOne: jest.Mock;
  remove: jest.Mock;
  update: jest.Mock;
};

describe('AgentController', () => {
  let controller: AgentController;
  let service: MockAgentService;

  const user = {
    email: 'agent@example.com',
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Agent User',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentController],
      providers: [
        {
          provide: AgentService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AgentController>(AgentController);
    service = module.get<MockAgentService>(AgentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('passes the current user to create', async () => {
    const response = {
      agentCode: 'support_agent',
      agentName: 'Support Agent',
      agentType: AgentType.Standalone,
      createdBy: user.id,
      id: '33333333-3333-4333-8333-333333333333',
      projectId: '22222222-2222-4222-8222-222222222222',
      status: AgentStatus.Draft,
    };
    service.create.mockResolvedValue(response);

    await expect(
      controller.create(
        {
          agentCode: 'support_agent',
          agentName: 'Support Agent',
          projectId: response.projectId,
        },
        user,
      ),
    ).resolves.toBe(response);

    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining({ agentCode: 'support_agent' }),
      user.id,
    );
  });
});
