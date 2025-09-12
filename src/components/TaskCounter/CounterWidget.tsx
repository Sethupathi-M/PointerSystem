import { motion } from "framer-motion";
import { Plus, Target } from "lucide-react";

interface CounterWidgetProps {
  localCount: number;
  setLocalCount: (count: number) => void;
  isAnimating: boolean;
  handleIncrement: (e: React.MouseEvent) => void;
  isCompleted: boolean;
  isPending: boolean;
  disabled: boolean;
  intTargetCount: number;
  progress: number;
  isTargetReached: boolean;
}

const CounterWidget = ({
  localCount,
  isAnimating,
  handleIncrement,
  isCompleted,
  isPending,
  disabled,
  intTargetCount,
  progress,
  isTargetReached,
}: CounterWidgetProps) => {
  // const { localCount, setLocalCount, isAnimating, handleIncrement, handleDecrement, isCompleted, isPending, disabled, intTargetCount, progress, isTargetReached } = useCounter();
  return (
    <div className="flex items-center gap-2">
      <div className="relative bg-gradient-to-br from-slate-700/80 to-slate-800/80 rounded-lg border border-slate-600/50 backdrop-blur-sm">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-lg" />

        <div className="relative z-10 flex items-center gap-2 px-3 py-2">
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
            disabled={
              disabled ||
              isCompleted ||
              isPending ||
              localCount >= intTargetCount
            }
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

export default CounterWidget;
