import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

const trimOptionalString = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateAgentPromptDto {
  @IsString()
  @MinLength(2)
  @MaxLength(128)
  @Transform(({ value }: { value: unknown }) => trimString(value))
  promptName: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  promptVersion?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  roleDefinition?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12000)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  workBoundary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12000)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  limitConstraint?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20000)
  @Transform(({ value }: { value: unknown }) => trimString(value))
  systemPrompt: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  outputFormat?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  topP?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200000)
  maxTokens?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1)
  status?: number;
}
