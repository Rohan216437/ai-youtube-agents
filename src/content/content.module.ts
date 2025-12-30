import { Module } from "@nestjs/common";
import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";
import { NewsService } from "./news.service";
import { PrismaModule } from "../prisma/prisma.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  controllers: [ContentController],
  providers: [ContentService, NewsService],
  imports: [PrismaModule, HttpModule],
  exports: [ContentService],
})
export class ContentModule {}
