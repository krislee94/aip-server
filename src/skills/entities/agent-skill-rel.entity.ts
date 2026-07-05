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
import { Skill } from './skill.entity';

@Entity({ name: 'agent_skill_rel' })
@Index('UQ_agent_skill_rel_active', ['agentId', 'skillId'], {
  unique: true,
  where: '"is_deleted" = false',
})
@Index('IDX_agent_skill_rel_agent', ['agentId', 'enableFlag', 'isDeleted'])
@Index('IDX_agent_skill_rel_skill', ['skillId'])
export class AgentSkillRel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'agent_id', type: 'uuid' })
  agentId: string;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_skill_rel_agent',
    name: 'agent_id',
  })
  agent?: Agent;

  @Column({ name: 'skill_id', type: 'uuid' })
  skillId: string;

  @ManyToOne(() => Skill, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_skill_rel_skill',
    name: 'skill_id',
  })
  skill?: Skill;

  @Column({ default: '', length: 128, name: 'alias_name' })
  aliasName: string;

  @Column({ name: 'invoke_filter', nullable: true, type: 'text' })
  invokeFilter?: string;

  @Column({ default: true, name: 'enable_flag' })
  enableFlag: boolean;

  @Column({ default: 0 })
  sort: number;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_agent_skill_rel_created_by',
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
