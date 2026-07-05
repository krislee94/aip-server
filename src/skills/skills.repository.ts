import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSkillDto } from './dto/create-skill.dto';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsRepository {
  constructor(
    @InjectRepository(Skill)
    private readonly repository: Repository<Skill>,
  ) {}

  create(dto: CreateSkillDto, creator: string, skillCode: string): Skill {
    return this.repository.create({
      ...dto,
      createdBy: creator,
      skillCode,
      tenantId: creator,
    });
  }

  findAllByOwner(creator: string): Promise<Skill[]> {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
      where: {
        createdBy: creator,
        isDeleted: false,
      },
    });
  }

  findByCode(tenantId: string, skillCode: string): Promise<Skill | null> {
    return this.repository.findOne({
      where: {
        isDeleted: false,
        skillCode,
        tenantId,
      },
    });
  }

  findOneByIdAndOwner(id: string, creator: string): Promise<Skill | null> {
    return this.repository.findOne({
      where: {
        createdBy: creator,
        id,
        isDeleted: false,
      },
    });
  }

  save(skill: Skill): Promise<Skill> {
    return this.repository.save(skill);
  }
}
