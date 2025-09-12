"use client";
export const IconButton = ({
  icon,
  onClick,
  className = "",
  type = "button",
}: {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}) => {
  return (
    <button
      className={`hover:cursor-pointer hover:bg-zinc-700 rounded-full flex items-center justify-center w-10 h-10 transition-colors duration-300 ${className}`}
      onClick={onClick}
      type={type}
    >
      {icon}
    </button>
  );
};
