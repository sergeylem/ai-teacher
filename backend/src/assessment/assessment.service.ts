// src/assessment/assessment.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAssessment } from './entities/user-assessment.entity';
import { AssessmentEntry } from './entities/assessment-entry.entity';
import { Repository } from 'typeorm';
import { OpenaiService } from '../openai/openai.service';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectRepository(UserAssessment)
    private readonly assessmentRepo: Repository<UserAssessment>,
    @InjectRepository(AssessmentEntry)
    private readonly entryRepo: Repository<AssessmentEntry>,
    private readonly openaiService: OpenaiService,
  ) {}

  async startAssessment(userId: string) {
    const assessment = this.assessmentRepo.create({ userId });
    return await this.assessmentRepo.save(assessment);
  }

  async addEntry(assessmentId: string, question: string, transcription: string) {
    const assessment = await this.assessmentRepo.findOneByOrFail({ id: assessmentId });

    const evaluation = await this.openaiService.evaluateResponse(transcription);

    const entry = this.entryRepo.create({
      assessment,
      question,
      transcription,
      grammarScore: evaluation.grammarScore,
      vocabScore: evaluation.vocabScore,
      complexityScore: evaluation.complexityScore,
      estimatedLevel: evaluation.estimatedLevel,
      mistakes: evaluation.mistakes,
      explanation: evaluation.explanation,
    });

    return await this.entryRepo.save(entry);
  }

  async completeAssessment(assessmentId: string) {
    const entries = await this.entryRepo.find({
      where: { assessment: { id: assessmentId } },
    });

    const levelStats: Record<string, number> = {};
    for (const entry of entries) {
      const level = entry.estimatedLevel.toUpperCase();
      levelStats[level] = (levelStats[level] || 0) + 1;
    }

    const finalLevel = Object.entries(levelStats).sort((a, b) => b[1] - a[1])[0][0];
    const summary = `Final level based on ${entries.length} answers: ${finalLevel}`;

    await this.assessmentRepo.update(assessmentId, {
      finalLevel,
      endedAt: new Date(),
      summary,
    });

    return { finalLevel, summary };
  }
}
