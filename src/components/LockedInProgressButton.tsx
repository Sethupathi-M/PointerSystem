import { LockKeyholeIcon } from "lucide-react";
import React from "react";

interface LockedInProgressButtonProps {
  text?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const LockedInProgressButton = ({ text = "Locked", disabled = false, onClick }: LockedInProgressButtonProps) => {
  return (
    <button
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        } else {
          console.log("clicked Locked");
        }
        e.stopPropagation();
      }}
      disabled={disabled}
      className={`relative p-2 cursor-pointer text-lg gap-2 bg-yellow-950 hover:bg-yellow-900 rounded-lg w-full text-yellow-100 font-bold flex justify-center items-center ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div className="absolute top-0 left-0 bg-amber-600 z-10 h-full rounded-lg w-60"></div>
      
      <LockKeyholeIcon className="z-50" size={23} />
      <span className="z-50">{text}</span>
    </button>
  );
};

export default LockedInProgressButton;
