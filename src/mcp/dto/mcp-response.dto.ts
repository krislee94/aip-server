import { McpServer } from '../entities/mcp.entity';

export class McpResponseDto {
  authConfig?: string;
  createdAt: Date;
  createdBy: string;
  endpoint: string;
  id: string;
  maxConcurrency: number;
  mcpCode: string;
  mcpDesc?: string;
  mcpName: string;
  status: McpServer['status'];
  timeoutSeconds: number;
  toolList?: string;
  transportType: McpServer['transportType'];
  updatedAt: Date;
  updatedBy?: string;

  constructor(mcp: McpServer) {
    this.authConfig = mcp.authConfig;
    this.createdAt = mcp.createdAt;
    this.createdBy = mcp.createdBy;
    this.endpoint = mcp.endpoint;
    this.id = mcp.id;
    this.maxConcurrency = mcp.maxConcurrency;
    this.mcpCode = mcp.mcpCode;
    this.mcpDesc = mcp.mcpDesc;
    this.mcpName = mcp.mcpName;
    this.status = mcp.status;
    this.timeoutSeconds = mcp.timeoutSeconds;
    this.toolList = mcp.toolList;
    this.transportType = mcp.transportType;
    this.updatedAt = mcp.updatedAt;
    this.updatedBy = mcp.updatedBy;
  }
}
