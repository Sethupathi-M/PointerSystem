import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="w-12 h-12 border-4 border-zinc-200 border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
