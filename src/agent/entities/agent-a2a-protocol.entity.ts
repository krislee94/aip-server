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
import { Agent } from './agent.entity';

@Entity({ name: 'agent_a2a_protocol' })
@Index('UQ_agent_a2a_protocol_active', ['agentId', 'protocolCode'], {
  unique: true,
  where: '"is_deleted" = false',
})
@Index('IDX_agent_a2a_protocol_tenant_agent', ['tenantId', 'agentId', 'status'])
export class AgentA2AProtocol {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'agent_id', type: 'uuid' })
  agentId: string;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_a2a_protocol_agent',
    name: 'agent_id',
  })
  agent?: Agent;

  @Column({ length: 128, name: 'protocol_name' })
  protocolName: string;

  @Column({ length: 64, name: 'protocol_code' })
  protocolCode: string;

  @Column({ default: '1.0.0', length: 32, name: 'protocol_version' })
  protocolVersion: string;

  @Column({ default: 1, name: 'publish_scope', type: 'smallint' })
  publishScope: number;

  @Column({ default: 1, name: 'auth_type', type: 'smallint' })
  authType: number;

  @Column({ default: '', length: 512, name: 'access_token' })
  accessToken: string;

  @Column({ default: 100, name: 'call_limit_qps' })
  callLimitQps: number;

  @Column({ default: 10000, name: 'call_daily_max', type: 'bigint' })
  callDailyMax: string;

  @Column({ name: 'allow_agent_codes', nullable: true, type: 'text' })
  allowAgentCodes?: string;

  @Column({ name: 'deny_agent_codes', nullable: true, type: 'text' })
  denyAgentCodes?: string;

  @Column({ name: 'request_schema', nullable: true, type: 'text' })
  requestSchema?: string;

  @Column({ name: 'response_schema', nullable: true, type: 'text' })
  responseSchema?: string;

  @Column({ name: 'support_func', nullable: true, type: 'text' })
  supportFunc?: string;

  @Column({ default: 60 })
  timeout: number;

  @Column({ default: 0, type: 'smallint' })
  status: number;

  @Column({ name: 'publish_time', nullable: true, type: 'timestamp' })
  publishTime?: Date;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_a2a_protocol_created_by',
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
