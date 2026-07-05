import { Test, TestingModule } from '@nestjs/testing';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';
import { McpStatus, McpTransportType } from './entities/mcp.entity';

type MockMcpService = {
  create: jest.Mock;
  findAll: jest.Mock;
  findOne: jest.Mock;
  remove: jest.Mock;
  update: jest.Mock;
};

describe('McpController', () => {
  let controller: McpController;
  let service: MockMcpService;

  const user = {
    email: 'mcp@example.com',
    id: '11111111-1111-4111-8111-111111111111',
    name: 'MCP User',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McpController],
      providers: [
        {
          provide: McpService,
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

    controller = module.get<McpController>(McpController);
    service = module.get<MockMcpService>(McpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('passes the current user to create', async () => {
    const response = {
      createdBy: user.id,
      id: '22222222-2222-4222-8222-222222222222',
      mcpCode: 'local_tools',
      mcpName: 'Local Tools',
      status: McpStatus.Enabled,
      transportType: McpTransportType.Http,
    };
    service.create.mockResolvedValue(response);

    await expect(
      controller.create(
        {
          mcpCode: 'local_tools',
          mcpName: 'Local Tools',
          transportType: McpTransportType.Http,
        },
        user,
      ),
    ).resolves.toBe(response);

    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining({ mcpCode: 'local_tools' }),
      user.id,
    );
  });
});
