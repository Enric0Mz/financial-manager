/*
  Warnings:

  - You are about to drop the column `name` on the `Month` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[month]` on the table `Month` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `month` to the `Month` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MonthName" AS ENUM ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

-- DropIndex
DROP INDEX "Month_name_key";

-- AlterTable
ALTER TABLE "Month" DROP COLUMN "name",
ADD COLUMN     "month" "MonthName" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Month_month_key" ON "Month"("month");
