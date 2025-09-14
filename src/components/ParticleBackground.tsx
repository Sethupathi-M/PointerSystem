"use client";

import React from "react";

interface ParticleBackgroundProps {
  progress: number;
  className?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  progress,
  className = "",
}) => {
  return (
    <>
      {/* Epic particle background */}
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      >
        <div
          className={`
            absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-amber-400/30 to-emerald-400/30
            rounded-full blur-3xl animate-float-slow opacity-70 group-hover:opacity-100
            ${progress >= 50 ? "animate-pulse" : ""}
          `}
        />
        <div
          className={`
            absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20
            rounded-full blur-2xl animate-float-medium opacity-50 group-hover:opacity-80
          `}
        />
        {progress >= 100 && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/15 via-transparent to-emerald-400/15 animate-shimmer-fast" />
        )}
      </div>

      {/* Epic hover particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`
              absolute w-2 h-2 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-100
              transition-all duration-600 ease-out animate-epic-particle-hover
              ${i * 100}ms
            `}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export { ParticleBackground };
