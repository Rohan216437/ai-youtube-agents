import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ContentStatus } from "@prisma/client";

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  create(data: {
    title: string;
    sourceUrl: string;
    source?: string;
    publishedAt?: string;
  }) {
    return this.prisma.contentItem.create({
      data: {
        title: data.title,
        sourceUrl: data.sourceUrl,
        source: data.source,
        publishedAt: data.publishedAt
          ? new Date(data.publishedAt)
          : null,
        status: ContentStatus.SELECTED,
      },
    });
  }

  async createBulk(articles: Array<{
    title: string;
    sourceUrl: string;
    source?: string;
    publishedAt?: string;
  }>) {
    // Create items one by one to get the created records back
    const created = await Promise.all(
      articles.map(article =>
        this.prisma.contentItem.create({
          data: {
            title: article.title,
            sourceUrl: article.sourceUrl,
            source: article.source,
            publishedAt: article.publishedAt
              ? new Date(article.publishedAt)
              : null,
            status: ContentStatus.SELECTED,
          },
        })
      )
    );
    return { count: created.length, items: created };
  }

  getPending() {
    return this.prisma.contentItem.findMany({
      where: { status: ContentStatus.SELECTED },
      orderBy: { createdAt: "desc" },
      include: { video: true },
    });
  }

  getAll() {
    return this.prisma.contentItem.findMany({
      orderBy: { createdAt: "desc" },
      include: { video: { include: { stats: true } } },
    });
  }

  getById(id: string) {
    return this.prisma.contentItem.findUnique({
      where: { id },
      include: { video: { include: { stats: true } } },
    });
  }

  updateStatus(id: string, status: ContentStatus) {
    return this.prisma.contentItem.update({
      where: { id },
      data: { status },
    });
  }
}
