import React from "react";

const PointsTag = ({
  label,
  price,
  className = "bg-zinc-700",
}: {
  label: string;
  price: number;
  className?: string;
}) => {
  return (
    <div className={`px-3 rounded-lg text-sm ${className}`}>
      <span>{label}</span>
      <span className="font-semibold">{price}</span>
    </div>
  );
};

export default PointsTag;
