"use client";
import { PointsType } from "@/generated/prisma";
import { taskApi } from "@/lib/api/taskApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CounterPointsBadge from "./CounterPointsBadge";
import CounterWidget from "./CounterWidget";
import PointsInput from "./PointsInput";

interface CounterUIProps {
  taskId: string;
  currentCount: number;
  targetCount: number;
  isCompleted?: boolean;
  disabled?: boolean;
  defaultPoints?: number;
  accumulatedPoints?: number;
  inputPoints?: number;
  pointsType?: PointsType;
}

export const CounterUI = ({
  taskId,
  currentCount,
  targetCount,
  isCompleted = false,
  disabled = false,
  inputPoints = 0,
  pointsType = PointsType.POSITIVE,
  defaultPoints = 100,
  accumulatedPoints = 0,
}: CounterUIProps) => {
  // Ensure values are integers
  const intCurrentCount = parseInt(String(currentCount), 10) || 0;
  const intTargetCount = parseInt(String(targetCount), 10) || 1;

  const [localCount, setLocalCount] = useState(intCurrentCount);
  const [isAnimating, setIsAnimating] = useState(false);
  // const [inputPoints, setInputPoints] = useState(defaultPoints);
  // const [pointsType, setPointsType] = useState<PointsType>(PointsType.POSITIVE);
  const queryClient = useQueryClient();

  // Sync local count with prop changes
  useEffect(() => {
    setLocalCount(intCurrentCount);
  }, [intCurrentCount]);

  const { mutate: incrementCounter, isPending } = useMutation({
    mutationFn: () =>
      taskApi.incrementCounterWithPoints(taskId, inputPoints, pointsType),
    onSuccess: () => {
      setLocalCount((prev) => prev + 1);
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["identity"] });
    },
    onError: (error) => {
      console.error("Failed to increment counter:", error);
      setLocalCount(intCurrentCount);
    },
  });

  const handleIncrement = () => {
    if (disabled || isCompleted || isPending) return;
    setIsAnimating(true);
    incrementCounter();
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleDecrement = () => {
    if (disabled || isCompleted || isPending || localCount <= 0) return;
    setLocalCount((prev) => Math.max(0, prev - 1));
    // TODO: Add decrement API call if needed
  };

  const progress = Math.min(100, (localCount / intTargetCount) * 100);
  const isTargetReached = localCount >= intTargetCount;

  return (
    <div className="flex flex-col gap-3">
      {/* Points Input Section */}
      {/* <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <PointsInput
            points={inputPoints}
            setPoints={setInputPoints}
            pointsType={pointsType}
            setPointsType={setPointsType}
            disabled={disabled}
          />
        </div> */}

      {/* Accumulated Points Badge */}
      {/* </div> */}

      {/* Counter Widget */}
      <CounterWidget
        localCount={localCount}
        setLocalCount={setLocalCount}
        isAnimating={isAnimating}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        isCompleted={isCompleted}
        isPending={isPending}
        disabled={disabled}
        intTargetCount={intTargetCount}
        progress={progress}
        isTargetReached={isTargetReached}
      />
    </div>
  );
};
