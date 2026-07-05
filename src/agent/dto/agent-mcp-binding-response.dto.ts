import { McpResponseDto } from '../../mcp/dto/mcp-response.dto';
import { AgentMcpRel } from '../../mcp/entities/agent-mcp-rel.entity';

export class AgentMcpBindingResponseDto {
  allowTools?: string;
  createdAt: Date;
  createdBy: string;
  denyTools?: string;
  enableFlag: boolean;
  id: string;
  mcp?: McpResponseDto;
  mcpId: string;
  sort: number;
  updatedAt: Date;

  constructor(binding: AgentMcpRel) {
    this.allowTools = binding.allowTools;
    this.createdAt = binding.createdAt;
    this.createdBy = binding.createdBy;
    this.denyTools = binding.denyTools;
    this.enableFlag = binding.enableFlag;
    this.id = binding.id;
    this.mcp = binding.mcp ? new McpResponseDto(binding.mcp) : undefined;
    this.mcpId = binding.mcpId;
    this.sort = binding.sort;
    this.updatedAt = binding.updatedAt;
  }
}
