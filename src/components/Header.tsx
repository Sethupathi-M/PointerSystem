"use client";
import { HeaderProgressBar } from "./HeaderProgressBar";
import { TrendingUp, TrendingDown, Crown, Zap, Target } from "lucide-react";

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
  // Calculate positive and negative points separately
  const positivePoints = Math.max(0, gainedPoints);
  const negativePoints = Math.abs(Math.min(0, gainedPoints));
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
          <div className="flex items-center gap-0.5 px-1 py-0.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 rounded-sm backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <Target className="text-purple-300" size={20} />
            <div className="text-white">
              <div className="text-lg font-bold">L{currentLevel}</div>
            </div>
          </div>
        </div>

        

        {/* Progress Bar */}
        <HeaderProgressBar progress={progress} />

        {/* Points Display - Micro Compact Grid */}
        <div className="grid grid-cols-3 gap-0.5">
          {/* Net Points */}
          <div className="flex justify-center items-center text-center p-1 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-sm border border-slate-600/30 hover:scale-102 transition-transform duration-200">
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              <Zap className="text-yellow-400" size={20} />
              <span className="text-lg font-medium text-slate-300 mr-4">NET</span>
            </div>
            <div className={`text-2xl font-bold ${netPoints < 0 ? "text-red-400" : netPoints > 0 ? "text-green-400" : "text-slate-400"}`}>
              {netPoints >= 0 ? "+" : ""}{netPoints}
            </div>
            <div className="text-2xl text-slate-400">/{requiredPoints}</div>
          </div>

          {/* Positive Points */}
          <div className="flex justify-center items-center text-center p-1 bg-gradient-to-br from-emerald-900/30 to-green-900/30 rounded-sm border border-emerald-500/30 hover:scale-102 transition-transform duration-200">
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              <TrendingUp className="text-emerald-400" size={20} />
              <div className="text-lg text-emerald-500 font-bold mr-4">Earned</div>
              <span className="text-lg font-medium text-emerald-300">+</span>
            </div>
            <div className="text-lg font-bold text-emerald-400">
              {positivePoints}
            </div>
           
          </div>

          {/* Negative Points */}
          <div className="flex justify-center items-center text-center p-1 bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-sm border border-red-500/30 hover:scale-102 transition-transform duration-200">
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              <TrendingDown className="text-red-400" size={20} />
            <div className="text-lg text-red-500 font-bold mr-4">Lost</div>
              <span className="text-lg font-medium text-red-300">-</span>
            </div>
            <div className="text-lg font-bold text-red-400">
              {negativePoints}
            </div>
          </div>
        </div>

        {/* Progress Percentage - Micro Compact */}
        {/* <div className="text-center animate-in fade-in duration-500 delay-500">
          <div className="text-xs font-bold text-white">
            {Math.round(progress)}% Complete
          </div>
        </div> */}
      </div>
    </div>
  );
};
