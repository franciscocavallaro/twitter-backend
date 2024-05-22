/*
  Warnings:

  - You are about to drop the column `isComment` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "isComment",
ADD COLUMN     "isRelatedTo" TEXT;
