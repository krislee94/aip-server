import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { McpStatus, McpTransportType } from '../entities/mcp.entity';

const trimOptionalString = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateMcpDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'mcpCode can only contain letters, numbers, underscores, and hyphens',
  })
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  mcpCode?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(128)
  @Transform(({ value }: { value: unknown }) => trimString(value))
  mcpName: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  mcpDesc?: string;

  @IsEnum(McpTransportType)
  transportType: McpTransportType;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  endpoint?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12000)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  authConfig?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12000)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  toolList?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(600)
  timeoutSeconds?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  maxConcurrency?: number;

  @IsOptional()
  @IsEnum(McpStatus)
  status?: McpStatus;
}
