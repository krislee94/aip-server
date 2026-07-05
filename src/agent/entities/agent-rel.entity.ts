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

@Entity({ name: 'agent_rel' })
@Index('UQ_agent_rel_main_sub_active', ['mainAgentId', 'subAgentId'], {
  unique: true,
  where: '"is_deleted" = false',
})
@Index('IDX_agent_rel_main_agent', ['mainAgentId', 'status', 'isDeleted'])
@Index('IDX_agent_rel_sub_agent', ['subAgentId'])
export class AgentRel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'main_agent_id', type: 'uuid' })
  mainAgentId: string;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_rel_main_agent',
    name: 'main_agent_id',
  })
  mainAgent?: Agent;

  @Column({ name: 'sub_agent_id', type: 'uuid' })
  subAgentId: string;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_rel_sub_agent',
    name: 'sub_agent_id',
  })
  subAgent?: Agent;

  @Column({ default: '', length: 128, name: 'rel_name' })
  relName: string;

  @Column({ default: 100, name: 'call_weight' })
  callWeight: number;

  @Column({ default: 1, name: 'call_permission', type: 'smallint' })
  callPermission: number;

  @Column({ default: 10, name: 'max_call_times' })
  maxCallTimes: number;

  @Column({ name: 'input_filter', nullable: true, type: 'text' })
  inputFilter?: string;

  @Column({ default: 1, name: 'output_merge_strategy', type: 'smallint' })
  outputMergeStrategy: number;

  @Column({ default: 0 })
  sort: number;

  @Column({ default: 1, type: 'smallint' })
  status: number;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_rel_created_by',
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
