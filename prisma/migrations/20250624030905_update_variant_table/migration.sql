/*
  Warnings:

  - You are about to drop the column `attributes` on the `Variant` table. All the data in the column will be lost.
  - Added the required column `value` to the `Variant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "attributes",
ADD COLUMN     "value" VARCHAR(1000) NOT NULL;
