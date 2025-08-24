import { WandSparklesIcon } from "lucide-react";
import React from "react";

const RedeemButton = () => {
  return (
    <button
      onClick={(e) => {
        console.log("clicked Redeem");
        e.stopPropagation();
      }}
      className="p-2 cursor-pointer text-lg gap-2 bg-amber-600 hover:bg-amber-500 rounded-lg w-full text-amber-100 font-bold flex justify-center items-center"
    >
      <WandSparklesIcon size={23} />
      <span>Redeem</span>
    </button>
  );
};

export default RedeemButton;
