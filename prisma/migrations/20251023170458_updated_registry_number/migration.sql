/*
  Warnings:

  - The `updatedRegistry` column on the `properties` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "updatedRegistry",
ADD COLUMN     "updatedRegistry" INTEGER;
