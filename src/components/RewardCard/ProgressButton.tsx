import { motion } from "framer-motion";
import { Star, Zap, Lock, TrendingUp } from "lucide-react";

interface ProgressButtonProps {
  currentPoints: number;
  requiredPoints: number;
  isRedeemed?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export const ProgressButton = ({
  currentPoints,
  requiredPoints,
  isRedeemed = false,
  onClick,
  disabled = false,
}: ProgressButtonProps) => {
  const progressPercentage = Math.min(
    (currentPoints / requiredPoints) * 100,
    100
  );
  const pointsNeeded = Math.max(requiredPoints - currentPoints, 0);
  const isAffordable = currentPoints >= requiredPoints;

  const getButtonConfig = () => {
    if (isRedeemed) {
      return {
        text: "Redeemed",
        icon: <Star size={16} />,
        className:
          "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-green-500/30",
        glow: "shadow-green-500/20",
        disabled: true,
      };
    }

    if (isAffordable) {
      return {
        text: "Redeem Now!",
        icon: <Zap size={16} />,
        className:
          "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/30",
        glow: "shadow-amber-500/20",
        disabled: false,
      };
    }

    if (progressPercentage >= 80) {
      return {
        text: `Almost There! (${pointsNeeded} left)`,
        icon: <TrendingUp size={16} />,
        className:
          "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-blue-500/30",
        glow: "shadow-blue-500/20",
        disabled: true,
      };
    }

    return {
      text: `${pointsNeeded} points needed`,
      icon: <Lock size={16} />,
      className:
        "bg-gradient-to-r from-zinc-600 to-zinc-700 hover:from-zinc-700 hover:to-zinc-800 text-zinc-300 shadow-zinc-500/20",
      glow: "shadow-zinc-500/10",
      disabled: true,
    };
  };

  const config = getButtonConfig();

  return (
    <motion.button
      onClick={(e) => {
        if (onClick && !disabled && !config.disabled) {
          onClick(e);
        }
        e.stopPropagation();
      }}
      disabled={disabled || config.disabled}
      className={`relative overflow-hidden rounded-lg px-4 py-3 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 w-full ${
        config.className
      } ${config.glow} ${
        disabled || config.disabled
          ? "opacity-70 cursor-not-allowed"
          : "cursor-pointer hover:scale-105"
      }`}
      whileHover={!disabled && !config.disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled && !config.disabled ? { scale: 0.95 } : {}}
    >
      {/* Animated Background Effect */}
      {!disabled && !config.disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Progress Bar for Locked State */}
      {!isRedeemed && !isAffordable && (
        <div className="absolute bottom-0 left-0 h-1 bg-white/20 rounded-b-lg overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Icon with Animation */}
      <motion.div
        animate={
          isAffordable && !isRedeemed
            ? {
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1],
              }
            : {}
        }
        transition={{
          duration: 0.6,
          repeat: isAffordable && !isRedeemed ? Infinity : 0,
          repeatDelay: 2,
        }}
      >
        {config.icon}
      </motion.div>

      {/* Button Text */}
      <span className="relative z-10">{config.text}</span>

      {/* Sparkle Effect for Affordable Rewards */}
      {isAffordable && !isRedeemed && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Zap className="text-white/60" size={12} />
          </motion.div>
        </motion.div>
      )}
    </motion.button>
  );
};
