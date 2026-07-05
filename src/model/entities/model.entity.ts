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

export enum ModelStatus {
  Disabled = 0,
  Enabled = 1,
  Maintenance = 2,
}

export enum ModelType {
  Chat = 1,
  Embedding = 2,
  Image = 3,
  Audio = 4,
}

@Entity({ name: 'llm_model' })
@Index('UQ_llm_model_tenant_code_active', ['tenantId', 'modelCode'], {
  unique: true,
  where: '"is_deleted" = false',
})
@Index('IDX_llm_model_tenant_vendor', ['tenantId', 'vendor', 'status'])
@Index('IDX_llm_model_code', ['modelCode'])
export class LlmModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ length: 128, name: 'model_code' })
  modelCode: string;

  @Column({ length: 256, name: 'model_name' })
  modelName: string;

  @Column({ length: 64 })
  vendor: string;

  @Column({ name: 'model_type', type: 'smallint' })
  modelType: ModelType;

  @Column({ default: '', length: 512, name: 'base_url' })
  baseUrl: string;

  @Column({ default: '', length: 256, name: 'api_key_ref' })
  apiKeyRef: string;

  @Column({ default: '', length: 512, name: 'secret_key' })
  secretKey: string;

  @Column({ name: 'default_params', nullable: true, type: 'text' })
  defaultParams?: string;

  @Column({ default: false, name: 'support_function_call' })
  supportFunctionCall: boolean;

  @Column({ default: true, name: 'support_stream' })
  supportStream: boolean;

  @Column({ default: 8192, name: 'context_window' })
  contextWindow: number;

  @Column({
    default: '0',
    name: 'price_input',
    precision: 10,
    scale: 6,
    type: 'numeric',
  })
  priceInput: string;

  @Column({
    default: '0',
    name: 'price_output',
    precision: 10,
    scale: 6,
    type: 'numeric',
  })
  priceOutput: string;

  @Column({ default: ModelStatus.Enabled, type: 'smallint' })
  status: ModelStatus;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_llm_model_created_by',
    name: 'created_by',
  })
  creator?: User;

  @Column({ name: 'updated_by', nullable: true, type: 'uuid' })
  updatedBy?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_llm_model_updated_by',
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
