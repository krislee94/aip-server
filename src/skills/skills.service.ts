import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { CreateSkillDto } from './dto/create-skill.dto';
import { SkillResponseDto } from './dto/skill-response.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';
import { SkillsRepository } from './skills.repository';

@Injectable()
export class SkillsService {
  constructor(private readonly skillsRepository: SkillsRepository) {}

  async create(
    createSkillDto: CreateSkillDto,
    creator: string,
  ): Promise<SkillResponseDto> {
    const skillCode =
      createSkillDto.skillCode ??
      this.generateCode(createSkillDto.skillName, 'skill');
    await this.ensureUniqueCode(creator, skillCode);

    const skill = this.skillsRepository.create(
      createSkillDto,
      creator,
      skillCode,
    );

    return new SkillResponseDto(await this.skillsRepository.save(skill));
  }

  async findAll(creator: string): Promise<SkillResponseDto[]> {
    const skills = await this.skillsRepository.findAllByOwner(creator);
    return skills.map((skill) => new SkillResponseDto(skill));
  }

  async findOne(id: string, creator: string): Promise<SkillResponseDto> {
    return new SkillResponseDto(await this.findOwnedSkill(id, creator));
  }

  async update(
    id: string,
    updateSkillDto: UpdateSkillDto,
    updater: string,
  ): Promise<SkillResponseDto> {
    const skill = await this.findOwnedSkill(id, updater);

    if (
      updateSkillDto.skillCode &&
      updateSkillDto.skillCode !== skill.skillCode
    ) {
      await this.ensureUniqueCode(updater, updateSkillDto.skillCode);
    }

    Object.assign(skill, updateSkillDto, {
      updatedBy: updater,
    });

    return new SkillResponseDto(await this.skillsRepository.save(skill));
  }

  async remove(id: string, updater: string): Promise<void> {
    const skill = await this.findOwnedSkill(id, updater);
    skill.isDeleted = true;
    skill.updatedBy = updater;

    await this.skillsRepository.save(skill);
  }

  private async ensureUniqueCode(
    tenantId: string,
    skillCode: string,
  ): Promise<void> {
    const existing = await this.skillsRepository.findByCode(
      tenantId,
      skillCode,
    );

    if (existing) {
      throw new ConflictException('Skill code already exists');
    }
  }

  private async findOwnedSkill(id: string, creator: string): Promise<Skill> {
    const skill = await this.skillsRepository.findOneByIdAndOwner(id, creator);

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return skill;
  }

  private generateCode(name: string, fallback: string): string {
    const normalized = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40);
    const prefix = normalized || fallback;
    const suffix = randomUUID().replace(/-/g, '').slice(0, 10);

    return `${prefix}_${suffix}`.slice(0, 64);
  }
}
