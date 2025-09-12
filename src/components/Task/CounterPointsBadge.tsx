import { Award } from "lucide-react";
import React from "react";

const CounterPointsBadge = ({
  accumulatedPoints,
}: {
  accumulatedPoints: number;
}) => {
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full border border-emerald-400/30">
      <Award size={14} className="text-emerald-400" />
      <span className="text-sm font-medium text-emerald-300">
        {accumulatedPoints}
      </span>
    </div>
  );
};

export default CounterPointsBadge;
