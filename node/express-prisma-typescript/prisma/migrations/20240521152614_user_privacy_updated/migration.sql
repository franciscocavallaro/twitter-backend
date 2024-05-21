-- CreateEnum
CREATE TYPE "Privacy" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "privacy" "Privacy" NOT NULL DEFAULT 'PUBLIC';
