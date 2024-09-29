/*
  Warnings:

  - The primary key for the `Filter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FootpathAssessment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ImageMetadata` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "FootpathAssessment" DROP CONSTRAINT "FootpathAssessment_locationId_fkey";

-- DropForeignKey
ALTER TABLE "ImageMetadata" DROP CONSTRAINT "ImageMetadata_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- AlterTable
ALTER TABLE "Filter" DROP CONSTRAINT "Filter_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Filter_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Filter_id_seq";

-- AlterTable
ALTER TABLE "FootpathAssessment" DROP CONSTRAINT "FootpathAssessment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "locationId" SET DATA TYPE TEXT,
ADD CONSTRAINT "FootpathAssessment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FootpathAssessment_id_seq";

-- AlterTable
ALTER TABLE "ImageMetadata" DROP CONSTRAINT "ImageMetadata_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "locationId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ImageMetadata_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ImageMetadata_id_seq";

-- AlterTable
ALTER TABLE "Location" DROP CONSTRAINT "Location_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Location_id_seq";

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "locationId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Review_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootpathAssessment" ADD CONSTRAINT "FootpathAssessment_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageMetadata" ADD CONSTRAINT "ImageMetadata_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
