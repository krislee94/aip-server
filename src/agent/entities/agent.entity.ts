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

import { Project } from '../../project/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { LlmModel } from '../../model/entities/model.entity';
import { AgentPrompt } from './agent-prompt.entity';

export enum AgentRunMode {
  Async = 'async',
  Sync = 'sync',
}

export enum AgentStatus {
  Disabled = 'disabled',
  Draft = 'draft',
  Enabled = 'enabled',
  Offline = 'offline',
  PendingPublish = 'pending_publish',
  Published = 'published',
}

export enum AgentType {
  Orchestrator = 'orchestrator',
  Standalone = 'standalone',
  Sub = 'sub',
}

@Entity({ name: 'agent_main' })
@Index('UQ_agent_main_tenant_code_active', ['tenantId', 'agentCode'], {
  unique: true,
  where: '"is_deleted" = false',
})
@Index('IDX_agent_main_tenant_status', ['tenantId', 'status'])
@Index('IDX_agent_main_project', ['projectId', 'isDeleted'])
@Index('IDX_agent_main_code', ['agentCode'])
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_main_project',
    name: 'project_id',
  })
  project?: Project;

  @Column({ length: 64, name: 'agent_code' })
  agentCode: string;

  @Column({ length: 128, name: 'agent_name' })
  agentName: string;

  @Column({ name: 'agent_desc', nullable: true, type: 'text' })
  agentDesc?: string;

  @Column({ default: '', length: 255 })
  avatar: string;

  @Column({
    default: AgentType.Standalone,
    length: 32,
    name: 'agent_type',
  })
  agentType: AgentType;

  @Column({
    default: AgentStatus.Draft,
    length: 32,
  })
  status: AgentStatus;

  @Column({ default: '1.0.0', length: 32 })
  version: string;

  @Column({
    default: AgentRunMode.Sync,
    length: 16,
    name: 'run_mode',
  })
  runMode: AgentRunMode;

  @Column({ default: 30, name: 'timeout_seconds' })
  timeoutSeconds: number;

  @Column({ default: 8000, name: 'max_context_length' })
  maxContextLength: number;

  @Column({ default: '', length: 128, name: 'llm_model' })
  llmModel: string;

  @Index('IDX_agent_main_llm_model')
  @Column({ name: 'llm_model_id', nullable: true, type: 'uuid' })
  llmModelId?: string | null;

  @ManyToOne(() => LlmModel, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_main_llm_model',
    name: 'llm_model_id',
  })
  llmModelConfig?: LlmModel;

  @Column({ default: '', length: 128, name: 'api_key_ref' })
  apiKeyRef: string;

  @Column({ default: false, name: 'supports_sub_agents' })
  supportsSubAgents: boolean;

  @Index('IDX_agent_main_default_prompt')
  @Column({ name: 'default_prompt_id', nullable: true, type: 'uuid' })
  defaultPromptId?: string | null;

  @ManyToOne(() => AgentPrompt, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_main_default_prompt',
    name: 'default_prompt_id',
  })
  defaultPrompt?: AgentPrompt;

  @Column({ default: '', length: 255, name: 'publishing_channel' })
  publishingChannel: string;

  @Column({ name: 'publishing_time', nullable: true, type: 'timestamp' })
  publishingTime?: Date;

  @Column({ name: 'offline_time', nullable: true, type: 'timestamp' })
  offlineTime?: Date;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_main_created_by',
    name: 'created_by',
  })
  creator?: User;

  @Column({ name: 'updated_by', nullable: true, type: 'uuid' })
  updatedBy?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_main_updated_by',
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
