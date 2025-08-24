"use client";

export const HeaderProgressBar = () => {
  return (
    <div className="w-full h-3 bg-zinc-700 rounded-lg">
      <div
        className="h-full bg-gradient-to-r from-green-600 from-[0%] to-green-300 to-[100%] rounded-lg text-xs flex items-center justify-end pr-1 text-zinc-950 italic"
        style={{ width: "50%" }}
      >
        <span className="text-cyan-950">50%</span>
      </div>
    </div>
  );
};
