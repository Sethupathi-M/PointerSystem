"use client";

import React from "react";

interface ProgressEnergyBarProps {
  progress: number;
  barWidth: number;
}

const ProgressEnergyBar: React.FC<ProgressEnergyBarProps> = ({
  progress,
  barWidth,
}) => {
  return (
    <div
      className="w-full relative"
      role="progressbar"
      aria-valuenow={barWidth}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Epic progress: ${Math.round(barWidth)}% complete`}
    >
      <div className="relative">
        {/* Energy container with plasma effect */}
        <div
          className={`
            w-full h-5 rounded-2xl overflow-hidden border-2 border-zinc-600/50
            bg-gradient-to-r from-zinc-800/70 via-zinc-900/90 to-zinc-800/70
            relative before:absolute before:inset-0 before:bg-gradient-to-r
            before:from-amber-400/25 before:to-emerald-400/25 before:animate-epic-wave
            ${progress >= 100 ? "border-emerald-400/70 animate-epic-glow" : "group-hover:border-amber-400/60"}
          `}
        >
          <div
            className={`
              h-full rounded-xl relative overflow-hidden transition-all duration-2000 cubic-bezier(0.4, 0, 0.2, 1)
              group-hover:scale-x-103 origin-left shadow-2xl
              ${
                progress >= 90
                  ? "bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 shadow-emerald-500/50 animate-epic-surge"
                  : progress >= 70
                    ? "bg-gradient-to-r from-cyan-400 via-teal-500 to-emerald-600 shadow-cyan-500/50 animate-epic-flow"
                    : progress >= 50
                      ? "bg-gradient-to-r from-blue-400 via-cyan-500 to-sky-500 shadow-blue-500/50 animate-epic-pulse"
                      : progress >= 25
                        ? "bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-600 shadow-orange-500/50 animate-epic-build"
                        : "bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-600 shadow-amber-500/50 animate-epic-spark"
              }
              after:absolute after:inset-0 after:bg-gradient-to-r after:from-white/0 after:via-white/50 after:to-white/0
              after:animate-epic-shine after:-skew-x-12
            `}
            style={{
              width: `${barWidth}%`,
              transform: `scaleX(${barWidth / 100})`,
            }}
          >
            {/* Energy particles */}
            {barWidth > 20 &&
              Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className={`
                    absolute top-0 w-0.5 h-full bg-white/70 rounded animate-epic-particle
                    ${i === 0 ? "left-1/4 delay-75" : i === 1 ? "left-1/2 delay-150" : i === 2 ? "left-3/4 delay-0" : "right-1/4 delay-300"}
                  `}
                />
              ))}
          </div>
        </div>

        {/* Epic progress label with energy effect */}
        {barWidth > 15 && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
            <div
              className={`
                inline-flex items-center gap-1.5 px-4 py-2 bg-black/95 text-white text-sm font-black
                rounded-full backdrop-blur-lg border border-amber-400/40 shadow-2xl
                animate-epic-float ring-1 ring-white/20
                ${progress >= 100 ? "bg-emerald-500/95 border-emerald-400/60 text-emerald-900 animate-epic-bounce" : ""}
              `}
            >
              <span className="relative">{Math.round(barWidth)}</span>
              <span className="text-xs tracking-wide">%</span>
              {progress >= 100 && (
                <span className="animate-ping text-lg">⚡</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { ProgressEnergyBar };
