import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAssessment } from './entities/user-assessment.entity';
import { AssessmentEntry } from './entities/assessment-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAssessment, AssessmentEntry])],
  exports: [TypeOrmModule], // The other modules could use entities
})
export class AssessmentModule {}
