import { WandSparklesIcon } from "lucide-react";
import React from "react";

interface RedeemButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const RedeemButton = ({ onClick, disabled = false, isLoading = false }: RedeemButtonProps) => {
  return (
    <button
      onClick={(e) => { 
        if (onClick) {
          onClick(e);
        } else {
          console.log("clicked Redeem");
        }
        e.stopPropagation();
      }}
      disabled={disabled}
      className={`p-2 cursor-pointer text-lg gap-2 bg-amber-600 hover:bg-amber-500 rounded-lg w-full text-amber-100 font-bold flex justify-center items-center ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <WandSparklesIcon size={23} />
      <span>{isLoading ? "Redeeming..." : "Redeem"}</span>
    </button>
  );
};

export default RedeemButton;
