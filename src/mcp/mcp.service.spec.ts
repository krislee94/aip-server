import { Test, TestingModule } from '@nestjs/testing';
import { McpService } from './mcp.service';
import { McpRepository } from './mcp.repository';
import { McpServer, McpStatus, McpTransportType } from './entities/mcp.entity';

type MockMcpRepository = {
  create: jest.Mock;
  findAllByOwner: jest.Mock;
  findByCode: jest.Mock;
  findOneByIdAndOwner: jest.Mock;
  save: jest.Mock;
};

describe('McpService', () => {
  let service: McpService;
  let repository: MockMcpRepository;

  const userId = '11111111-1111-4111-8111-111111111111';
  const now = new Date('2026-07-05T00:00:00.000Z');

  const createMcp = (overrides: Partial<McpServer> = {}): McpServer => ({
    createdAt: now,
    createdBy: userId,
    endpoint: 'http://localhost:7000/mcp',
    id: '22222222-2222-4222-8222-222222222222',
    isDeleted: false,
    maxConcurrency: 5,
    mcpCode: 'local_tools',
    mcpName: 'Local Tools',
    status: McpStatus.Enabled,
    tenantId: userId,
    timeoutSeconds: 30,
    transportType: McpTransportType.Http,
    updatedAt: now,
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        McpService,
        {
          provide: McpRepository,
          useValue: {
            create: jest.fn(),
            findAllByOwner: jest.fn(),
            findByCode: jest.fn(),
            findOneByIdAndOwner: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<McpService>(McpService);
    repository = module.get<MockMcpRepository>(McpRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates an MCP server with a unique code', async () => {
    const mcp = createMcp();
    repository.findByCode.mockResolvedValue(null);
    repository.create.mockReturnValue(mcp);
    repository.save.mockResolvedValue(mcp);

    const result = await service.create(
      {
        mcpCode: 'local_tools',
        mcpName: 'Local Tools',
        transportType: McpTransportType.Http,
      },
      userId,
    );

    expect(result).toMatchObject({
      createdBy: userId,
      mcpCode: 'local_tools',
      mcpName: 'Local Tools',
    });
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ mcpName: 'Local Tools' }),
      userId,
      'local_tools',
    );
  });
});
