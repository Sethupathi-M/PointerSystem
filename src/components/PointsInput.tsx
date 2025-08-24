import { PointsType } from "@/types";
import { Play, Plus, Minus } from "lucide-react";

const PointsInput = ({
  points,
  setPoints,
  pointsType = PointsType.POSITIVE,
  setPointsType,
}: {
  points: number;
  setPoints: (points: number) => void;
  pointsType: PointsType;
  setPointsType: (type: PointsType) => void;
}) => {
  const isPositive = pointsType === PointsType.POSITIVE;

  return (
    <div
      className={`p-1 rounded-3xl flex items-center justify-center transition-all duration-200  ${
        isPositive ? "bg-green-400" : "bg-red-500"
      }`}
    >
      <div
        className={`ml-1 flex items-center justify-center ${
          isPositive ? "hover:bg-green-600" : "hover:bg-red-700"
        } rounded-full transition-all duration-100`}
      >
        <button
          className={`px-1 py-1  outline-none cursor-pointer bg-transparent transition-all duration-200 ${
            isPositive ? "rotate-180" : "rotate-360"
          }`}
          onClick={() =>
            setPointsType(
              isPositive ? PointsType.NEGATIVE : PointsType.POSITIVE
            )
          }
        >
          {isPositive ? <Plus size={25} /> : <Minus size={25} />}
          {/* <Play size={20}></Play> */}
        </button>
      </div>
      <input
        type="text"
        className="text-lg font-semibold outline-none w-20 text-center"
        value={points}
        onChange={(e) => {
          const val = e.target.value as unknown as number;
          setPoints(val);
        }}
      />
    </div>
  );
};

export default PointsInput;
