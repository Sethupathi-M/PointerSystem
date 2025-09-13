"use client";
import { Crown } from "lucide-react";
import { HeaderProgressBar } from "./HeaderProgressBar";
import LevelBadge from "./LevelBadge";
import PointsBadge from "./PointsBadge";

interface HeaderProps {
  name: string;
  requiredPoints: number;
  gainedPoints: number;
}

export const Header = ({
  name,
  requiredPoints,
  gainedPoints = 0,
}: HeaderProps) => {
  const netPoints = gainedPoints;

  // Calculate current level based on how much user exceeded required points
  const calculateCurrentLevel = () => {
    if (gainedPoints < requiredPoints) {
      return 1; // Base level if not reached required points
    }
    // Level up for every requiredPoints amount exceeded
    const excessPoints = gainedPoints - requiredPoints;
    const levelsGained = Math.floor(excessPoints / requiredPoints);
    return 1 + levelsGained; // Start from level 1, add gained levels
  };

  const currentLevel = calculateCurrentLevel();

  // Calculate progress for current level (0-100% within current level)
  const getCurrentLevelProgress = () => {
    if (gainedPoints < requiredPoints) {
      return Math.max(0, Math.min(100, (gainedPoints / requiredPoints) * 100));
    }
    // For levels beyond 1, calculate progress within current level
    const excessPoints = gainedPoints - requiredPoints;
    const pointsInCurrentLevel = excessPoints % requiredPoints;
    return Math.min(100, (pointsInCurrentLevel / requiredPoints) * 100);
  };

  const progress = getCurrentLevelProgress();

  return (
    <div className="relative rounded-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 border border-slate-700/50 animate-in slide-in-from-top-4 fade-in duration-700">
      {/* Epic Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-transparent to-emerald-400/10 animate-pulse" />

      {/* Floating Icons */}
      <div className="absolute top-1 right-1 animate-spin-slow">
        <Crown className="text-yellow-400 animate-bounce" size={20} />
      </div>

      {/* Header Content */}
      <div className="relative z-10 space-y-1">
        {/* Name and Level */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold first-letter:uppercase bg-gradient-to-r from-white via-cyan-100 to-emerald-200 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
            {name}
          </div>
          <div className="flex items-center gap-2">
            <PointsBadge
              netPoints={netPoints}
              requiredPoints={requiredPoints}
            />
            <LevelBadge currentLevel={currentLevel} />
          </div>
        </div>

        {/* Progress Bar */}
        <HeaderProgressBar progress={progress} />
      </div>
    </div>
  );
};
