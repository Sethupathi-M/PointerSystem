"use client";

import { TrophyIcon } from "@heroicons/react/24/outline";
import { StarsIcon } from "lucide-react";

export const CommonHeader = () => {
  return (
    <div className="flex justify-between w-full items-center px-5">
      <p className="text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-600 p-2 rounded-lg text-amber-950">
        SAVE THE FUTURE YOU, FROM YOU
      </p>
      <div className="flex gap-2">
        <div className="text-lg px-2 flex items-center gap-2 text-amber-950 p-1 rounded-lg bg-gradient-to-r from-amber-200 to-amber-600">
          <div>
            <span className="font-bold">8 Days</span>
          </div>
          <TrophyIcon className="size-8" />
        </div>
        <div className="text-lg px-2 flex items-center gap-2 text-amber-950 p-1 rounded-lg bg-gradient-to-r from-amber-200 to-amber-600">
          <div>
            <span className="italic">Earned Points:</span>
            <span className="font-bold">1000</span>
          </div>
          <StarsIcon />
        </div>
      </div>
    </div>
  );
};
