import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AssessmentModule } from './assessment/assessment.module';
import { User } from './assessment/entities/user.entity';
import { UserAssessment } from './assessment/entities/user-assessment.entity';
import { AssessmentEntry } from './assessment/entities/assessment-entry.entity';
import { OpenaiModule } from './openai/openai.module'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, UserAssessment, AssessmentEntry],
      synchronize: true,
    }),
    AuthModule,
    AssessmentModule,
    OpenaiModule,
  ],
})
export class AppModule {}
