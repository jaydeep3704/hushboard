-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_boardId_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
