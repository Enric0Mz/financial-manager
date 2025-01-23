/*
  Warnings:

  - The primary key for the `Month` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Month` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "YearMonth" DROP CONSTRAINT "YearMonth_monthId_fkey";

-- DropIndex
DROP INDEX "Month_numeric_key";

-- AlterTable
ALTER TABLE "Month" DROP CONSTRAINT "Month_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Month_pkey" PRIMARY KEY ("numeric");

-- AddForeignKey
ALTER TABLE "YearMonth" ADD CONSTRAINT "YearMonth_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("numeric") ON DELETE RESTRICT ON UPDATE CASCADE;
