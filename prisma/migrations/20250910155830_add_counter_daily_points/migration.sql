-- AlterTable
ALTER TABLE "public"."CounterTask" ADD COLUMN     "defaultPoints" INTEGER NOT NULL DEFAULT 100;

-- CreateTable
CREATE TABLE "public"."CounterDayPoints" (
    "id" UUID NOT NULL,
    "counterTaskId" UUID NOT NULL,
    "day" DATE NOT NULL,
    "points" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CounterDayPoints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CounterDayPoints_counterTaskId_idx" ON "public"."CounterDayPoints"("counterTaskId");

-- CreateIndex
CREATE INDEX "CounterDayPoints_day_idx" ON "public"."CounterDayPoints"("day");

-- CreateIndex
CREATE UNIQUE INDEX "CounterDayPoints_counterTaskId_day_key" ON "public"."CounterDayPoints"("counterTaskId", "day");

-- AddForeignKey
ALTER TABLE "public"."CounterDayPoints" ADD CONSTRAINT "CounterDayPoints_counterTaskId_fkey" FOREIGN KEY ("counterTaskId") REFERENCES "public"."CounterTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
