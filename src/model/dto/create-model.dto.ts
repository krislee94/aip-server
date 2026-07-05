import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { ModelStatus, ModelType } from '../entities/model.entity';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

const trimOptionalString = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export class CreateModelDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  @Matches(/^[A-Za-z0-9_.:-]+$/, {
    message:
      'modelCode can only contain letters, numbers, dots, underscores, colons, and hyphens',
  })
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  modelCode?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(256)
  @Transform(({ value }: { value: unknown }) => trimString(value))
  modelName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @Transform(({ value }: { value: unknown }) => trimString(value))
  vendor: string;

  @Type(() => Number)
  @IsEnum(ModelType)
  modelType: ModelType;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  baseUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  apiKeyRef?: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  secretKey?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12000)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  defaultParams?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  supportFunctionCall?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  supportStream?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2000000)
  contextWindow?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(0)
  @Max(9999)
  priceInput?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(0)
  @Max(9999)
  priceOutput?: number;

  @IsOptional()
  @Type(() => Number)
  @IsEnum(ModelStatus)
  status?: ModelStatus;
}
