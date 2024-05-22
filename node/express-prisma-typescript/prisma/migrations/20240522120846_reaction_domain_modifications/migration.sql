/*
  Warnings:

  - You are about to drop the `PostReactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'RETWEET');

-- DropTable
DROP TABLE "PostReactions";

-- DropEnum
DROP TYPE "Reaction";

-- CreateTable
CREATE TABLE "Reaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "postId" TEXT NOT NULL,
    "reactorId" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);
