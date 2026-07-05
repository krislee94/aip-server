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

import { Agent } from '../../agent/entities/agent.entity';
import { User } from '../../users/entities/user.entity';
import { McpServer } from './mcp.entity';

@Entity({ name: 'agent_mcp_rel' })
@Index('UQ_agent_mcp_rel_active', ['agentId', 'mcpId'], {
  unique: true,
  where: '"is_deleted" = false',
})
@Index('IDX_agent_mcp_rel_agent', ['agentId', 'enableFlag', 'isDeleted'])
@Index('IDX_agent_mcp_rel_mcp', ['mcpId'])
export class AgentMcpRel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'agent_id', type: 'uuid' })
  agentId: string;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_mcp_rel_agent',
    name: 'agent_id',
  })
  agent?: Agent;

  @Column({ name: 'mcp_id', type: 'uuid' })
  mcpId: string;

  @ManyToOne(() => McpServer, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_mcp_rel_mcp',
    name: 'mcp_id',
  })
  mcp?: McpServer;

  @Column({ name: 'allow_tools', nullable: true, type: 'text' })
  allowTools?: string;

  @Column({ name: 'deny_tools', nullable: true, type: 'text' })
  denyTools?: string;

  @Column({ default: true, name: 'enable_flag' })
  enableFlag: boolean;

  @Column({ default: 0 })
  sort: number;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_mcp_rel_created_by',
    name: 'created_by',
  })
  creator?: User;

  @Column({ default: false, name: 'is_deleted' })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
