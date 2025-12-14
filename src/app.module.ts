import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

import { NewsModule } from './news/news.module';
import { PipelineModule } from './pipeline/pipeline.module';
import { JobsModule } from './jobs/jobs.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    HttpModule,
    PrismaModule,
    NewsModule,
    PipelineModule,
    JobsModule,
  ],
})
export class AppModule {}
