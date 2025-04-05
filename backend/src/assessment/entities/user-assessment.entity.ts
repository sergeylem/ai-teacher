// user-assessment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AssessmentEntry } from './assessment-entry.entity';

@Entity()
export class UserAssessment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @CreateDateColumn()
  startedAt!: Date;

  @Column({ nullable: true })
  endedAt!: Date;

  @Column({ nullable: true })
  finalLevel!: string; // A1–C2

  @Column({ type: 'text', nullable: true })
  summary!: string;

  @OneToMany(() => AssessmentEntry, entry => entry.assessment, { cascade: true })
  entries!: AssessmentEntry[];
}
