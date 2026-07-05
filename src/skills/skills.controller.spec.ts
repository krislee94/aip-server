import { Test, TestingModule } from '@nestjs/testing';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { SkillStatus, SkillType } from './entities/skill.entity';

type MockSkillsService = {
  create: jest.Mock;
  findAll: jest.Mock;
  findOne: jest.Mock;
  remove: jest.Mock;
  update: jest.Mock;
};

describe('SkillsController', () => {
  let controller: SkillsController;
  let service: MockSkillsService;

  const user = {
    email: 'skill@example.com',
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Skill User',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [
        {
          provide: SkillsService,
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

    controller = module.get<SkillsController>(SkillsController);
    service = module.get<MockSkillsService>(SkillsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('passes the current user to create', async () => {
    const response = {
      createdBy: user.id,
      id: '22222222-2222-4222-8222-222222222222',
      skillCode: 'http_search',
      skillName: 'HTTP Search',
      skillType: SkillType.HttpApi,
      status: SkillStatus.Enabled,
    };
    service.create.mockResolvedValue(response);

    await expect(
      controller.create(
        {
          skillCode: 'http_search',
          skillName: 'HTTP Search',
          skillType: SkillType.HttpApi,
        },
        user,
      ),
    ).resolves.toBe(response);

    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining({ skillCode: 'http_search' }),
      user.id,
    );
  });
});
