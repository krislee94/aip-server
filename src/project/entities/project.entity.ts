import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProjectStatus {
  Active = 'active',
  Archived = 'archived',
  Draft = 'draft',
}

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 120 })
  name: string;

  @Column({ length: 500, nullable: true })
  description?: string;

  @Column({
    default: ProjectStatus.Draft,
    enum: ProjectStatus,
    type: 'enum',
  })
  status: ProjectStatus;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
