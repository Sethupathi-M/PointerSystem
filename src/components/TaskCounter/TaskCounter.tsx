"use client";
import { PointsType, Task, CounterTask } from "@/generated/prisma";
import { taskApi } from "@/lib/api/taskApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CounterWidget from "./CounterWidget";
import { useIdentityContext } from "../IdentityContext";

// Type for tasks with counter relation
type TaskWithCounterRelation = Task & {
  counterTask?:
    | (CounterTask & {
        CounterDayPoints?: Array<{
          id: string;
          points: number;
          day: Date;
        }>;
      })
    | null;
};

interface TaskCounterProps {
  taskId: string;
  currentCount: number;
  targetCount: number;
  isCompleted?: boolean;
  disabled?: boolean;
  inputPoints?: number;
  pointsType?: PointsType;
}

export const TaskCounter = ({
  taskId,
  currentCount,
  targetCount,
  isCompleted = false,
  disabled = false,
  inputPoints = 0,
  pointsType = PointsType.POSITIVE,
}: TaskCounterProps) => {
  const identity = useIdentityContext();
  // Ensure values are integers
  const intCurrentCount = parseInt(String(currentCount), 10) || 0;
  const intTargetCount = parseInt(String(targetCount), 10) || 1;

  const [localCount, setLocalCount] = useState(intCurrentCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const queryClient = useQueryClient();

  // Sync local count with prop changes
  useEffect(() => {
    setLocalCount(intCurrentCount);
  }, [intCurrentCount]);

  const getValidPoints = () => {
    return typeof inputPoints === "number" && !isNaN(inputPoints)
      ? inputPoints
      : 100;
  };
  const { mutate: incrementCounter, isPending } = useMutation({
    mutationFn: async () => {
      // Ensure points is a valid number and pointsType is a valid enum
      const validPoints = getValidPoints();
      const validPointsType = pointsType || PointsType.POSITIVE;

      return taskApi.incrementCounterWithPoints(
        taskId,
        validPoints,
        validPointsType
      );
    },
    onMutate: async () => {
      // Cancel any outgoing refetches to avoid conflicts
      await queryClient.cancelQueries({ queryKey: ["task"] });
      await queryClient.cancelQueries({ queryKey: ["today", "task"] });

      // Snapshot the previous values
      const previousTasks = queryClient.getQueryData(["task"]);
      const previousTodayTasks = queryClient.getQueryData(["today", "task"]);

      // Optimistically update the counter in all task queries
      const updateCounterTask = (tasks: TaskWithCounterRelation[]) =>
        tasks?.map((task: TaskWithCounterRelation) => {
          if (task.id === taskId && task.counterTask) {
            const validPoints = getValidPoints();
            const accumulatedPoints =
              task.counterTask.CounterDayPoints?.reduce(
                (sum, point) => sum + point.points,
                0
              ) || 0;
            return {
              ...task,
              counterTask: {
                ...task.counterTask,
                count: task.counterTask.count + 1,
                CounterDayPoints: [
                  {
                    ...task.counterTask.CounterDayPoints?.[0],
                    points: accumulatedPoints + validPoints,
                  },
                ],
              },
            };
          }
          return task;
        });

      queryClient.setQueryData(["task", identity.id], updateCounterTask);
      queryClient.setQueryData(["today", "task"], updateCounterTask);

      // Optimistically update local state
      setLocalCount((prev) => prev + 1);

      return {
        previousTasks,
        previousTodayTasks,
        previousLocalCount: intCurrentCount,
      };
    },
    onError: (error, variables, context) => {
      console.error("Failed to increment counter:", error);

      // Rollback all optimistic updates
      if (context?.previousTasks) {
        queryClient.setQueryData(["task"], context.previousTasks);
      }
      if (context?.previousTodayTasks) {
        queryClient.setQueryData(["today", "task"], context.previousTodayTasks);
      }
      if (context?.previousLocalCount !== undefined) {
        setLocalCount(context.previousLocalCount);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["identity", identity.id] });
    },
  });

  const handleIncrement = (e: React.MouseEvent) => {
    if (disabled || isCompleted || isPending) return;
    e.stopPropagation();

    setIsAnimating(true);
    incrementCounter();
    setTimeout(() => setIsAnimating(false), 200);
  };

  const progress = Math.min(100, (localCount / intTargetCount) * 100);
  const isTargetReached = localCount >= intTargetCount;

  return (
    <CounterWidget
      localCount={localCount}
      setLocalCount={setLocalCount}
      isAnimating={isAnimating}
      handleIncrement={handleIncrement}
      isCompleted={isCompleted}
      isPending={isPending}
      disabled={disabled}
      intTargetCount={intTargetCount}
      progress={progress}
      isTargetReached={isTargetReached}
    />
  );
};
