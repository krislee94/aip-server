import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { CreateModelDto } from './dto/create-model.dto';
import { FindModelsQueryDto } from './dto/find-models-query.dto';
import { ModelResponseDto } from './dto/model-response.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { LlmModel } from './entities/model.entity';
import { ModelRepository } from './model.repository';

@Injectable()
export class ModelService {
  constructor(private readonly modelRepository: ModelRepository) {}

  async create(
    createModelDto: CreateModelDto,
    creator: string,
  ): Promise<ModelResponseDto> {
    const modelCode =
      createModelDto.modelCode ??
      this.generateCode(createModelDto.modelName, 'model');
    await this.ensureUniqueCode(creator, modelCode);

    const model = this.modelRepository.create(
      createModelDto,
      creator,
      modelCode,
      this.formatPrice(createModelDto.priceInput),
      this.formatPrice(createModelDto.priceOutput),
    );

    return new ModelResponseDto(await this.modelRepository.save(model));
  }

  async findAll(
    query: FindModelsQueryDto,
    creator: string,
  ): Promise<ModelResponseDto[]> {
    const models = await this.modelRepository.findAllByOwner(creator, query);
    return models.map((model) => new ModelResponseDto(model));
  }

  async findOne(id: string, creator: string): Promise<ModelResponseDto> {
    return new ModelResponseDto(await this.findOwnedModel(id, creator));
  }

  async update(
    id: string,
    updateModelDto: UpdateModelDto,
    updater: string,
  ): Promise<ModelResponseDto> {
    const model = await this.findOwnedModel(id, updater);

    if (
      updateModelDto.modelCode &&
      updateModelDto.modelCode !== model.modelCode
    ) {
      await this.ensureUniqueCode(updater, updateModelDto.modelCode);
    }

    const { priceInput, priceOutput, secretKey, ...rest } = updateModelDto;
    Object.assign(model, rest, {
      updatedBy: updater,
    });

    if (typeof priceInput === 'number') {
      model.priceInput = this.formatPrice(priceInput);
    }

    if (typeof priceOutput === 'number') {
      model.priceOutput = this.formatPrice(priceOutput);
    }

    if (typeof secretKey === 'string') {
      model.secretKey = secretKey;
    }

    return new ModelResponseDto(await this.modelRepository.save(model));
  }

  async remove(id: string, updater: string): Promise<void> {
    const model = await this.findOwnedModel(id, updater);
    model.isDeleted = true;
    model.updatedBy = updater;

    await this.modelRepository.save(model);
  }

  private async ensureUniqueCode(
    tenantId: string,
    modelCode: string,
  ): Promise<void> {
    const existing = await this.modelRepository.findByCode(tenantId, modelCode);

    if (existing) {
      throw new ConflictException('Model code already exists');
    }
  }

  private async findOwnedModel(id: string, creator: string): Promise<LlmModel> {
    const model = await this.modelRepository.findOneByIdAndOwner(id, creator);

    if (!model) {
      throw new NotFoundException('Model not found');
    }

    return model;
  }

  private formatPrice(value?: number): string {
    return (value ?? 0).toFixed(6);
  }

  private generateCode(name: string, fallback: string): string {
    const normalized = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40);
    const prefix = normalized || fallback;
    const suffix = randomUUID().replace(/-/g, '').slice(0, 10);

    return `${prefix}_${suffix}`.slice(0, 128);
  }
}
