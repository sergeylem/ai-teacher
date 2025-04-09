// src/assessment/assessment.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AssessmentService } from './assessment.service';

@Controller('assessment')
export class AssessmentController {
  constructor(private readonly service: AssessmentService) {}

  @Post('start')
  async start(@Body('userId') userId: string) {
    const session = await this.service.startAssessment(userId);
    return { assessmentId: session.id };
  }

  @Post('entry')
  async entry(@Body() body: {
    assessmentId: string;
    question: string;
    transcription: string;
  }) {
    const result = await this.service.addEntry(body.assessmentId, body.question, body.transcription);
    return { saved: result };
  }
  
  @Post('complete')
  async complete(@Body('assessmentId') assessmentId: string) {
    const result = await this.service.completeAssessment(assessmentId);
    return result;
  }
}
