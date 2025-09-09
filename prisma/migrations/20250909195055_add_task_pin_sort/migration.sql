-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sortValue" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Task_isPinned_idx" ON "public"."Task"("isPinned");

-- CreateIndex
CREATE INDEX "Task_sortValue_idx" ON "public"."Task"("sortValue");
