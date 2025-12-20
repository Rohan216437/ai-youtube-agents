import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

import { PrismaModule } from "./prisma/prisma.module";
import { ContentModule } from "./content/content.module";
import { VideoModule } from "./video/video.module";
import { PipelineModule } from "./pipeline/pipeline.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    PrismaModule,
    ContentModule,
    VideoModule,
    PipelineModule,
  ],
})
export class AppModule {}
