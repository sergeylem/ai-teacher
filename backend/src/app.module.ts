import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenaiController } from './openai/openai.controller';
import { OpenaiService } from './openai/openai.service';
import { UserAssessment } from './assessment/entities/user-assessment.entity';
import { AssessmentEntry } from './assessment/entities/assessment-entry.entity';
import { AssessmentModule } from './assessment/assessment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UserAssessment, AssessmentEntry],
      synchronize: true, // In prod is false
    }),
    TypeOrmModule.forFeature([UserAssessment, AssessmentEntry]),
    AssessmentModule,
  ], 
  controllers: [OpenaiController],
  providers: [OpenaiService],
})

export class AppModule { }
