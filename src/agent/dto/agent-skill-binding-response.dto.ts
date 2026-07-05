import { SkillResponseDto } from '../../skills/dto/skill-response.dto';
import { AgentSkillRel } from '../../skills/entities/agent-skill-rel.entity';

export class AgentSkillBindingResponseDto {
  aliasName: string;
  createdAt: Date;
  createdBy: string;
  enableFlag: boolean;
  id: string;
  invokeFilter?: string;
  skill?: SkillResponseDto;
  skillId: string;
  sort: number;
  updatedAt: Date;

  constructor(binding: AgentSkillRel) {
    this.aliasName = binding.aliasName;
    this.createdAt = binding.createdAt;
    this.createdBy = binding.createdBy;
    this.enableFlag = binding.enableFlag;
    this.id = binding.id;
    this.invokeFilter = binding.invokeFilter;
    this.skill = binding.skill
      ? new SkillResponseDto(binding.skill)
      : undefined;
    this.skillId = binding.skillId;
    this.sort = binding.sort;
    this.updatedAt = binding.updatedAt;
  }
}
