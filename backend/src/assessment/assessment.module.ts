import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAssessment } from './entities/user-assessment.entity';
import { AssessmentEntry } from './entities/assessment-entry.entity';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { OpenaiService } from '../openai/openai.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAssessment, AssessmentEntry])],
  providers: [AssessmentService, OpenaiService],
  controllers: [AssessmentController],
})
export class AssessmentModule {}
