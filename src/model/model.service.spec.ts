import { Test, TestingModule } from '@nestjs/testing';

import { CreateModelDto } from './dto/create-model.dto';
import { LlmModel, ModelStatus, ModelType } from './entities/model.entity';
import { ModelRepository } from './model.repository';
import { ModelService } from './model.service';

type MockModelRepository = {
  create: jest.Mock;
  findAllByOwner: jest.Mock;
  findByCode: jest.Mock;
  findOneByIdAndOwner: jest.Mock;
  save: jest.Mock;
};

describe('ModelService', () => {
  let service: ModelService;
  let repository: MockModelRepository;

  const userId = '11111111-1111-4111-8111-111111111111';
  const now = new Date('2026-07-05T00:00:00.000Z');

  const createModel = (overrides: Partial<LlmModel> = {}): LlmModel => ({
    apiKeyRef: 'openai-key',
    baseUrl: 'https://api.openai.com/v1',
    contextWindow: 128000,
    createdAt: now,
    createdBy: userId,
    id: '22222222-2222-4222-8222-222222222222',
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
        ModelService,
        {
          provide: ModelRepository,
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

    service = module.get<ModelService>(ModelService);
    repository = module.get<MockModelRepository>(ModelRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a model with a unique code', async () => {
    const dto: CreateModelDto = {
      modelCode: 'gpt_4_1',
      modelName: 'GPT-4.1',
      modelType: ModelType.Chat,
      priceInput: 0.01,
      priceOutput: 0.03,
      vendor: 'openai',
    };
    const model = createModel();

    repository.findByCode.mockResolvedValue(null);
    repository.create.mockReturnValue(model);
    repository.save.mockResolvedValue(model);

    const result = await service.create(dto, userId);

    expect(result).toMatchObject({
      createdBy: userId,
      hasSecretKey: false,
      modelCode: 'gpt_4_1',
      modelName: 'GPT-4.1',
    });
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ modelName: 'GPT-4.1' }),
      userId,
      'gpt_4_1',
      '0.010000',
      '0.030000',
    );
  });

  it('does not expose the secret key in responses', async () => {
    const model = createModel({ secretKey: 'hidden-secret' });
    repository.findOneByIdAndOwner.mockResolvedValue(model);

    const result = await service.findOne(model.id, userId);

    expect(result.hasSecretKey).toBe(true);
    expect(result).not.toHaveProperty('secretKey');
  });
});
