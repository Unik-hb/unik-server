-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "airConditioning" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "closet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pool" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sevantsRoom" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "terrace" BOOLEAN NOT NULL DEFAULT false;
