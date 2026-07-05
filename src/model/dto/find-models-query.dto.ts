import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { ModelStatus, ModelType } from '../entities/model.entity';

const trimOptionalString = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export class FindModelsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  vendor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsEnum(ModelType)
  modelType?: ModelType;

  @IsOptional()
  @Type(() => Number)
  @IsEnum(ModelStatus)
  status?: ModelStatus;
}
