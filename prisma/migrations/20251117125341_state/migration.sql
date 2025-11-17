-- CreateEnum
CREATE TYPE "State" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "state" "State" DEFAULT 'ACTIVE';
