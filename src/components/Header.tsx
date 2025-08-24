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
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="text-white text-lg">{name}</div>
        <div className="text-white text-lg font-bold">L{level}</div>
      </div>
      <HeaderProgressBar />
      <div className="text-white text-xs">
        Points: {gainedPoints}/{requiredPoints}
      </div>
    </div>
  );
};
