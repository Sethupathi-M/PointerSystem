-- DropForeignKey
ALTER TABLE "public"."CounterDayPoints" DROP CONSTRAINT "CounterDayPoints_counterTaskId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CounterTask" DROP CONSTRAINT "CounterTask_taskId_fkey";

-- AddForeignKey
ALTER TABLE "public"."CounterTask" ADD CONSTRAINT "CounterTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CounterDayPoints" ADD CONSTRAINT "CounterDayPoints_counterTaskId_fkey" FOREIGN KEY ("counterTaskId") REFERENCES "public"."CounterTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
