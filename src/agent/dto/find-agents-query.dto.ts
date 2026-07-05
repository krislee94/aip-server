import { IsOptional, IsUUID } from 'class-validator';

export class FindAgentsQueryDto {
  @IsOptional()
  @IsUUID('4')
  projectId?: string;
}
