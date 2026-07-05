import { AgentRel } from '../entities/agent-rel.entity';
import { AgentResponseDto } from './agent-response.dto';

export class AgentRelationResponseDto {
  callPermission: number;
  callWeight: number;
  createdAt: Date;
  createdBy: string;
  id: string;
  inputFilter?: string;
  mainAgentId: string;
  maxCallTimes: number;
  outputMergeStrategy: number;
  relName: string;
  sort: number;
  status: number;
  subAgent?: AgentResponseDto;
  subAgentId: string;
  updatedAt: Date;

  constructor(relation: AgentRel) {
    this.callPermission = relation.callPermission;
    this.callWeight = relation.callWeight;
    this.createdAt = relation.createdAt;
    this.createdBy = relation.createdBy;
    this.id = relation.id;
    this.inputFilter = relation.inputFilter;
    this.mainAgentId = relation.mainAgentId;
    this.maxCallTimes = relation.maxCallTimes;
    this.outputMergeStrategy = relation.outputMergeStrategy;
    this.relName = relation.relName;
    this.sort = relation.sort;
    this.status = relation.status;
    this.subAgent = relation.subAgent
      ? new AgentResponseDto(relation.subAgent)
      : undefined;
    this.subAgentId = relation.subAgentId;
    this.updatedAt = relation.updatedAt;
  }
}
