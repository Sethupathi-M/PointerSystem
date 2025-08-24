import { LockKeyholeIcon } from "lucide-react";
import React from "react";

const LockedInProgressButton = () => {
  return (
    <button
      onClick={(e) => {
        console.log("clicked Locked");
        e.stopPropagation();
      }}
      className="relative p-2 cursor-pointer text-lg gap-2 bg-yellow-950 hover:bg-yellow-900 rounded-lg w-full text-yellow-100 font-bold flex justify-center items-center"
    >
      <div className="absolute top-0 left-0 bg-amber-600 z-10 h-full rounded-lg w-40"></div>
      <LockKeyholeIcon className="z-50" size={23} />
      <span className="z-50">Locked</span>
    </button>
  );
};

export default LockedInProgressButton;
