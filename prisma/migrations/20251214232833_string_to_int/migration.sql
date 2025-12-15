/*
  Warnings:

  - The `bathrooms` column on the `properties` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `stairFlights` column on the `properties` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `bedrooms` on the `properties` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `suites` on the `properties` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `parkingSpots` on the `properties` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "bedrooms",
ADD COLUMN     "bedrooms" INTEGER NOT NULL,
DROP COLUMN "suites",
ADD COLUMN     "suites" INTEGER NOT NULL,
DROP COLUMN "bathrooms",
ADD COLUMN     "bathrooms" INTEGER,
DROP COLUMN "parkingSpots",
ADD COLUMN     "parkingSpots" INTEGER NOT NULL,
DROP COLUMN "stairFlights",
ADD COLUMN     "stairFlights" INTEGER;
