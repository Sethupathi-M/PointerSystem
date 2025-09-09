"use client";
import { HeaderProgressBar } from "./HeaderProgressBar";

interface HeaderProps {
  name: string;
  level: number;
  requiredPoints: number;
  gainedPoints: number;
}
export const Header = ({
  name,
  level,
  requiredPoints,
  gainedPoints = 0,
}: HeaderProps) => {
  // Ensure progress is between 0 and 100, even with negative points
  const progress = Math.max(0, Math.min(100, (gainedPoints / requiredPoints) * 100)); 
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="text-white text-2xl first-letter:uppercase">{name}</div>
        <div className="text-white text-lg font-bold">Level {level}</div>
      </div>
      <HeaderProgressBar progress={progress} />
      <div className="text-white text-lg font-bold">
        Earned Points: <span className={gainedPoints < 0 ? "text-red-400" : "text-green-400"}>
          {gainedPoints}
        </span> / {requiredPoints}
      </div>
    </div>
  );
};
