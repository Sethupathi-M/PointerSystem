"use client";
import { useState, useEffect } from "react";
import { Plus, Minus, Target } from "lucide-react";
import { taskApi } from "@/lib/api/taskApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface CounterUIProps {
  taskId: string;
  currentCount: number;
  targetCount: number;
  isCompleted?: boolean;
  disabled?: boolean;
}

export const CounterUI = ({
  taskId,
  currentCount,
  targetCount,
  isCompleted = false,
  disabled = false,
}: CounterUIProps) => {
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

  const { mutate: incrementCounter, isPending } = useMutation({
    mutationFn: () => taskApi.incrementCounter(taskId),
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
    <div className="flex items-center gap-2">
      {/* Bigger Counter Widget */}
      <div className="relative bg-gradient-to-br from-slate-700/80 to-slate-800/80 rounded-lg border border-slate-600/50 backdrop-blur-sm">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-lg" />

        <div className="relative z-10 flex items-center gap-2 px-3 py-2">
          {/* Decrement Button */}
          <motion.button
            onClick={handleDecrement}
            disabled={disabled || isCompleted || isPending || localCount <= 0}
            className="p-2 rounded-md bg-slate-600/50 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Decrement counter"
          >
            <Minus size={16} className="text-slate-300 hover:text-red-400" />
          </motion.button>

          {/* Counter Display */}
          <div className="flex items-center gap-2 px-3 py-1 min-w-[80px] justify-center">
            <Target size={16} className="text-blue-400" />
            <motion.span
              className="text-base font-bold text-white"
              animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.2 }}
            >
              {localCount}
            </motion.span>
            <span className="text-base text-slate-400">/{intTargetCount}</span>
          </div>

          {/* Increment Button */}
          <motion.button
            onClick={handleIncrement}
            disabled={disabled || isCompleted || isPending}
            className="p-2 rounded-md bg-slate-600/50 hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Increment counter"
          >
            <Plus size={16} className="text-slate-300 hover:text-emerald-400" />
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-600 rounded-b-lg overflow-hidden">
          <motion.div
            className={`h-full ${isTargetReached ? "bg-gradient-to-r from-emerald-500 to-green-500" : "bg-gradient-to-r from-blue-500 to-purple-500"}`}
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
};
