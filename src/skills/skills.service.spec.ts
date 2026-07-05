import { Test, TestingModule } from '@nestjs/testing';
import { SkillsService } from './skills.service';
import { SkillsRepository } from './skills.repository';
import { Skill, SkillStatus, SkillType } from './entities/skill.entity';

type MockSkillsRepository = {
  create: jest.Mock;
  findAllByOwner: jest.Mock;
  findByCode: jest.Mock;
  findOneByIdAndOwner: jest.Mock;
  save: jest.Mock;
};

describe('SkillsService', () => {
  let service: SkillsService;
  let repository: MockSkillsRepository;

  const userId = '11111111-1111-4111-8111-111111111111';
  const now = new Date('2026-07-05T00:00:00.000Z');

  const createSkill = (overrides: Partial<Skill> = {}): Skill => ({
    createdAt: now,
    createdBy: userId,
    icon: '',
    id: '22222222-2222-4222-8222-222222222222',
    isDeleted: false,
    maxInvokeTimes: 20,
    skillCode: 'http_search',
    skillName: 'HTTP Search',
    skillType: SkillType.HttpApi,
    status: SkillStatus.Enabled,
    tenantId: userId,
    timeoutSeconds: 10,
    updatedAt: now,
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        {
          provide: SkillsRepository,
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

    service = module.get<SkillsService>(SkillsService);
    repository = module.get<MockSkillsRepository>(SkillsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a skill with a unique code', async () => {
    const skill = createSkill();
    repository.findByCode.mockResolvedValue(null);
    repository.create.mockReturnValue(skill);
    repository.save.mockResolvedValue(skill);

    const result = await service.create(
      {
        skillCode: 'http_search',
        skillName: 'HTTP Search',
        skillType: SkillType.HttpApi,
      },
      userId,
    );

    expect(result).toMatchObject({
      createdBy: userId,
      skillCode: 'http_search',
      skillName: 'HTTP Search',
    });
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ skillName: 'HTTP Search' }),
      userId,
      'http_search',
    );
  });
});
