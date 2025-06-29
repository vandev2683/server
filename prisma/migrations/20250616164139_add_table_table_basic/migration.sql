-- CreateEnum
CREATE TYPE "TableStatus" AS ENUM ('Available', 'Occupied', 'Reserved', 'Cleaning', 'Disabled');

-- CreateTable
CREATE TABLE "Table" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" "TableStatus" NOT NULL DEFAULT 'Available',
    "location" VARCHAR(1000) NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Table_code_key" ON "Table"("code");
