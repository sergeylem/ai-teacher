import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAssessment } from './entities/user-assessment.entity';
import { AssessmentEntry } from './entities/assessment-entry.entity';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';
import { OpenaiService } from '../openai/openai.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAssessment, AssessmentEntry])],
  controllers: [AssessmentController],
  providers: [AssessmentService, OpenaiService],
  exports: [TypeOrmModule], // The other modules could use entities
})
export class AssessmentModule {}
