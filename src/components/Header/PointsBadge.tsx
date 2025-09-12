import { Zap } from "lucide-react";
import React from "react";

const PointsBadge = ({
  netPoints,
  requiredPoints,
}: {
  netPoints: number;
  requiredPoints: number;
}) => {
  return (
    <div className="flex justify-center items-center text-center p-1 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-sm border border-slate-600/30 hover:scale-102 transition-transform duration-200">
      <div className="flex items-center justify-center gap-0.5 mb-0.5">
        <Zap className="text-yellow-400" size={20} />
      </div>
      <div
        className={`text-2xl font-bold ${netPoints < 0 ? "text-red-400" : netPoints > 0 ? "text-green-400" : "text-slate-400"}`}
      >
        {netPoints >= 0 ? "+" : ""}
        {netPoints}
      </div>
      <div className="text-2xl text-slate-400">/{requiredPoints}</div>
    </div>
  );
};

export default PointsBadge;
