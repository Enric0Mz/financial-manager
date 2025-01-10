-- DropForeignKey
ALTER TABLE "Month" DROP CONSTRAINT "Month_yearId_fkey";

-- AlterTable
ALTER TABLE "Month" ALTER COLUMN "yearId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Month" ADD CONSTRAINT "Month_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("yearNumber") ON DELETE SET NULL ON UPDATE CASCADE;
