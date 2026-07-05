import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { AgentRunMode, AgentStatus, AgentType } from '../entities/agent.entity';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

const trimOptionalString = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export class CreateAgentDto {
  @IsUUID('4')
  projectId: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'agentCode can only contain letters, numbers, underscores, and hyphens',
  })
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  agentCode?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(128)
  @Transform(({ value }: { value: unknown }) => trimString(value))
  agentName: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  agentDesc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  avatar?: string;

  @IsOptional()
  @IsEnum(AgentType)
  agentType?: AgentType;

  @IsOptional()
  @IsEnum(AgentStatus)
  status?: AgentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  version?: string;

  @IsOptional()
  @IsEnum(AgentRunMode)
  runMode?: AgentRunMode;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(600)
  timeoutSeconds?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1000)
  @Max(200000)
  maxContextLength?: number;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  llmModel?: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsUUID('4')
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  llmModelId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  apiKeyRef?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  supportsSubAgents?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  publishingChannel?: string;
}
