/*
  Warnings:

  - Added the required column `costOfLiving` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crimeRate` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CostOfLiving" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "costOfLiving" "CostOfLiving" NOT NULL,
ADD COLUMN     "crimeRate" DOUBLE PRECISION NOT NULL;
