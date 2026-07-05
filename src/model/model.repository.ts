import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { CreateModelDto } from './dto/create-model.dto';
import { FindModelsQueryDto } from './dto/find-models-query.dto';
import { LlmModel } from './entities/model.entity';

@Injectable()
export class ModelRepository {
  constructor(
    @InjectRepository(LlmModel)
    private readonly repository: Repository<LlmModel>,
  ) {}

  create(
    dto: CreateModelDto,
    creator: string,
    modelCode: string,
    priceInput: string,
    priceOutput: string,
  ): LlmModel {
    return this.repository.create({
      ...dto,
      createdBy: creator,
      modelCode,
      priceInput,
      priceOutput,
      tenantId: creator,
    });
  }

  findAllByOwner(
    creator: string,
    query: FindModelsQueryDto,
  ): Promise<LlmModel[]> {
    const where: FindOptionsWhere<LlmModel> = {
      createdBy: creator,
      isDeleted: false,
    };

    if (query.vendor) {
      where.vendor = query.vendor;
    }

    if (typeof query.modelType === 'number') {
      where.modelType = query.modelType;
    }

    if (typeof query.status === 'number') {
      where.status = query.status;
    }

    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
      where,
    });
  }

  findByCode(tenantId: string, modelCode: string): Promise<LlmModel | null> {
    return this.repository.findOne({
      where: {
        isDeleted: false,
        modelCode,
        tenantId,
      },
    });
  }

  findOneByIdAndOwner(id: string, creator: string): Promise<LlmModel | null> {
    return this.repository.findOne({
      where: {
        createdBy: creator,
        id,
        isDeleted: false,
      },
    });
  }

  save(model: LlmModel): Promise<LlmModel> {
    return this.repository.save(model);
  }
}
