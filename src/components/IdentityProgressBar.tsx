"use client";

import { Identity } from "@/generated/prisma";
import { QuotesResponse } from "@/types";
import { ProgressEnergyBar } from "./ProgressEnergyBar";
import { ParticleBackground } from "./ParticleBackground";

export interface ExtendedIdentity extends Identity {
  totalAcquiredPoints?: number;
}

interface ProgressBarProps {
  identity: ExtendedIdentity;
  quote?: QuotesResponse;
}

const IdentityProgressBar: React.FC<ProgressBarProps> = ({
  identity,
  quote,
}) => {
  const singlQuote = quote?.find((q) => q.id === identity.id);

  const totalPoints = identity.totalAcquiredPoints || 0;
  const progress =
    identity.requiredPoints > 0
      ? Math.min((totalPoints / identity.requiredPoints) * 100, 100)
      : 0;

  const barWidth = Math.min(Math.max(progress, 0), 100);

  // Enhanced motivational system with progress-based messages

  // Dynamic achievement system
  const getAchievementData = () => {
    const achievements = [
      {
        threshold: 25,
        name: "HEROIC START",
        icon: "🛡️",
        color: "from-amber-500 to-orange-500",
      },
      {
        threshold: 50,
        name: "MYTHIC MIGHT",
        icon: "⚡",
        color: "from-blue-500 to-cyan-500",
      },
      {
        threshold: 70,
        name: "LEGENDARY FORCE",
        icon: "🚀",
        color: "from-purple-500 to-pink-500",
      },
      {
        threshold: 90,
        name: "EPIC DESTINY",
        icon: "🌟",
        color: "from-emerald-500 to-teal-500",
      },
      {
        threshold: 100,
        name: "ULTIMATE LEGEND",
        icon: "🏆",
        color: "from-yellow-500 via-orange-500 to-red-500",
      },
    ];

    const unlockedAchievements = achievements.filter(
      (a) => progress >= a.threshold
    );
    return {
      latest: unlockedAchievements[unlockedAchievements.length - 1],
      all: unlockedAchievements,
    };
  };

  const achievementData = getAchievementData();

  return (
    <article
      className={`
        relative overflow-hidden bg-gradient-to-br from-zinc-900/95 via-zinc-800/70 to-zinc-900/95
        backdrop-blur-xl rounded-2xl p-6 border-2 border-zinc-700/40
        hover:border-amber-400/70 hover:shadow-2xl hover:shadow-amber-500/30
        transition-all duration-700 ease-out group shadow-2xl
        before:absolute before:inset-0 before:bg-gradient-to-r
        before:from-amber-500/10 before:to-emerald-500/10
        before:opacity-0 before:group-hover:opacity-100
        before:transition-opacity
        ${progress >= 100 ? "ring-2 ring-emerald-400/40 animate-epic-glow" : ""}
      `}
      role="article"
      aria-labelledby={`identity-${identity.id}-title`}
    >
      <ParticleBackground progress={progress} />

      {/* Holographic border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/25 via-transparent to-emerald-400/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 animate-border-glow" />

      <div className="relative z-10 flex flex-col space-y-6">
        {/* Epic Header with animated avatar */}
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <header className="flex items-center gap-4 mb-3">
              <div className="min-w-0 flex-1">
                <h3
                  id={`identity-${identity.id}-title`}
                  className={`
                  text-2xl font-black bg-gradient-to-r from-white via-amber-200 to-emerald-200
                  bg-clip-text text-transparent drop-shadow-2xl
                  ${progress >= 100 ? "animate-epic-shake from-emerald-200 via-teal-200 to-cyan-200" : ""}
                `}
                >
                  {identity.name}
                </h3>
                <p className="text-base text-zinc-300/90 group-hover:text-amber-200 transition-colors duration-300">
                  {identity.description}
                </p>
              </div>
            </header>
          </div>

          {/* Epic Points Display with dynamic flair */}
          <div className="flex flex-col items-end gap-2 text-right min-w-[100px]">
            <div
              className={`
              px-4 py-2.5 bg-gradient-to-r from-zinc-800/90 to-zinc-700/70
              rounded-xl text-sm font-black border border-amber-500/40
              backdrop-blur-sm shadow-xl group-hover:shadow-amber-500/30
              transition-all duration-400 group-hover:scale-105
              ${progress >= 100 ? "bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border-emerald-400/50 text-emerald-100" : "text-amber-100"}
            `}
            >
              {Math.round(totalPoints)} / {identity.requiredPoints}
              <span className="text-xs tracking-wide">PTS</span>
            </div>
            <div
              className={`
              text-base font-bold px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm
              ${
                progress >= 90
                  ? "bg-emerald-500/30 text-emerald-300"
                  : progress >= 70
                    ? "bg-cyan-500/30 text-cyan-300"
                    : progress >= 50
                      ? "bg-blue-500/30 text-blue-300"
                      : progress >= 25
                        ? "bg-amber-500/30 text-amber-300"
                        : "bg-yellow-500/30 text-yellow-300"
              }
              animate-bounce-slow ring-1 ring-white/10
            `}
            >
              {Math.round(barWidth)}%
            </div>
          </div>
        </div>

        {/* Epic Energy Progress Bar */}
        <ProgressEnergyBar progress={progress} barWidth={barWidth} />
        <div className="text-lg bg-gradient-to-r italic from-amber-300 via-yellow-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-lg">
          &quot;{singlQuote?.shortQuote}&quot;
        </div>

        {/* Epic Motivational Quest Section */}
        <div className="space-y-4 pt-5 border-t-2 border-zinc-700/50 relative bg-zinc-900/30 rounded-xl p-5 backdrop-blur-sm shadow-inner">
          {/* Dynamic Quest Status */}

          <div className="flex items-center gap-4">
            <div
              className={`
              text-2xl p-3 rounded-full bg-black/40 backdrop-blur-sm shadow-xl
              ${
                progress >= 90
                  ? "bg-emerald-500/30 text-emerald-400 animate-epic-bounce"
                  : progress >= 70
                    ? "bg-cyan-500/30 text-cyan-400 animate-epic-spin"
                    : progress >= 50
                      ? "bg-blue-500/30 text-blue-400 animate-epic-pulse"
                      : progress >= 25
                        ? "bg-amber-500/30 text-amber-400 animate-epic-glow"
                        : "bg-yellow-500/30 text-yellow-400 animate-epic-sparkle"
              }
              ring-1 ring-white/10
            `}
            >
              {progress >= 100
                ? "🏆"
                : progress >= 90
                  ? "⚡"
                  : progress >= 70
                    ? "🚀"
                    : progress >= 50
                      ? "💥"
                      : progress >= 25
                        ? "🔥"
                        : "🌟"}
            </div>
            <div className="flex flex-col gap-2 text-lg bg-gradient-to-r italic from-amber-300 via-yellow-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-lg">
              {singlQuote?.advice}
            </div>
          </div>
        </div>

        {/* Dynamic Achievement Showcase */}
        {achievementData.latest && (
          <div
            className={`transition-all duration-500 animate-in slide-in-from-bottom-2 ${
              progress >= 100 ? "animate-epic-celebrate" : ""
            }`}
          >
            <div
              className={`
              flex items-center gap-3 p-4 bg-gradient-to-r ${
                achievementData.latest.color
              }/10 border border-white/10 rounded-xl backdrop-blur-sm
              ${progress >= 100 ? "ring-2 ring-yellow-400/30 animate-pulse" : ""}
            `}
            >
              <div className="text-2xl animate-bounce-slow">
                {achievementData.latest.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-white/90 uppercase tracking-wide">
                  {achievementData.latest.name}
                </p>
                <p className="text-xs text-amber-300/80">
                  Unlocked at {achievementData.latest.threshold}% •{" "}
                  {Math.round(progress)}% Complete
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Progress Milestone Markers */}
        {progress >= 25 && (
          <div className="absolute bottom-2 left-2 group/milestone">
            <div className="bg-black/70 backdrop-blur-sm border border-amber-500/30 rounded-lg px-3 py-2 text-sm font-mono font-bold text-amber-300/90 hover:text-amber-200 transition-all duration-300 group-hover/milestone:bg-black/80 group-hover/milestone:scale-105">
              {progress >= 100
                ? "🌟 MAX LEVEL ACHIEVED 🌟"
                : progress >= 90
                  ? "⚡ EPIC DESTINY"
                  : progress >= 70
                    ? "🚀 LEGENDARY FORCE"
                    : progress >= 50
                      ? "💥 MYTHIC MIGHT"
                      : "🛡️ HEROIC START"}
              <span className="ml-2 text-xs opacity-75">
                ({Math.round(progress)}%)
              </span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export { IdentityProgressBar };
