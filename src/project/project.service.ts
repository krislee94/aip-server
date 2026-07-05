import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async create(
    createProjectDto: CreateProjectDto,
    createdBy: string,
  ): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto, createdBy);
    return this.projectRepository.save(project);
  }

  findAll(createdBy: string): Promise<Project[]> {
    return this.projectRepository.findAllByOwner(createdBy);
  }

  async findOne(id: string, createdBy: string): Promise<Project> {
    const project = await this.projectRepository.findOneByIdAndOwner(
      id,
      createdBy,
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    createdBy: string,
  ): Promise<Project> {
    const project = await this.findOne(id, createdBy);
    Object.assign(project, updateProjectDto);

    return this.projectRepository.save(project);
  }

  async remove(id: string, createdBy: string): Promise<void> {
    const project = await this.findOne(id, createdBy);
    await this.projectRepository.remove(project);
  }
}
