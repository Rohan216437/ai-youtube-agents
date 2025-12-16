import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PipelineService } from 'src/pipeline/pipeline.service';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly pipeline: PipelineService,
    private readonly jobsService: JobsService,
  ) {}

  @Post('create-from-news')
  async createFromNews(@Body('ids') ids: number[]) {
    // sequential v1; you can later run these as background jobs
    const results: { jobId: number; ytId: string; instaId: string }[] = [];
    for (const id of ids) {
      const res = await this.pipeline.runFullPipeline(id);
      results.push(res);
    }
    return { success: true, results };
  }

  @Get()
  async listJobs(@Query('date') dateStr?: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    const jobs = await this.jobsService.getJobsForDate(date);
    return jobs;
  }
}
