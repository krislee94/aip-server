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

import { SkillStatus, SkillType } from '../entities/skill.entity';

const trimOptionalString = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateSkillDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'skillCode can only contain letters, numbers, underscores, and hyphens',
  })
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  skillCode?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(128)
  @Transform(({ value }: { value: unknown }) => trimString(value))
  skillName: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  skillDesc?: string;

  @IsEnum(SkillType)
  skillType: SkillType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  icon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  inputSchema?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  outputSchema?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12000)
  @Transform(({ value }: { value: unknown }) => trimOptionalString(value))
  invokeConfig?: string;

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
  @Max(200)
  maxInvokeTimes?: number;

  @IsOptional()
  @IsEnum(SkillStatus)
  status?: SkillStatus;
}
