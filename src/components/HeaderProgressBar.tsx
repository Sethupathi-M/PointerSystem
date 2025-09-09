"use client";

export const HeaderProgressBar = ({ progress }: { progress: number }) => {
  const getProgressColor = () => {
    if (progress >= 100) return "from-yellow-500 via-yellow-400 to-yellow-300";
    if (progress >= 80) return "from-emerald-500 via-emerald-400 to-emerald-300";
    if (progress >= 60) return "from-blue-500 via-blue-400 to-blue-300";
    if (progress >= 40) return "from-cyan-500 via-cyan-400 to-cyan-300";
    if (progress >= 20) return "from-purple-500 via-purple-400 to-purple-300";
    return "from-slate-500 via-slate-400 to-slate-300";
  };

  const getGlowColor = () => {
    if (progress >= 100) return "shadow-yellow-500/50";
    if (progress >= 80) return "shadow-emerald-500/50";
    if (progress >= 60) return "shadow-blue-500/50";
    if (progress >= 40) return "shadow-cyan-500/50";
    if (progress >= 20) return "shadow-purple-500/50";
    return "shadow-slate-500/50";
  };

  return (
    <div className="relative w-full">
      {/* Background */}
      <div className="w-full h-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded-sm border border-slate-600/30 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        
        {/* Progress Fill */}
        <div
          className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-sm relative overflow-hidden shadow-lg ${getGlowColor()} transition-all duration-1500 ease-out`}
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          
          {/* Progress Text */}
          <div className="absolute inset-0 flex items-center justify-end pr-1">
            <span className="text-xs font-bold text-slate-900 drop-shadow-sm animate-in fade-in duration-500 delay-1000">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
