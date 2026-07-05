import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

export enum McpStatus {
  Disabled = 'disabled',
  Enabled = 'enabled',
}

export enum McpTransportType {
  Http = 'http',
  Sse = 'sse',
  Stdio = 'stdio',
}

@Entity({ name: 'mcp_server' })
@Index('UQ_mcp_server_tenant_code_active', ['tenantId', 'mcpCode'], {
  unique: true,
  where: '"is_deleted" = false',
})
@Index('IDX_mcp_server_tenant_status', ['tenantId', 'status'])
export class McpServer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ length: 64, name: 'mcp_code' })
  mcpCode: string;

  @Column({ length: 128, name: 'mcp_name' })
  mcpName: string;

  @Column({ name: 'mcp_desc', nullable: true, type: 'text' })
  mcpDesc?: string;

  @Column({ length: 16, name: 'transport_type' })
  transportType: McpTransportType;

  @Column({ default: '', length: 512 })
  endpoint: string;

  @Column({ name: 'auth_config', nullable: true, type: 'text' })
  authConfig?: string;

  @Column({ name: 'tool_list', nullable: true, type: 'text' })
  toolList?: string;

  @Column({ default: 30, name: 'timeout_seconds' })
  timeoutSeconds: number;

  @Column({ default: 5, name: 'max_concurrency' })
  maxConcurrency: number;

  @Column({ default: McpStatus.Enabled, length: 16 })
  status: McpStatus;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_mcp_server_created_by',
    name: 'created_by',
  })
  creator?: User;

  @Column({ name: 'updated_by', nullable: true, type: 'uuid' })
  updatedBy?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_mcp_server_updated_by',
    name: 'updated_by',
  })
  updater?: User;

  @Column({ default: false, name: 'is_deleted' })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
