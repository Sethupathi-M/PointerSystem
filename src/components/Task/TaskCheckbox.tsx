"use client";
import { Checkbox } from "@headlessui/react";
import { Lock } from "lucide-react";

export const TaskCheckbox = ({
  enabled,
  setEnabled,
  isLocked = false,
}: {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  isLocked?: boolean;
}) => {
  return (
    <div className="relative">
      <Checkbox
        checked={enabled}
        onChange={setEnabled}
        disabled={isLocked}
        className={`group block border rounded-lg size-5 transition-all duration-200 ${
          isLocked 
            ? "bg-zinc-600 border-zinc-500 cursor-not-allowed opacity-60" 
            : "hover:border-blue-400 hover:bg-blue-500/10"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {isLocked ? (
          <Lock className="w-3 h-3 text-zinc-400 absolute inset-0 m-auto" />
        ) : (
          <svg
            className="stroke-white opacity-0 group-data-checked:opacity-100 transition-opacity duration-200"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M3 8L6 11L11 3.5"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </Checkbox>
      
      {/* Lock indicator tooltip */}
      {isLocked && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Task locked (used for reward)
        </div>
      )}
    </div>
  );
};
