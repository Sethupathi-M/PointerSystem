import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Zap } from "lucide-react";

interface RewardProgressBarProps {
  currentPoints: number;
  requiredPoints: number;
  rewardName: string;
  isRedeemed?: boolean;
}

export const RewardProgressBar = ({ 
  currentPoints, 
  requiredPoints, 
  rewardName, 
  isRedeemed = false 
}: RewardProgressBarProps) => {
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const progressPercentage = Math.min((currentPoints / requiredPoints) * 100, 100);
  const pointsNeeded = Math.max(requiredPoints - currentPoints, 0);
  const isCompleted = currentPoints >= requiredPoints || isRedeemed;

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setProgress(progressPercentage);
      setIsAnimating(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const getProgressColor = () => {
    if (isCompleted) return "from-green-500 to-emerald-400";
    if (progressPercentage >= 80) return "from-blue-500 to-cyan-400";
    if (progressPercentage >= 60) return "from-yellow-500 to-orange-400";
    if (progressPercentage >= 40) return "from-orange-500 to-red-400";
    return "from-gray-500 to-gray-400";
  };

  const getGlowEffect = () => {
    if (isCompleted) return "shadow-green-500/50 shadow-lg";
    if (progressPercentage >= 80) return "shadow-blue-500/30 shadow-md";
    return "";
  };

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={isCompleted ? {
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{
              duration: 0.6,
              repeat: isCompleted ? Infinity : 0,
              repeatDelay: 2
            }}
          >
            <Star className="text-yellow-400" size={16} />
          </motion.div>
          <span className="text-sm font-medium text-zinc-300">
            {isCompleted ? "🎉 Ready to Redeem!" : `💪 ${pointsNeeded} points to go`}
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-400">
            {currentPoints} / {requiredPoints}
          </div>
          <motion.div 
            className="text-xs font-bold text-yellow-400"
            animate={isCompleted ? {
              scale: [1, 1.2, 1]
            } : {}}
            transition={{
              duration: 0.5,
              repeat: isCompleted ? Infinity : 0,
              repeatDelay: 1
            }}
          >
            {Math.round(progressPercentage)}%
          </motion.div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative">
        {/* Background Bar */}
        <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
          {/* Animated Progress Bar */}
          <motion.div
            className={`h-full bg-gradient-to-r ${getProgressColor()} ${getGlowEffect()} relative`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut",
              delay: 0.2
            }}
          >
            {/* Shimmer Effect */}
            {isAnimating && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            )}
            
            {/* Completion Sparkle Effect */}
            {isCompleted && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Zap className="text-white" size={12} />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Progress Milestones */}
        <div className="flex justify-between mt-1">
          {[25, 50, 75, 100].map((milestone) => (
            <div
              key={milestone}
              className={`w-1 h-1 rounded-full ${
                progressPercentage >= milestone 
                  ? "bg-yellow-400" 
                  : "bg-zinc-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Motivational Message */}
      {!isCompleted && (
        <motion.div
          className="text-xs text-zinc-400 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {progressPercentage >= 80 && "Almost there! 🔥"}
          {progressPercentage >= 60 && progressPercentage < 80 && "Great progress! 💪"}
          {progressPercentage >= 40 && progressPercentage < 60 && "Keep going! ⚡"}
          {progressPercentage < 40 && "You've got this! 🚀"}
        </motion.div>
      )}

      {/* Completion Celebration */}
      {isCompleted && !isRedeemed && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-sm font-bold text-green-400 mb-1">
            🎉 {rewardName} is ready!
          </div>
          <div className="text-xs text-green-300">
            Click to redeem your reward
          </div>
        </motion.div>
      )}
    </div>
  );
};
