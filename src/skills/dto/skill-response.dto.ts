import { Skill } from '../entities/skill.entity';

export class SkillResponseDto {
  createdAt: Date;
  createdBy: string;
  icon: string;
  id: string;
  inputSchema?: string;
  invokeConfig?: string;
  maxInvokeTimes: number;
  outputSchema?: string;
  skillCode: string;
  skillDesc?: string;
  skillName: string;
  skillType: Skill['skillType'];
  status: Skill['status'];
  timeoutSeconds: number;
  updatedAt: Date;
  updatedBy?: string;

  constructor(skill: Skill) {
    this.createdAt = skill.createdAt;
    this.createdBy = skill.createdBy;
    this.icon = skill.icon;
    this.id = skill.id;
    this.inputSchema = skill.inputSchema;
    this.invokeConfig = skill.invokeConfig;
    this.maxInvokeTimes = skill.maxInvokeTimes;
    this.outputSchema = skill.outputSchema;
    this.skillCode = skill.skillCode;
    this.skillDesc = skill.skillDesc;
    this.skillName = skill.skillName;
    this.skillType = skill.skillType;
    this.status = skill.status;
    this.timeoutSeconds = skill.timeoutSeconds;
    this.updatedAt = skill.updatedAt;
    this.updatedBy = skill.updatedBy;
  }
}
