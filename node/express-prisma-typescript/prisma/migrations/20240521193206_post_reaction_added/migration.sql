-- CreateEnum
CREATE TYPE "Reaction" AS ENUM ('LIKE', 'RETWEET');

-- CreateTable
CREATE TABLE "PostReactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PostReactions_pkey" PRIMARY KEY ("id")
);
