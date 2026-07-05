import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
  ) {}

  create(dto: CreateProjectDto, createdBy: string): Project {
    return this.repository.create({
      ...dto,
      createdBy,
    });
  }

  findAllByOwner(createdBy: string): Promise<Project[]> {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
      where: {
        createdBy,
      },
    });
  }

  findOneByIdAndOwner(id: string, createdBy: string): Promise<Project | null> {
    return this.repository.findOne({
      where: {
        createdBy,
        id,
      },
    });
  }

  save(project: Project): Promise<Project> {
    return this.repository.save(project);
  }

  async remove(project: Project): Promise<void> {
    await this.repository.remove(project);
  }
}
