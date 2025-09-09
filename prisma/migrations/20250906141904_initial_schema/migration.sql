/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."PointsType" AS ENUM ('POSITIVE', 'NEGATIVE');

-- CreateEnum
CREATE TYPE "public"."TaskType" AS ENUM ('DEFAULT', 'COUNTER');

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."Reward" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL,
    "imageCollection" TEXT[],
    "cost" INTEGER NOT NULL,
    "isRedeemed" BOOLEAN NOT NULL DEFAULT false,
    "redeemedAt" DATE,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Identity" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requiredPoints" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Identity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Task" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "taskType" "public"."TaskType" NOT NULL DEFAULT 'DEFAULT',
    "isFavorited" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isAddedToToday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL,
    "points" INTEGER NOT NULL,
    "pointsType" "public"."PointsType" NOT NULL,
    "identityId" UUID NOT NULL,
    "hasSubTasks" BOOLEAN NOT NULL DEFAULT false,
    "isSubTask" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CounterTask" (
    "id" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CounterTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubTask" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isAddedToToday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL,
    "parentTaskId" UUID NOT NULL,

    CONSTRAINT "SubTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reward_isRedeemed_idx" ON "public"."Reward"("isRedeemed");

-- CreateIndex
CREATE INDEX "Identity_isActive_idx" ON "public"."Identity"("isActive");

-- CreateIndex
CREATE INDEX "Task_isActive_idx" ON "public"."Task"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "CounterTask_taskId_key" ON "public"."CounterTask"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "SubTask_parentTaskId_key" ON "public"."SubTask"("parentTaskId");

-- CreateIndex
CREATE INDEX "SubTask_isActive_idx" ON "public"."SubTask"("isActive");

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "public"."Identity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CounterTask" ADD CONSTRAINT "CounterTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubTask" ADD CONSTRAINT "SubTask_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "public"."Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
