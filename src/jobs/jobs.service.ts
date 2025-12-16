import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async getJobsForDate(date: Date) {
    const fromStart = new Date(date.toDateString());
    const fromEnd = new Date(fromStart);
    fromEnd.setDate(fromEnd.getDate() + 1);

    return this.prisma.videoJob.findMany({
      where: {
        news: {
          date: {
            gte: fromStart,
            lt: fromEnd,
          },
        },
      },
      include: { news: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
