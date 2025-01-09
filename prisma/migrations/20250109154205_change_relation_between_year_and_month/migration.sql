/*
  Warnings:

  - You are about to drop the column `yearId` on the `Month` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Month" DROP CONSTRAINT "Month_yearId_fkey";

-- AlterTable
ALTER TABLE "Month" DROP COLUMN "yearId";

-- CreateTable
CREATE TABLE "_MonthToYear" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MonthToYear_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MonthToYear_B_index" ON "_MonthToYear"("B");

-- AddForeignKey
ALTER TABLE "_MonthToYear" ADD CONSTRAINT "_MonthToYear_A_fkey" FOREIGN KEY ("A") REFERENCES "Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MonthToYear" ADD CONSTRAINT "_MonthToYear_B_fkey" FOREIGN KEY ("B") REFERENCES "Year"("yearNumber") ON DELETE CASCADE ON UPDATE CASCADE;
