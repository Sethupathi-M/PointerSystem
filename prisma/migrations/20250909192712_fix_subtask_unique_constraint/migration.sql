-- DropIndex
DROP INDEX "public"."SubTask_parentTaskId_key";

-- CreateIndex
CREATE INDEX "SubTask_parentTaskId_idx" ON "public"."SubTask"("parentTaskId");
