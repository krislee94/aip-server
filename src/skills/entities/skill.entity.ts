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

export enum SkillStatus {
  Disabled = 'disabled',
  Enabled = 'enabled',
}

export enum SkillType {
  BuiltinFunction = 'builtin_function',
  CustomScript = 'custom_script',
  DatabaseQuery = 'database_query',
  HttpApi = 'http_api',
}

@Entity({ name: 'skill' })
@Index('UQ_skill_tenant_code_active', ['tenantId', 'skillCode'], {
  unique: true,
  where: '"is_deleted" = false',
})
@Index('IDX_skill_tenant_status', ['tenantId', 'status'])
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ length: 64, name: 'skill_code' })
  skillCode: string;

  @Column({ length: 128, name: 'skill_name' })
  skillName: string;

  @Column({ name: 'skill_desc', nullable: true, type: 'text' })
  skillDesc?: string;

  @Column({ length: 32, name: 'skill_type' })
  skillType: SkillType;

  @Column({ default: '', length: 255 })
  icon: string;

  @Column({ name: 'input_schema', nullable: true, type: 'text' })
  inputSchema?: string;

  @Column({ name: 'output_schema', nullable: true, type: 'text' })
  outputSchema?: string;

  @Column({ name: 'invoke_config', nullable: true, type: 'text' })
  invokeConfig?: string;

  @Column({ default: 10, name: 'timeout_seconds' })
  timeoutSeconds: number;

  @Column({ default: 20, name: 'max_invoke_times' })
  maxInvokeTimes: number;

  @Column({ default: SkillStatus.Enabled, length: 16 })
  status: SkillStatus;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_skill_created_by',
    name: 'created_by',
  })
  creator?: User;

  @Column({ name: 'updated_by', nullable: true, type: 'uuid' })
  updatedBy?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_skill_updated_by',
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
