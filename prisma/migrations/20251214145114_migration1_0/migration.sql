-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('SELECTED', 'SCRIPTING', 'AUDIO_GENERATING', 'VIDEO_GENERATING', 'MERGING', 'UPLOADING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('NOT_UPLOADED', 'UPLOADING', 'UPLOADED', 'FAILED');

-- CreateTable
CREATE TABLE "ContentItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "source" TEXT,
    "publishedAt" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL DEFAULT 'SELECTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "contentItemId" TEXT NOT NULL,
    "videoPath" TEXT,
    "audioPath" TEXT,
    "thumbnailPath" TEXT,
    "youtubeVideoId" TEXT,
    "youtubeUrl" TEXT,
    "uploadStatus" "UploadStatus" NOT NULL DEFAULT 'NOT_UPLOADED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoStat" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_contentItemId_key" ON "Video"("contentItemId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoStat_videoId_key" ON "VideoStat"("videoId");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_contentItemId_fkey" FOREIGN KEY ("contentItemId") REFERENCES "ContentItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoStat" ADD CONSTRAINT "VideoStat_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
