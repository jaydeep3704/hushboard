/*
  Warnings:

  - You are about to drop the column `isAcceptingMessages` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "isAcceptingMessages" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAcceptingMessages";
