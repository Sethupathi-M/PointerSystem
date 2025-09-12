import { Target } from "lucide-react";
import React from "react";

const LevelBadge = ({ currentLevel }: { currentLevel: number }) => {
  return (
    <div className="flex items-center gap-0.5 px-1 py-0.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 rounded-sm backdrop-blur-sm hover:scale-105 transition-transform duration-300">
      <Target className="text-purple-300" size={20} />
      <div className="text-white">
        <div className="text-lg font-bold">L{currentLevel}</div>
      </div>
    </div>
  );
};

export default LevelBadge;
