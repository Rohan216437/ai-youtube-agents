// src/jobs/jobs.module.ts
import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { PipelineModule } from 'src/pipeline/pipeline.module';

@Module({
  imports: [PipelineModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
