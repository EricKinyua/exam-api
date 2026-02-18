-- AlterTable
ALTER TABLE "User" ADD COLUMN "password" TEXT NOT NULL DEFAULT '',
ADD COLUMN "studentClass" TEXT;

-- Remove default so new rows must provide password (existing rows keep '')
ALTER TABLE "User" ALTER COLUMN "password" DROP DEFAULT;
