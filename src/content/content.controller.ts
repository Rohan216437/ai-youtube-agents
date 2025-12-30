import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ContentService } from "./content.service";
import { NewsService } from "./news.service";

@Controller("content")
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
    private readonly newsService: NewsService,
  ) {}

  @Get("news")
  async getNews() {
    return this.newsService.fetchTopHeadlines();
  }

  @Post("create")
  create(@Body() body: any) {
    return this.contentService.create(body);
  }

  @Post("create-bulk")
  async createBulk(@Body() body: { articles: any[] }) {
    return this.contentService.createBulk(body.articles);
  }

  @Get("pending")
  getPending() {
    return this.contentService.getPending();
  }

  @Get("all")
  getAll() {
    return this.contentService.getAll();
  }

  @Get(":id")
  getOne(@Param("id") id: string) {
    return this.contentService.getById(id);
  }
}
