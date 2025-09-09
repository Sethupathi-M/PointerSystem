-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Task_isLocked_idx" ON "public"."Task"("isLocked");
