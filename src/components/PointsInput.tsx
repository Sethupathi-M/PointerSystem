import { PointsType } from "@/generated/prisma";
import { Minus, Plus } from "lucide-react";

const PointsInput = ({
  points,
  setPoints,
  pointsType = PointsType.POSITIVE,
  setPointsType,
  disabled = false,
}: {
  points: number;
  setPoints: (points: number) => void;
  pointsType: PointsType;
  setPointsType: (type: PointsType) => void;
  disabled?: boolean;
}) => {
  const isPositive = pointsType === PointsType.POSITIVE;

  return (
    <div
      className={`p-1 rounded-3xl flex items-center justify-center transition-all duration-200 ${
        disabled 
          ? "bg-zinc-600 opacity-50 cursor-not-allowed" 
          : isPositive 
            ? "bg-green-400" 
            : "bg-red-500"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
    
      <input
        type="text"
        className="text-lg font-semibold outline-none w-20 text-center bg-transparent"
        value={points}
        disabled={disabled}
        onChange={(e) => {
          if (!disabled) {
            const val = e.target.value as unknown as number;
            setPoints(parseInt(val.toString()));
          }
        }}
      />
        <div
        className={`focus:outline-1 focus:outline-black ml-1 flex items-center justify-center ${
          disabled 
            ? "opacity-50 cursor-not-allowed" 
            : isPositive 
              ? "hover:bg-green-600" 
              : "hover:bg-red-700"
        } rounded-full transition-all duration-100`}
      >
        <button
        type="button"
          className={`px-1 py-1 bg-transparent transition-all duration-200 ${
            disabled 
              ? "cursor-not-allowed opacity-50" 
              : `cursor-pointer ${isPositive ? "rotate-180" : "rotate-360"}`
          }`}
          disabled={disabled}
          onClick={(e) => {
            if (!disabled) {
              e.stopPropagation();
              setPointsType(
                isPositive ? PointsType.NEGATIVE : PointsType.POSITIVE
              );
            }
          }}
        >
          {isPositive ? <Plus size={20} /> : <Minus size={20} />} 
        </button>
      </div>
    </div>
  );
};

export default PointsInput;
