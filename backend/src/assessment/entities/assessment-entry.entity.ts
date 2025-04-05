// assessment-entry.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserAssessment } from './user-assessment.entity';

@Entity()
export class AssessmentEntry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UserAssessment, assessment => assessment.entries, { onDelete: 'CASCADE' })
  assessment!: UserAssessment;

  @Column()
  question!: string;

  @Column()
  transcription!: string;

  @Column()
  grammarScore!: number;

  @Column()
  vocabScore!: number;

  @Column()
  complexityScore!: number;

  @Column()
  estimatedLevel!: string;

  @Column({ type: 'text' })
  mistakes!: string;

  @Column({ type: 'text' })
  explanation!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
