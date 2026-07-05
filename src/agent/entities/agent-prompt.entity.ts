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

@Entity({ name: 'agent_prompt' })
@Index('IDX_agent_prompt_agent_deleted', ['agentId', 'isDeleted'])
@Index('IDX_agent_prompt_tenant_default', [
  'tenantId',
  'agentId',
  'isDefault',
  'isDeleted',
])
export class AgentPrompt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'agent_id', type: 'uuid' })
  agentId: string;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_prompt_agent',
    name: 'agent_id',
  })
  agent?: Agent;

  @Column({ length: 128, name: 'prompt_name' })
  promptName: string;

  @Column({ default: '1.0.0', length: 32, name: 'prompt_version' })
  promptVersion: string;

  @Column({ default: false, name: 'is_default' })
  isDefault: boolean;

  @Column({ name: 'role_definition', nullable: true, type: 'text' })
  roleDefinition?: string;

  @Column({ name: 'work_boundary', nullable: true, type: 'text' })
  workBoundary?: string;

  @Column({ name: 'limit_constraint', nullable: true, type: 'text' })
  limitConstraint?: string;

  @Column({ name: 'system_prompt', type: 'text' })
  systemPrompt: string;

  @Column({ name: 'output_format', nullable: true, type: 'text' })
  outputFormat?: string;

  @Column({
    default: () => '0.7',
    precision: 3,
    scale: 2,
    type: 'numeric',
  })
  temperature: string;

  @Column({
    default: () => '0.9',
    name: 'top_p',
    precision: 3,
    scale: 2,
    type: 'numeric',
  })
  topP: string;

  @Column({ default: 2000, name: 'max_tokens' })
  maxTokens: number;

  @Column({ default: 1, type: 'smallint' })
  status: number;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_prompt_created_by',
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
